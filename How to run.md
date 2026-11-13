# How to run — Anime Tracker

Two independent apps: `backend/` (Express API, ESM) and `frontend/` (Vite + React). Commands match the `package.json` scripts (verified by reading; not executed during the documentation audit).

## Prerequisites

- Node.js (no `engines` field; Express 5 / Vite 8 / Mongoose 9 imply a recent LTS, Node 20+ — *assumption*)
- MongoDB reachable locally (`mongodb://localhost:27017`) or a hosted URI
- Internet access (live calls to `https://graphql.anilist.co`)

## Backend

```bash
cd backend
npm install
npm run dev                 # nodemon index.js   (or: npm start)
```

**`.env` files:** `backend/.env` and `frontend/.env` already exist and are configured for local development. **Do not run `copy .env.example .env` over them** (PowerShell overwrites without asking). Only create `.env` from the example on a fresh clone, and set a real `JWT_SECRET`.

The backend now exits at startup with a clear message listing any missing required variables (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `ANILIST_API_URL`); `PORT` defaults to 5000 and `JWT_EXPIRES_IN` to 7d. `.env.example` ships with working local defaults.

`backend/.env` variables:

```text
PORT=5000
MONGO_URI=mongodb://localhost:27017/anime-tracker
JWT_SECRET=<long-random-string>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ANILIST_API_URL=https://graphql.anilist.co
```

Generate a secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
No migrations: Mongoose creates collections/indexes on first use.

## Frontend

```bash
cd frontend
npm install
npm run dev                 # Vite, default http://localhost:5173
```

`frontend/.env`: `VITE_API_URL=http://localhost:5000`
Production build: `npm run build` then `npm run preview`.

## Access

- App: <http://localhost:5173>
- API health: `GET http://localhost:5000/health` → `{"status":"ok",...}` (`GET /` returns "Anime Tracker API is running")

## Tests

```bash
cd backend
npm test        # node --test "tests/**/*.test.js" — 34 tests. 25 need no database; the 9 in `tests/integration.test.js` use a throwaway database on your local MongoDB (`mongodb://127.0.0.1:27017`, override with `TEST_MONGO_URL`) and are skipped if it is not running
```

The frontend has no test script. Verify a production build with `cd frontend && npm run build` (verified working; emits a chunk-size warning only).

## Docker (written, **unverified** — Docker daemon was not running during the audit; `docker compose config` validates)

```bash
# PowerShell
$env:JWT_SECRET = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
docker compose up --build
```

Frontend → <http://localhost:8080>, API → <http://localhost:5000>, MongoDB is internal to the compose network (data in the `mongo-data` volume). `VITE_API_URL` is baked into the frontend image at build time (default `http://localhost:5000`).

## Deploying (checklist)

1. Host MongoDB (e.g. Atlas) and set `MONGO_URI`.
2. Set `NODE_ENV=production`, a `JWT_SECRET` of ≥ 32 random characters, `CLIENT_URL` = exact frontend origin (HTTPS), and `TRUST_PROXY=1` behind one reverse proxy. Set these in the host's environment settings, not in committed files.
3. Serve both frontend and API over **HTTPS** on the **same site** (e.g. `app.example.com` + `api.example.com`) — the auth cookie is `Secure` + `SameSite=Lax`.
4. Build the frontend with `VITE_API_URL` pointing at the public API URL.
5. Point the health check at `GET /health`.

## Moving the project to another drive / computer, and coming back later

**Important:** the app's data lives in **MongoDB, not in this folder**. Copying the folder does not copy your users or tracking data.

1. **Before moving** (MongoDB running): `cd backend && npm run db:export` → writes `backend/backup/*.json` (users incl. password hashes — keep private; git-ignored). Verified: export → import round trip reproduces ids, emails, hashes and timestamps exactly.
2. **Copy the whole folder.** `node_modules/` and `frontend/dist/` can be left out (re-created below). Make sure the hidden files `backend/.env` and `frontend/.env` come along (they are git-ignored, so `git clone` alone would not carry them; if missing, create them from the `.env.example` files and generate a new `JWT_SECRET`).
3. **On the new machine**: install Node.js ≥ 20.19 (22 LTS recommended; see `.nvmrc`) and MongoDB (developed against 8.0.x; `docker compose` uses `mongo:8`). Then:
   ```bash
   cd backend  && npm ci && npm run db:import    # restore data (skips non-empty collections; --replace to overwrite)
   npm run dev
   # second terminal
   cd frontend && npm ci && npm run dev
   ```
4. **Check it works:** `cd backend && npm test`, open <http://localhost:5000/health>, then <http://localhost:5173>.

Verified on 2026-11-13 with a clean copy (no `node_modules`): `npm ci` (both apps), backend tests (34/34 at the last run; re-run on the new machine), frontend production build, and server start + `/health` all succeeded; no absolute paths are hardcoded in the project. If a new `JWT_SECRET` is generated, existing login sessions are invalidated (users sign in again; passwords are unaffected).

## Troubleshooting

- **CORS errors / cookie not set:** `CLIENT_URL` must exactly equal the frontend origin (Vite bumps the port if 5173 is busy). Axios uses `withCredentials: true`.
- **"Missing required environment variables":** fill the listed keys in `backend/.env`.
- **`403 Missing X-Requested-With header` / `Cross-origin request blocked`:** the API's CSRF check. The frontend sends the header automatically via `axiosInstance`; any other client (curl, Postman) must send `X-Requested-With: XMLHttpRequest` on POST/PATCH/DELETE, and `Origin` (if sent) must equal `CLIENT_URL`.
- **`npm audit`:** `--omit=dev` was clean (0 vulnerabilities) for both apps at the time of the audit; re-run before deploying.
- **"MongoDB connection failed" then exit:** `config/db.js` calls `process.exit(1)`; start MongoDB or fix `MONGO_URI`.
- **429 responses:** global limiter 300 req/15 min per IP; auth endpoints 10/15 min. AniList also rate-limits (surfaced as 429).
- **Logged out immediately in production:** cookie is `secure` when `NODE_ENV=production`; requires HTTPS.
