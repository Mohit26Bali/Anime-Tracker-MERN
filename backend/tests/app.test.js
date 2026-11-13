import { test, before, after } from "node:test";
import assert from "node:assert/strict";

process.env.CLIENT_URL = "http://localhost:5173";
process.env.JWT_SECRET = "test-secret-test-secret-test-secret-123";
process.env.JWT_EXPIRES_IN = "1h";
process.env.NODE_ENV = "test";

const { default: app } = await import("../app.js");
const { default: buildCommentTree } = await import("../utils/buildCommentTree.js");
const { getCached, setCached } = await import("../utils/cache.js");
const { default: errorHandler } = await import("../middlewares/errorHandler.js");

let server;
let base;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

const json = (body, headers = {}) => ({
  method: "POST",
  headers: { "Content-Type": "application/json", ...headers },
  body: JSON.stringify(body),
});

test("GET /health returns ok", async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).status, "ok");
});

test("security headers are set and x-powered-by is hidden", async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.headers.get("x-powered-by"), null);
  assert.ok(res.headers.get("x-content-type-options"));
});

test("unknown route returns JSON 404", async () => {
  const res = await fetch(`${base}/nope`);
  assert.equal(res.status, 404);
});

test("protected routes reject requests without a cookie", async () => {
  for (const path of ["/auth/me", "/watchlist", "/favorites", "/progress", "/bookmarks"]) {
    const res = await fetch(`${base}${path}`);
    assert.equal(res.status, 401, path);
  }
});

test("protected routes reject a forged token", async () => {
  const res = await fetch(`${base}/watchlist`, { headers: { Cookie: "token=not-a-jwt" } });
  assert.equal(res.status, 401);
});

test("CSRF: state-changing request without X-Requested-With is blocked", async () => {
  const res = await fetch(`${base}/auth/login`, json({ email: "a@b.co", password: "x" }));
  assert.equal(res.status, 403);
});

test("CSRF: foreign Origin is blocked even with the header", async () => {
  const res = await fetch(
    `${base}/auth/login`,
    json({ email: "a@b.co", password: "x" }, { "X-Requested-With": "x", Origin: "https://evil.example" })
  );
  assert.equal(res.status, 403);
});

test("validation: register rejects short password and bad username (before any DB access)", async () => {
  const res = await fetch(
    `${base}/auth/register`,
    json({ username: "a!", email: "not-an-email", password: "short" }, { "X-Requested-With": "x", Origin: "http://localhost:5173" })
  );
  assert.equal(res.status, 400);
  const fields = (await res.json()).errors.map((e) => e.path);
  assert.ok(fields.includes("username"));
  assert.ok(fields.includes("email"));
  assert.ok(fields.includes("password"));
});

test("validation: password longer than 72 chars is rejected", async () => {
  const res = await fetch(
    `${base}/auth/register`,
    json({ username: "validname", email: "a@b.co", password: "x".repeat(73) }, { "X-Requested-With": "x" })
  );
  assert.equal(res.status, 400);
});

test("oversized JSON body returns 413", async () => {
  const res = await fetch(
    `${base}/auth/login`,
    json({ email: "a@b.co", password: "x".repeat(30000) }, { "X-Requested-With": "x" })
  );
  assert.equal(res.status, 413);
});

test("errorHandler hides internal messages on 5xx", () => {
  let status;
  let payload;
  const res = { status: (s) => ((status = s), res), json: (p) => (payload = p) };
  const original = console.error;
  console.error = () => {};
  errorHandler(new Error("db password leaked"), {}, res, () => {});
  console.error = original;
  assert.equal(status, 500);
  assert.equal(payload.message, "Internal server error");
});

test("errorHandler keeps messages for intentional 4xx errors", () => {
  let payload;
  const res = { status: () => res, json: (p) => (payload = p) };
  const err = Object.assign(new Error("Watchlist entry not found"), { statusCode: 404 });
  errorHandler(err, {}, res, () => {});
  assert.equal(payload.message, "Watchlist entry not found");
});

test("buildCommentTree nests replies under parents", () => {
  const mk = (id, parent) => ({ _id: id, parentComment: parent, toObject() { return { _id: id, parentComment: parent }; } });
  const tree = buildCommentTree([mk("1", null), mk("2", "1"), mk("3", "2"), mk("4", null)]);
  assert.equal(tree.length, 2);
  assert.equal(tree[0].replies[0]._id, "2");
  assert.equal(tree[0].replies[0].replies[0]._id, "3");
});

test("cache returns values until TTL expires", async () => {
  setCached("k", 42, 20);
  assert.equal(getCached("k"), 42);
  await new Promise((r) => setTimeout(r, 40));
  assert.equal(getCached("k"), undefined);
});
