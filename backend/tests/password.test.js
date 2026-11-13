import { test, before, after } from "node:test";
import assert from "node:assert/strict";

process.env.CLIENT_URL = "http://localhost:5173";
process.env.JWT_SECRET = "test-secret-test-secret-test-secret-123";
process.env.JWT_EXPIRES_IN = "1h";
process.env.NODE_ENV = "test";

const { checkPassword, PASSWORD_MAX_BYTES } = await import("../utils/passwordPolicy.js");
const { default: app } = await import("../app.js");

test("rejects very common passwords", () => {
  for (const pw of ["password", "12345678", "qwertyuiop", "abcd1234", "Password1!"]) {
    const r = checkPassword(pw);
    assert.equal(r.ok, false, pw);
    assert.match(r.errors[0], /too weak/i, pw);
  }
});

test("rejects passwords shorter than 8 characters", () => {
  const r = checkPassword("aB3$x");
  assert.equal(r.ok, false);
  assert.match(r.errors[0], /at least 8/);
});

test("rejects whitespace-only passwords", () => {
  const r = checkPassword("         ");
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /whitespace/.test(e)));
});

test("rejects passwords over 72 BYTES even when under 72 characters (bcrypt truncation)", () => {
  const pw = "é".repeat(40); // 40 characters, 80 bytes
  assert.ok(pw.length < PASSWORD_MAX_BYTES && Buffer.byteLength(pw) > PASSWORD_MAX_BYTES);
  const r = checkPassword(pw);
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => /too long/.test(e)));
});

test("rejects passwords containing the username or email name", () => {
  assert.equal(checkPassword("narutouzumaki99", { username: "narutouzumaki" }).ok, false);
  assert.equal(checkPassword("alice-rocks-2024", { email: "alice@example.com" }).ok, false);
  assert.equal(checkPassword("ALICE-rocks-2024", { email: "alice@example.com" }).ok, false, "case-insensitive");
});

test("accepts strong passwords and passphrases", () => {
  for (const pw of ["x7#Kq9!vLm2@", "correct horse battery staple", "bluefalcon-mango-trampoline"]) {
    const r = checkPassword(pw, { username: "someone", email: "someone@example.com" });
    assert.equal(r.ok, true, pw);
    assert.ok(r.score >= 3);
  }
});

test("returns score, label and feedback for the UI", () => {
  const r = checkPassword("Password1!");
  assert.equal(typeof r.score, "number");
  assert.equal(r.label, "Weak");
  assert.ok(r.warning.length > 0);
  assert.ok(Array.isArray(r.suggestions));
});

test("non-string input is rejected without throwing", () => {
  for (const v of [undefined, null, 12345678, {}, ["a"]]) {
    assert.equal(checkPassword(v).ok, false);
  }
});

let server;
let base;
before(async () => {
  await new Promise((resolve) => (server = app.listen(0, resolve)));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const register = (body) =>
  fetch(`${base}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Requested-With": "x", Origin: "http://localhost:5173" },
    body: JSON.stringify(body),
  });

test("POST /auth/register returns 400 with the reason for a weak password (no DB reached)", async () => {
  const res = await register({ username: "validuser", email: "valid@example.com", password: "Password1!" });
  assert.equal(res.status, 400);
  const { errors } = await res.json();
  const err = errors.find((e) => e.path === "password");
  assert.ok(err);
  assert.match(err.msg, /too weak/i);
});

test("POST /auth/register rejects a password that contains the email name", async () => {
  const res = await register({ username: "validuser", email: "gandalf@example.com", password: "gandalf-the-grey-77" });
  assert.equal(res.status, 400);
  const { errors } = await res.json();
  assert.match(errors.find((e) => e.path === "password").msg, /username or email/);
});

test("login does not apply the strength policy (legacy accounts must still sign in)", async () => {
  const res = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Requested-With": "x", Origin: "http://localhost:5173" },
    // Invalid email on purpose: the request stops at validation, so no database is needed.
    body: JSON.stringify({ email: "not-an-email", password: "password" }),
  });
  assert.equal(res.status, 400);
  const { errors } = await res.json();
  assert.ok(errors.some((e) => e.path === "email"));
  assert.ok(!errors.some((e) => e.path === "password"), "weak password must not be a login validation error");
});
