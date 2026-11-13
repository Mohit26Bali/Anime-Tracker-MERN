import dotenv from "dotenv";

dotenv.config();

const required = ["MONGO_URI", "JWT_SECRET", "CLIENT_URL", "ANILIST_API_URL"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `Missing required environment variables: ${missing.join(", ")}. ` +
      "Create backend/.env from backend/.env.example (only if .env does not exist) and fill in the values."
  );
  process.exit(1);
}

if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must be at least 32 characters in production.");
  process.exit(1);
}

process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Imported after env validation; app.js and its modules read process.env lazily.
const { default: connectDB } = await import("./config/db.js");
const { default: app } = await import("./app.js");

await connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
