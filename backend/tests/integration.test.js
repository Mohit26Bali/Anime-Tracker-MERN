// DB-backed integration tests. They run against a temporary, randomly named database that is
// dropped afterwards (never your real data). If MongoDB is not reachable they are skipped.
// Override the server with TEST_MONGO_URL (default mongodb://127.0.0.1:27017).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

process.env.CLIENT_URL = "http://localhost:5173";
process.env.JWT_SECRET = "test-secret-test-secret-test-secret-123";
process.env.JWT_EXPIRES_IN = "1h";
process.env.NODE_ENV = "test";
process.env.AUTH_RATE_LIMIT_MAX = "1000";

const { default: mongoose } = await import("mongoose");
const { default: app } = await import("../app.js");

const dbName = `anime-tracker-test-${crypto.randomBytes(4).toString("hex")}`;
const mongoUrl = `${process.env.TEST_MONGO_URL || "mongodb://127.0.0.1:27017"}/${dbName}`;

let dbAvailable = true;
try {
  await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 2000 });
} catch {
  dbAvailable = false;
}
const opts = { skip: dbAvailable ? false : "MongoDB not reachable" };

let server;
let base;
before(async () => {
  await new Promise((resolve) => (server = app.listen(0, resolve)));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server.close();
  if (dbAvailable) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});

const jars = {};
const call = async (who, method, path, body) => {
  const res = await fetch(base + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      Origin: "http://localhost:5173",
      ...(jars[who] ? { Cookie: jars[who] } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) jars[who] = setCookie.split(";")[0];
  return { status: res.status, data: await res.json().catch(() => null), setCookie };
};

const PW1 = "bluefalcon-mango-trampoline";
const PW2 = "violet-anchor-kettle-84";

test("register creates a user, sets an httpOnly cookie and never returns the password", opts, async () => {
  const r = await call("alice", "POST", "/auth/register", { username: "alice_t", email: "alice@example.com", password: PW1 });
  assert.equal(r.status, 201);
  assert.match(r.setCookie, /HttpOnly/i);
  assert.ok(!("password" in r.data));
  const me = await call("alice", "GET", "/auth/me");
  assert.equal(me.status, 200);
  assert.equal(me.data.email, "alice@example.com");
  assert.ok(!("password" in me.data) && !("tokenVersion" in me.data));
});

test("duplicate email -> 409; wrong password -> generic 401", opts, async () => {
  let r = await call("x", "POST", "/auth/register", { username: "other_t", email: "alice@example.com", password: PW1 });
  assert.equal(r.status, 409);
  r = await call("x", "POST", "/auth/login", { email: "alice@example.com", password: "wrong-password-123" });
  assert.equal(r.status, 401);
  assert.equal(r.data.message, "Invalid email or password");
});

test("watchlist: one entry per anime, and other users cannot read, edit or delete it", opts, async () => {
  await call("bob", "POST", "/auth/register", { username: "bob_t", email: "bob@example.com", password: PW2 });
  const add = await call("alice", "POST", "/watchlist", { animeId: 1, status: "Watching" });
  assert.equal(add.status, 201);
  assert.equal((await call("alice", "POST", "/watchlist", { animeId: 1, status: "Watching" })).status, 409);
  const id = add.data._id;
  assert.equal((await call("bob", "PATCH", `/watchlist/${id}`, { status: "Dropped" })).status, 404);
  assert.equal((await call("bob", "DELETE", `/watchlist/${id}`)).status, 404);
  assert.deepEqual((await call("bob", "GET", "/watchlist")).data, []);
  assert.equal((await call("alice", "GET", "/watchlist")).data.length, 1);
});

test("change password: requires a session", opts, async () => {
  const r = await call("nobody", "PATCH", "/auth/password", { currentPassword: PW1, newPassword: PW2 });
  assert.equal(r.status, 401);
});

test("change password: wrong current password is rejected and nothing changes", opts, async () => {
  const r = await call("alice", "PATCH", "/auth/password", { currentPassword: "not-the-password-1", newPassword: PW2 });
  assert.equal(r.status, 400);
  assert.equal(r.data.message, "Current password is incorrect");
  assert.equal((await call("fresh", "POST", "/auth/login", { email: "alice@example.com", password: PW1 })).status, 200);
});

test("change password: new password must pass the strength policy, differ from the old one, and avoid personal info", opts, async () => {
  let r = await call("alice", "PATCH", "/auth/password", { currentPassword: PW1, newPassword: "Password1!" });
  assert.equal(r.status, 400);
  assert.match(r.data.errors.find((e) => e.path === "newPassword").msg, /too weak/i);

  r = await call("alice", "PATCH", "/auth/password", { currentPassword: PW1, newPassword: PW1 });
  assert.equal(r.status, 400);
  assert.match(r.data.errors[0].msg, /different/);

  r = await call("alice", "PATCH", "/auth/password", { currentPassword: PW1, newPassword: "alice_t-is-the-best-2024" });
  assert.equal(r.status, 400);
  assert.match(r.data.errors[0].msg, /username or email/);
});

test("change password: success keeps this session, signs out other sessions, and swaps the password", opts, async () => {
  // A second session for the same account (e.g. another device), created before the change.
  const second = await call("alice2", "POST", "/auth/login", { email: "alice@example.com", password: PW1 });
  assert.equal(second.status, 200);
  assert.equal((await call("alice2", "GET", "/auth/me")).status, 200);

  const r = await call("alice", "PATCH", "/auth/password", { currentPassword: PW1, newPassword: PW2 });
  assert.equal(r.status, 200);
  assert.match(r.setCookie, /token=/, "a fresh cookie is issued");

  assert.equal((await call("alice", "GET", "/auth/me")).status, 200, "current session stays signed in");
  const old = await call("alice2", "GET", "/auth/me");
  assert.equal(old.status, 401, "other session is signed out");
  assert.match(old.data.message, /sign in again/i);

  assert.equal((await call("l1", "POST", "/auth/login", { email: "alice@example.com", password: PW1 })).status, 401, "old password no longer works");
  assert.equal((await call("l2", "POST", "/auth/login", { email: "alice@example.com", password: PW2 })).status, 200, "new password works");
});

test("stored password is a bcrypt hash and the version counter increments", opts, async () => {
  const user = await mongoose.connection.db.collection("users").findOne({ email: "alice@example.com" });
  assert.match(user.password, /^\$2[aby]\$12\$/, "bcrypt with cost 12");
  assert.equal(user.tokenVersion, 1);
});

test("tokens issued before this feature (no `v` claim) still work for users at version 0", opts, async () => {
  const { default: jwt } = await import("jsonwebtoken");
  const bob = await mongoose.connection.db.collection("users").findOne({ email: "bob@example.com" });
  const legacy = jwt.sign({ id: String(bob._id) }, process.env.JWT_SECRET, { expiresIn: "1h" });
  jars.legacy = `token=${legacy}`;
  assert.equal((await call("legacy", "GET", "/auth/me")).status, 200);
});
