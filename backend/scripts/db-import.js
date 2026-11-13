// Imports backup/*.json (created by db-export.js) into the configured database.
// Usage (from backend/):  npm run db:import
// Safe by default: refuses to import into a collection that already has documents,
// unless --replace is passed (which empties that collection first).
import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";

const { EJSON } = mongoose.mongo.BSON;

dotenv.config();
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not set (backend/.env).");
  process.exit(1);
}

const args = process.argv.slice(2);
const replace = args.includes("--replace");
const dir = path.resolve(args.find((a) => !a.startsWith("--")) || "backup");
if (!fs.existsSync(dir)) {
  console.error(`Backup folder not found: ${dir}`);
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection.db;

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const name = path.basename(file, ".json");
  const docs = EJSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  const col = db.collection(name);
  const existing = await col.countDocuments();
  if (existing > 0 && !replace) {
    console.log(`skipped ${name}: already has ${existing} documents (use --replace to overwrite)`);
    continue;
  }
  if (existing > 0) await col.deleteMany({});
  if (docs.length) await col.insertMany(docs);
  console.log(`imported ${name}: ${docs.length}`);
}

await mongoose.disconnect();
