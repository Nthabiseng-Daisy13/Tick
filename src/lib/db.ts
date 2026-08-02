import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
 
let db: DatabaseSync | null = null;
 
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
 
export function getDb(): DatabaseSync {
  if (!db) {
    const dbPath = resolveDbPath();
    db = new DatabaseSync(dbPath);
    db.exec('PRAGMA journal_mode = WAL');
    db.exec('PRAGMA foreign_keys = ON');
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