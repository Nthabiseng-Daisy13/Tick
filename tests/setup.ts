// tests/setup.ts
import { beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';

const TEST_DB = path.join(process.cwd(), 'data', 'test.db');
process.env.DB_PATH = TEST_DB;

beforeEach(() => {
  // run migrate.ts logic against TEST_DB fresh each time
});

afterEach(() => {
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
});