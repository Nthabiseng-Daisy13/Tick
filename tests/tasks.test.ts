// tests/tasks.test.ts
//
// Runs against a fresh, throwaway SQLite file per test — never the real
// application database in data/todo.db.

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const TEST_DB_PATH = path.join(process.cwd(), 'data', 'test-tasks.db');

// Set before any lib/db.ts import resolves getDb(), so the singleton
// picks up the test path on first use in each test file run.
process.env.DB_PATH = TEST_DB_PATH;

import { getDb, resetDbConnection } from '../src/lib/db';
import { migrate } from '../src/lib/migrate';
import {
  createTask,
  updateTask,
  archiveTask,
  listTasks,
  getTaskById,
  isOverdue,
} from '../src/lib/tasks';

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

describe('createTask', () => {
  it('persists all four required fields', () => {
    const task = createTask({
      title: 'Buy groceries',
      description: 'Milk, eggs, bread',
      due_date: '2026-12-01',
      topic: 'Errands',
    });

    const reloaded = getTaskById(task.id);

    expect(reloaded).not.toBeNull();
    expect(reloaded!.title).toBe('Buy groceries');
    expect(reloaded!.description).toBe('Milk, eggs, bread');
    expect(reloaded!.due_date).toBe('2026-12-01T13:00:00');
    expect(reloaded!.topic).toBe('Errands');
    expect(reloaded!.status).toBe('Todo'); // default status
  });
});

describe('updateTask', () => {
  it('saves an edit and the change is visible on a fresh read', () => {
    const task = createTask({
      title: 'Original title',
      due_date: '2026-11-01',
      topic: 'Work',
    });

    updateTask(task.id, { title: 'Updated title', status: 'In-Progress' });

    // Simulate "survives a page reload" by re-fetching independently
    // rather than trusting the return value of updateTask alone.
    const reloaded = getTaskById(task.id);

    expect(reloaded!.title).toBe('Updated title');
    expect(reloaded!.status).toBe('In-Progress');
    // Untouched fields should be unaffected by a partial update
    expect(reloaded!.due_date).toBe('2026-11-01T13:00:00');
    expect(reloaded!.topic).toBe('Work');
  });
});

describe('archiveTask', () => {
  it('removes a task from the active list but keeps it retrievable', () => {
    const task = createTask({
      title: 'Old task',
      due_date: '2026-10-01',
      topic: 'Misc',
    });

    archiveTask(task.id);

    const activeList = listTasks({ includeArchived: false });
    expect(activeList.find((t) => t.id === task.id)).toBeUndefined();

    const archivedList = listTasks({ includeArchived: true });
    expect(archivedList.find((t) => t.id === task.id)).toBeDefined();

    const direct = getTaskById(task.id);
    expect(direct).not.toBeNull();
    expect(direct!.archived_at).not.toBeNull();
  });
});

describe('listTasks sorting', () => {
  beforeEach(() => {
    createTask({ title: 'C task', due_date: '2026-09-03', topic: 'Zebra', status: 'Todo' });
    createTask({ title: 'A task', due_date: '2026-09-01', topic: 'Apple', status: 'Complete' });
    createTask({ title: 'B task', due_date: '2026-09-02', topic: 'Mango', status: 'In-Progress' });
  });

  it('sorts by topic ascending', () => {
    const result = listTasks({ sort: 'topic' });
    expect(result.map((t) => t.topic)).toEqual(['Apple', 'Mango', 'Zebra']);
  });

  it('sorts by status ascending', () => {
    const result = listTasks({ sort: 'status' });
    // Alphabetical: Complete, In-Progress, Todo
    expect(result.map((t) => t.status)).toEqual(['Complete', 'In-Progress', 'Todo']);
  });

  it('sorts by due_date ascending', () => {
    const result = listTasks({ sort: 'due_date' });
    expect(result.map((t) => t.due_date)).toEqual([
  '2026-09-01T13:00:00',
  '2026-09-02T13:00:00',
  '2026-09-03T13:00:00',
]);
  });
});

describe('isOverdue', () => {
  it('flags a task whose due date has passed and is not Complete', () => {
    const referenceNow = new Date('2026-06-01T00:00:00Z');
    const task = { due_date: '2026-05-01', status: 'Todo' as const };

    expect(isOverdue(task, referenceNow)).toBe(true);
  });

  it('does not flag a task whose due date has passed but is Complete', () => {
    const referenceNow = new Date('2026-06-01T00:00:00Z');
    const task = { due_date: '2026-05-01', status: 'Complete' as const };

    expect(isOverdue(task, referenceNow)).toBe(false);
  });
});