// Exports every collection of the configured database to backup/<name>.json (EJSON).
// Usage (from backend/):  npm run db:export        -> writes ./backup/
// Contains user data (including password hashes): keep backup/ private. It is git-ignored.
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

const dir = path.resolve(process.argv[2] || "backup");
fs.mkdirSync(dir, { recursive: true });

await mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection.db;
const collections = await db.listCollections().toArray();

for (const { name } of collections) {
  const docs = await db.collection(name).find({}).toArray();
  fs.writeFileSync(path.join(dir, `${name}.json`), EJSON.stringify(docs, null, 2, { relaxed: false }));
  console.log(`exported ${name}: ${docs.length}`);
}

await mongoose.disconnect();
console.log(`Done -> ${dir}`);
