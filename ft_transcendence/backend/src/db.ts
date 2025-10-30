import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const db = new Database(process.env.DATABASE_PATH || "./data/transcendence.db");

// Initialize schema if not exists
db.prepare(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`
).run();

export default db;
