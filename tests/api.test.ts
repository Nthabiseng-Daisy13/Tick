// tests/tasks.test.ts


describe('placeholder', () => {
  it('runs', () => {
    expect(true).toBe(true);
  });
});// tests/api.test.ts
//
// Exercises the API route handlers directly (no running server needed —
// Next.js route handlers are plain functions taking a Request and
// returning a Response). Runs against its own throwaway SQLite file,
// separate from the one used by tasks.test.ts, so the two test files
// never collide if run in parallel.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const TEST_DB_PATH = path.join(process.cwd(), 'data', 'test-api.db');
process.env.DB_PATH = TEST_DB_PATH;

import { resetDbConnection } from '../src/lib/db';
import { migrate } from '../src/lib/migrate';

import { GET as listTasksRoute, POST as createTaskRoute } from '../src/app/api/tasks/route';
import { PATCH as updateTaskRoute } from '../src/app/api/tasks/[id]/route';
import { PATCH as archiveTaskRoute } from '../src/app/api/tasks/[id]/archive/route';

function freshDb() {
  resetDbConnection();
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
  migrate();
}

beforeEach(() => {
  freshDb();
});

afterEach(() => {
  resetDbConnection();
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
});

function jsonRequest(url: string, method: string, body?: unknown) {
  return new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

describe('POST /api/tasks', () => {
  it('creates a task and returns it with all fields', async () => {
    const req = jsonRequest('http://localhost/api/tasks', 'POST', {
      title: 'Write report',
      description: 'Quarterly summary',
      due_date: '2026-09-01',
      topic: 'Work',
    });

    const res = await createTaskRoute(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.title).toBe('Write report');
    expect(body.topic).toBe('Work');
    expect(body.status).toBe('Todo');
    expect(body.is_overdue).toBe(false);
  });

  it('rejects a task missing a required field', async () => {
    const req = jsonRequest('http://localhost/api/tasks', 'POST', {
      description: 'Missing title and topic',
      due_date: '2026-09-01',
    });

    const res = await createTaskRoute(req);
    expect(res.status).toBe(400);
  });
});

describe('GET /api/tasks', () => {
  it('lists only active tasks by default, sorted by the requested column', async () => {
    await createTaskRoute(jsonRequest('http://localhost/api/tasks', 'POST', {
      title: 'Zebra task', due_date: '2026-09-01', topic: 'Zebra',
    }));
    await createTaskRoute(jsonRequest('http://localhost/api/tasks', 'POST', {
      title: 'Apple task', due_date: '2026-09-02', topic: 'Apple',
    }));

    const res = await listTasksRoute(
      new Request('http://localhost/api/tasks?sort=topic')
    );
    const body = await res.json();

    expect(body.map((t: { topic: string }) => t.topic)).toEqual(['Apple', 'Zebra']);
  });
});

describe('PATCH /api/tasks/[id]', () => {
  it('updates a task and the change is reflected in a subsequent list call', async () => {
    const createRes = await createTaskRoute(jsonRequest('http://localhost/api/tasks', 'POST', {
      title: 'Original', due_date: '2026-09-01', topic: 'Misc',
    }));
    const created = await createRes.json();

    const patchRes = await updateTaskRoute(
      jsonRequest(`http://localhost/api/tasks/${created.id}`, 'PATCH', { status: 'In-Progress' }),
      { params: Promise.resolve({ id: String(created.id) }) }
    );
    expect(patchRes.status).toBe(200);

    const listRes = await listTasksRoute(new Request('http://localhost/api/tasks'));
    const list = await listRes.json();
    const updated = list.find((t: { id: number }) => t.id === created.id);

    expect(updated.status).toBe('In-Progress');
  });

  it('returns 404 for a non-existent task', async () => {
    const res = await updateTaskRoute(
      jsonRequest('http://localhost/api/tasks/999999', 'PATCH', { status: 'Complete' }),
      { params: Promise.resolve({ id: '999999' }) }
    );
    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/tasks/[id]/archive', () => {
  it('archives a task so it no longer appears in the default list', async () => {
    const createRes = await createTaskRoute(jsonRequest('http://localhost/api/tasks', 'POST', {
      title: 'To be archived', due_date: '2026-09-01', topic: 'Misc',
    }));
    const created = await createRes.json();

    const archiveRes = await archiveTaskRoute(
      jsonRequest(`http://localhost/api/tasks/${created.id}/archive`, 'PATCH'),
      { params: Promise.resolve({ id: String(created.id) }) }
    );
    expect(archiveRes.status).toBe(200);

    const activeListRes = await listTasksRoute(new Request('http://localhost/api/tasks?archived=false'));
    const activeList = await activeListRes.json();
    expect(activeList.find((t: { id: number }) => t.id === created.id)).toBeUndefined();

    const archivedListRes = await listTasksRoute(new Request('http://localhost/api/tasks?archived=true'));
    const archivedList = await archivedListRes.json();
    expect(archivedList.find((t: { id: number }) => t.id === created.id)).toBeDefined();
  });
});