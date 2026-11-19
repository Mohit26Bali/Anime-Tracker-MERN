# Anime Tracker

A full-stack anime tracking app built with the MERN stack (MongoDB, Express, React, Node.js) and the [AniList](https://anilist.co) GraphQL API. Search anime, track your watching progress, build a watchlist, favorite anime, and write threaded reviews and comments.

This project was built as a learning exercise in backend architecture, GraphQL integration, authentication, and full-stack app design — the codebase favors clarity and explicit patterns over cleverness.

## Features

- **Auth** — register/login with JWT stored in an `httpOnly` cookie, protected routes, editable profile
- **Discover** — search with filters (genre, theme/tag, format, status, season, sort), trending, seasonal, and genre-based browse rows, a Netflix-style hero banner
- **Anime details** — synopsis, cast with voice actors, relations (prequels/sequels), recommendations, full metadata (studio, source, rankings, popularity)
- **Character details** — bios with spoiler-safe text, appearances across anime/manga
- **Personal tracking** — watchlist (with status), favorites, episode progress tracking
- **Reviews & comments** — star ratings, editable reviews, threaded (nested) comment replies
- **Polish** — page transitions, toasts, skeleton loading states, hover animations, responsive layout

## Tech Stack

**Backend** — Node.js, Express, MongoDB/Mongoose, JWT, bcrypt, Helmet, CORS, express-rate-limit, express-validator

**Frontend** — React 19, Vite, React Router, Redux Toolkit (auth/UI state), TanStack Query (server state + caching), Tailwind CSS v4, Framer Motion, Axios

**External data** — [AniList GraphQL API](https://docs.anilist.co/) (public, no OAuth required)

## Architecture

- **Backend**: MVC with an explicit service layer — `Routes → Controllers (thin) → Services (business logic) → MongoDB / AniList`. AniList responses pass through a response-mapper layer so the rest of the app never touches AniList's raw GraphQL shape.
- **Frontend**: feature-based folder structure. Redux Toolkit owns client/auth state; TanStack Query owns all server data (anime, reviews, watchlist, etc.) with its own caching layer, separate from the backend's in-memory AniList response cache.
- **Data ownership**: the backend's MongoDB only stores user-generated data (accounts, watchlists, favorites, reviews, progress) — it never persists AniList's own anime/character data, which is always fetched live (and cached temporarily) from AniList.

## Project Structure

```
backend/
  config/        # DB connection setup
  controllers/   # thin request handlers
  middlewares/   # auth, error handling, rate limiting
  models/        # Mongoose schemas
  routes/        # Express route definitions
  services/      # business logic + AniList GraphQL client/queries/mappers
  utils/         # small stateless helpers (cache, token generation)
  validators/    # express-validator rule sets

frontend/
  src/
    features/    # feature-scoped components, hooks, API calls
    components/  # shared, feature-agnostic UI
    layouts/     # Navbar, Footer, AuthLayout, etc.
    pages/       # route-level components
    hooks/       # shared reusable hooks
    services/    # Axios API clients
    store/       # Redux Toolkit store/slices
    utils/       # shared helpers
```

## Getting Started

### Prerequisites

- Node.js
- A local MongoDB instance running (e.g. `mongodb://localhost:27017`)

### Setup

1. **Backend**

   ```bash
   cd backend
   npm install
   cp .env.example .env   # then fill in the values (see below)
   npm run dev
   ```

2. **Frontend** (in a separate terminal)

   ```bash
   cd frontend
   npm install
   cp .env.example .env   # then fill in the values (see below)
   npm run dev
   ```

3. Open **http://localhost:5173**.

### Environment Variables

**`backend/.env`**

| Variable | Description |
|---|---|
| `PORT` | Port the Express server runs on (e.g. `5000`) |
| `MONGO_URI` | MongoDB connection string (e.g. `mongodb://localhost:27017/anime-tracker`) |
| `JWT_SECRET` | Random secret used to sign JWTs — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `JWT_EXPIRES_IN` | Token/cookie lifetime (e.g. `7d`) |
| `CLIENT_URL` | Frontend origin, for CORS (e.g. `http://localhost:5173`) |
| `ANILIST_API_URL` | AniList's public GraphQL endpoint: `https://graphql.anilist.co` |

**`frontend/.env`**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API origin (e.g. `http://localhost:5000`) |

> If your frontend runs on a different port than `5173` (Vite auto-increments if the port is busy), update `CLIENT_URL` in the backend `.env` to match, or CORS will reject requests.

## Notes

- Anime and character data is provided by [AniList](https://anilist.co) via their public GraphQL API. This project is not affiliated with AniList.
- No AniList data is stored permanently — it's fetched live and cached temporarily (5–30 minutes depending on endpoint) to reduce upstream API load.

## Status and limitations

A working MERN app, hardened for a small deployment: CSRF defence (the API requires an `X-Requested-With` header), server-side input validation, a password-strength policy, and change-password with sign-out of other devices. Docker files for the backend and frontend are included.

Known limitations: bookmarks are available through the API only (there is no UI for them yet), there is no forgot-password flow, and the Docker images have not been verified end to end.
