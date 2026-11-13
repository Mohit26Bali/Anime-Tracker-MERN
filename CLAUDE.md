# Anime Tracker — AI assistant entry point

Read these first, in order:

1. `PROJECT_CONTEXT.md` — architecture, API, data model, security, known issues, conventions. **Start here.**
2. `How to run.md` — verified setup, env vars, tests, Docker, moving/restoring the project.
3. `README.md` — short overview.

Quick facts

- MERN app: `backend/` (Express 5, Mongoose 9, ESM, port 5000) + `frontend/` (React 19, Vite, port 5173). Data from the public AniList GraphQL API.
- Backend flow: `routes → validators → controllers → services → Mongoose/AniList`. Always scope user data by `user: userId`.
- Backend tests: `cd backend && npm test` (34 tests; the 9 DB-backed ones use a throwaway database and skip if Mongo is down). Frontend check: `cd frontend && npm run build`.
- Sessions: JWT carries `v` = `User.tokenVersion`; changing the password (`PATCH /auth/password`) bumps it and signs out other devices.
- Registration and password changes enforce a password strength policy (zxcvbn-ts) on the server; the register form shows a live meter. Keep `backend/utils/passwordPolicy.js` and `frontend/src/utils/passwordPolicy.js` in sync.
- State-changing API calls require header `X-Requested-With` (CSRF defence); the frontend's `axiosInstance` adds it.
- `backend/.env` holds real config. Never print, commit or overwrite it (do not run `copy .env.example .env` over an existing file). `backend/backup/` holds exported user data — keep private.
- Update `PROJECT_CONTEXT.md` when architecture or behaviour changes.
