import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import animeRoutes from "./routes/animeRoutes.js";
import characterRoutes from "./routes/characterRoutes.js";
import { globalLimiter } from "./middlewares/rateLimiter.js";
import csrfProtection from "./middlewares/csrf.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

// Builds the Express app without side effects (no DB connection, no listen),
// so it can be imported by tests. index.js is the runtime entry point.
const app = express();

// Set TRUST_PROXY=1 when running behind one reverse proxy (Render, Nginx, ...)
// so rate limiting and req.ip use the real client address.
const trustProxy = Number(process.env.TRUST_PROXY);
if (Number.isInteger(trustProxy) && trustProxy > 0) {
  app.set("trust proxy", trustProxy);
}
app.disable("x-powered-by");

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(globalLimiter);
app.use(csrfProtection);

app.get("/", (req, res) => {
  res.send("Anime Tracker API is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/progress", progressRoutes);
app.use("/bookmarks", bookmarkRoutes);
app.use("/reviews", reviewRoutes);
app.use("/anime", animeRoutes);
app.use("/characters", characterRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
