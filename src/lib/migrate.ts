// src/lib/migrate.ts
//
// Applies schema.sql to whatever database getDb() currently points at.
// Safe to run multiple times (all statements use IF NOT EXISTS).
//
// Usage: npm run migrate

import fs from 'fs';
import path from 'path';
import { getDb } from './db';

export function migrate(): void {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  const db = getDb();
  db.exec(schema);
}

// Allow running directly via `npm run migrate` (tsx src/lib/migrate.ts)
if (require.main === module) {
  migrate();
  console.log('Migration complete.');
}