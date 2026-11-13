# PROJECT_CONTEXT — Anime Tracker

> Audit date: 2026-11-13 (updated 2026-11-14). Started as a static source review; the backend was later run, hardened and tested (see sections 3-7), but the frontend UI has never been exercised in a browser. Source code is the source of truth.

## 1. Project Identity

- **Name:** Anime Tracker — **Type:** Full-stack web app (MERN + external GraphQL API)
- **Purpose:** Browse/search anime (data from AniList) and keep personal tracking data: watchlist, favorites, episode progress, reviews, threaded comments.
- **Stack (confirmed from package.json):** Backend — Node (ESM), Express 5, Mongoose 9, bcryptjs, jsonwebtoken, cookie-parser, helmet, cors, express-rate-limit 8, express-validator 7, dotenv. Frontend — React 19, Vite 8, React Router 7, Redux Toolkit (auth only), TanStack Query 5, Axios, Framer Motion, Tailwind CSS 4. DB: MongoDB (version not pinned). External: AniList GraphQL (no auth).
- **Status:** Functional MVP / learning project. No tests, no CI, no deploy config.

## 2. Functional Context

**Implemented:** register/login/logout/update profile (`/auth`); anime search, trending, details, recommendations (`/anime`); character search/details (`/characters`); watchlist with status enum (`Watching, Completed, Dropped, On Hold, Plan To Watch`); favorites; episode progress; per-anime reviews with star rating; threaded comments; frontend extras: hero banner, spoiler-hiding text, search history hook, skeletons, toasts.
**Partial:** *Bookmarks* — backend model/route/controller/service/validator exist (`/bookmarks`), but `frontend/src/services` has no bookmark client (no `bookmarkApi.js`), so no UI uses it.
**Workflows:** Register → cookie set → `fetchCurrentUser` dispatched on app load (`App.jsx`) → protected pages `/browse /watchlist /favorites /profile`. Public pages: `/`, `/login`, `/register`, `/search`, `/anime/:id`, `/characters/:id`.
**Business rules:** one watchlist entry per (user, animeId) (unique index + 409); users edit/delete only their own entries/reviews/comments (queries filter `{_id, user}`); comments form a tree via `parentComment`, assembled by `backend/utils/buildCommentTree.js`.

## 3. Technical Context

**Architecture:** `routes → validators (express-validator) → controllers (thin) → services (logic) → Mongoose / AniList`. AniList responses are mapped in `services/animeService.js` / `characterService.js`; GraphQL fragments in `services/anilist/fragments.js`; HTTP via plain `fetch` in `services/anilist/anilistClient.js`.
**Backend tree:** `backend/{index.js, config/db.js, controllers, middlewares (authMiddleware = protect, rateLimiter, errorHandler, notFound), models, routes, services, utils (cache.js, generateToken.js, buildCommentTree.js), validators}`.
**Frontend tree:** `frontend/src/{App.jsx, main.jsx, pages, layouts, components, features/<domain>/{components,hooks}, services/*Api.js, store/store.js, hooks, utils, data/animeQuotes.js}`. Redux holds only `auth` (`features/auth/authSlice.js`); TanStack Query hooks live in `features/*/hooks`.
**Database (MongoDB/Mongoose):** `User{username unique, email unique lowercase, password bcrypt-hash, avatar}`; `Watchlist{user, animeId Number, status}` with unique(user, animeId); `Favorite`, `Progress`, `Bookmark`; `Review{user, animeId, rating, text}`; `Comment{user, review, parentComment|null, text}` indexed on review. AniList data is never persisted.
**API (JSON; base = backend origin):**

