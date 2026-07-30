// src/lib/db.ts
//
// SQLite connection singleton. The DB file path is controlled by
// DB_PATH so tests can point this at a throwaway file instead of the
// real application database.

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

function resolveDbPath(): string {
  if (process.env.DB_PATH) {
    return process.env.DB_PATH;
  }
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'todo.db');
}

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = resolveDbPath();
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

// Used by tests to force a fresh connection after swapping DB_PATH.
export function resetDbConnection(): void {
  if (db) {
    db.close();
    db = null;
  }
}