- Auth: `POST /auth/register`, `POST /auth/login` (authLimiter), `GET /auth/me`, `PATCH /auth/me`, `PATCH /auth/password` (protect + authLimiter; body `{currentPassword, newPassword}`; wrong current → 400, weak/same/personal new password → 400 `{errors}`; success re-issues this browser's cookie and signs out all other sessions), `POST /auth/logout`
- Anime (public): `GET /anime/search`, `/anime/trending`, `/anime/:id`, `/anime/:id/recommendations`
- Characters (public): `GET /characters/search`, `/characters/:id`
- Protected (`router.use(protect)`): `/watchlist` (POST, GET, PATCH /:id, DELETE /:id), `/favorites` (POST, GET, DELETE /:id), `/progress` (POST, GET, PATCH /:id), `/bookmarks` (POST, GET, DELETE /:id)
- Reviews: `POST /reviews`, `GET /reviews/anime/:animeId` (public), `PATCH|DELETE /reviews/:id`; comments nested at `/reviews/:reviewId/comments` (POST, GET public, PATCH|DELETE /:id)
**Auth:** JWT `{id}` signed with `JWT_SECRET` in httpOnly cookie `token` (`sameSite: lax`, `secure` in production, 7 d). `protect` verifies the JWT, loads the user (minus password) and rejects the token if its `v` claim differs from `User.tokenVersion` (missing `v` counts as 0, so pre-existing tokens stay valid). `tokenVersion` is incremented on password change = server-side session invalidation. No refresh tokens, no roles.
**Config:** backend `.env` (PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, CLIENT_URL, ANILIST_API_URL); frontend `VITE_API_URL`.
**Caching:** per-process in-memory `Map` with TTL (`utils/cache.js`), 5–30 min per endpoint.

**Operations / portability (added 2026-11-13):** `engines.node >=20.19` in both package.json files, `.nvmrc` = 22 (audited on Node 22.17.1); MongoDB 8.0.4 locally. Data lives only in MongoDB — `backend/scripts/db-export.js` / `db-import.js` (`npm run db:export|db:import`) dump/restore every collection as EJSON in `backend/backup/` (git-ignored, contains password hashes). Import skips non-empty collections unless `--replace`. `CLAUDE.md` at the project root points AI tools to these docs. `docker-compose.yml` uses `mongo:8`.

## 4. Known Issues

- Tests: backend has 34 `node:test` tests (`app.test.js`, `password.test.js` need no DB; `integration.test.js` uses a temporary randomly-named MongoDB database that it drops afterwards and **skips itself if Mongo is unreachable** — covers register/login, cookies, 409s, watchlist ownership, change-password flow, session invalidation, legacy tokens. Non-DB tests cover: health, headers, auth gating, CSRF, validation, error handler, comment tree, cache). **No tests hit MongoDB** and there are no frontend tests; service-layer logic (ownership, duplicates) was verified only by a manual end-to-end script, not a committed test.
- Docker images (`backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml`) were written and `docker compose config` validates, but they were **never built** (Docker daemon was not running during the audit).
- Frontend bundle is a single 545 kB chunk (no code splitting); no frontend lint script.
- In-memory cache has no max size; expired entries are only removed when re-read (memory growth with many distinct search queries).
- Bookmarks are backend-only (dead feature from the UI's perspective).
- `registerUser` checks only email uniqueness; duplicate username relies on Mongo 11000 → 409 handler.
- `/browse` requires login but `/search` does not (possibly intentional; unverified).

## 5. Security Considerations

**Existing:** bcrypt (12 rounds), httpOnly cookie (`sameSite: lax`, `secure` in production), helmet, CORS allow-list with credentials, express-validator, global + auth rate limiting, ownership-scoped queries, generic login failure message, plus (added 2026-11-13, verified by tests + a manual end-to-end run on a throwaway DB):

- **CSRF defence** (`middlewares/csrf.js`): state-changing requests need header `X-Requested-With` (set by `frontend/src/services/axiosInstance.js`) and any `Origin` must equal `CLIENT_URL`. Any new non-axios client must send that header.
- **`TRUST_PROXY=<hops>`** env enables Express `trust proxy` (set `1` behind one reverse proxy) so rate limiting sees real client IPs.
- **Validation:** username 3–30 chars `[A-Za-z0-9_.-]`; password per the strength policy below; avatar must be an http(s) URL (≤500); JSON body limit 20 kB.
- **Password policy** (`backend/utils/passwordPolicy.js`, enforced on **registration only** via `validators/authValidator.js`; login stays lenient so pre-policy accounts can sign in): ≥ 8 characters, ≤ 72 **bytes** (bcrypt truncates silently beyond that, so it is rejected instead), not whitespace-only, must not contain the username or the email local part (case-insensitive), and a [zxcvbn-ts](https://zxcvbn-ts.github.io/zxcvbn/) score ≥ 3 of 4 (blocks common/keyboard/date/leet patterns and the dictionary of leaked passwords bundled with the library). Passphrases are encouraged; there are no forced character-class rules. The frontend mirrors this in `frontend/src/utils/passwordPolicy.js` + `hooks/usePasswordStrength.js` + `features/auth/PasswordStrengthMeter.jsx` (meter and checklist in `RegisterForm`; zxcvbn dictionaries are lazy-loaded chunks). **The two implementations must be kept in sync; the backend is authoritative.** Dependencies: `@zxcvbn-ts/core`, `language-common`, `language-en` (v4, `ZxcvbnFactory` API; CommonJS, imported by default export in the backend). Verified client/server agreement on 12 sample passwords and end-to-end registration on a throwaway DB.
- **Error handler** returns a generic "Internal server error" for 5xx (details only in server logs).
- **Startup checks** (`index.js`): required env vars; `JWT_SECRET` ≥ 32 chars when `NODE_ENV=production`; graceful SIGTERM/SIGINT shutdown. `GET /health` for probes. `x-powered-by` disabled.
- `npm audit --omit=dev` reported 0 vulnerabilities for backend and frontend at the time of the audit; CI re-checks at `high`.

**Remaining findings (static review + limited dynamic checks; not a penetration test):**

- **Low — No password reset ("forgot password") or email verification:** needs an email provider. The login page shows a "Forgot Password?" link that has no backend. Rate limits are per-IP only, no per-account lockout/backoff on login.
- **Low — JWTs are not individually revocable and there are no refresh tokens;** a stolen cookie is valid up to 7 days unless the password is changed (which invalidates all older tokens via `tokenVersion`). Logout only clears this browser's cookie (no "sign out everywhere" button; changing the password does that).
- **Low — Cookie `sameSite: lax`:** frontend and API must be on the same *site* (same registrable domain) in production; cross-site deployment will not send the cookie.
- **Low — `helmet()` defaults only** (no tuned CSP); the frontend is served separately (nginx config adds basic headers only).
- **Low — Existing users with usernames not matching the new pattern** can still log in but cannot resubmit that username via profile update.
- **Info — `.env` files exist in the working tree** (`backend/.env`, `frontend/.env`); `.env` is git-ignored. Values not reproduced here.
- **Info — JWTs cannot be revoked;** logout only clears the cookie.

## 6. Development Guidelines

- New backend resource: `models/X.js`, `validators/xValidator.js`, `services/xService.js`, `controllers/xController.js`, `routes/xRoutes.js`, mount in `index.js`. Controllers: `try { … } catch (e) { next(e) }`; services throw `Error` with `.statusCode`.
- Always scope user data queries by `user: userId`.
- New frontend feature: `features/<domain>/` + `services/<domain>Api.js` via `axiosInstance`; server data through TanStack Query, auth state through Redux.
- Access AniList only through the service/mapper layer.
- Do not break: cookie auth (`withCredentials` + CORS origin), the unique watchlist index, mapper isolation.

## 7. Improvement Roadmap

*Done 2026-11-13:* startup env validation + `PORT` default, `trust proxy`, CSRF defence, stricter validation, generic 5xx errors, health endpoint, graceful shutdown, 14 backend tests, Dockerfiles/compose (unbuilt), GitHub Actions CI (`.github/workflows/ci.yml`, not yet run — the folder is not a git repo).
** Build and test the Docker images; DB-backed integration tests (e.g. `mongodb-memory-server`, a new dev dependency — justify first) covering ownership/duplicate rules; run the full UI manually in a browser (frontend flows were never exercised). *Effort S–M.*

- **P2:** Bounded LRU cache; pagination for watchlist/favorites/reviews; wire up or delete bookmarks; per-account login throttling; frontend code splitting + lint + component tests; invalidate tokens on password change (token version). *Effort M.*
- **P3:** Refresh-token flow, account deletion, MAL import, theming.

## 8. Instructions for Future AI Assistants

1. Read this document before modifying the project.
2. Inspect the actual source code before making assumptions.
3. Treat source code as the source of truth if documentation is outdated.
4. Preserve the existing architecture (routes → controllers → services) unless there is a justified reason to change it.
5. Do not unnecessarily rewrite existing implementations.
6. Do not introduce technologies or dependencies without a clear reason.
7. Understand existing business rules (ownership scoping, unique watchlist entry) before modifying them.
8. Run relevant tests after making changes (none exist yet — add some alongside your change).
9. Update PROJECT_CONTEXT.md when significant architectural or functional changes are made.
10. Never expose secrets or commit credentials (`backend/.env` holds real configuration).
