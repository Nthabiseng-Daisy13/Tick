// src/lib/tasks.ts
import {getDb} from './db';

export type TaskStatus = 'Todo' | 'In-Progress' | 'Complete';

export interface TaskInput {
  title: string;
  description?: string | null;
  due_date: string;
  topic: string;
  status?: TaskStatus;
}

export interface Task extends TaskInput {
  id: number;
  status: TaskStatus;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskWithOverdue extends Task{
    is_overdue: boolean;
}

const VALID_STATUSES: TaskStatus[] = ['Todo', 'In-Progress', 'Complete'];
const SORTABLE_COLUMNS = ['topic', 'status', 'due_date'] as const;
type SortableColumn = (typeof SORTABLE_COLUMNS)[number];

function isValidStatus(value: unknown):value is TaskStatus{
    return typeof value === 'string' && VALID_STATUSES.includes(value as TaskStatus);
}
function isSortableColumn(value: unknown):value is SortableColumn{
    return typeof value === 'string' && SORTABLE_COLUMNS.includes(value as SortableColumn);
}


export function isOverdue(task: Pick<Task, 'due_date' | 'status'>, now:Date = new Date()): boolean {
  return new Date(task.due_date) < now && task.status !== 'Complete';
}

function attachOverdue(task:Task):TaskWithOverdue{
    return {...task, is_overdue: isOverdue(task)};

}

export function createTask(data: TaskInput): TaskWithOverdue {
  // TODO: validate + insert into SQLite
    if(!data.title || !data.title.trim()){
        throw new Error('Title is required');
    }

    if(!data.due_date){
        throw new Error('Due Date is required');
    }
    if(!data.topic || !data.topic.trim()){
        throw new Error('Topic is required');
    }
    let dueDate = data.due_date;

    // If only a date is supplied, default to 13:00
    if (!dueDate.includes('T')) {
        dueDate += 'T13:00:00';
    }
    if (data.status && !isValidStatus(data.status)) {
        throw new Error(`Invalid status: ${data.status}`);
    }

    const db = getDb();
    const query = db.prepare(`INSERT INTO tasks (title, description, due_date, topic, status)
        VALUES (@title, @description, @due_date, @topic, @status)`);
    
    const result = query.run({
        title: data.title.trim(),
        description: data.description ?? null,
        due_date: dueDate,
        topic: data.topic.trim(),
        status: data.status ?? 'Todo',
        });

    const created = getTaskById(Number(result.lastInsertRowid));
    if (!created) {
        throw new Error('Failed to load task after creation');
    }
    
    return created;

}

// getTaskById — internal helper, also useful for tests
export function getTaskById(id: number): TaskWithOverdue | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined;
  return row ? attachOverdue(row) : null;
}

export function updateTask(id: number, data: Partial<TaskInput>): TaskWithOverdue {
  const existing = getTaskById(id);
  if (!existing) {
    throw new Error(`Task ${id} not found`);
  }
  if (data.status !== undefined && !isValidStatus(data.status)) {
    throw new Error(`Invalid status: ${data.status}`);
  }

  // Start each value at its existing default, then conditionally overwrite
  // in a separate statement (not a ternary). This shape narrows reliably
  // regardless of TypeScript config quirks — the assignment and the
  // "was it provided?" check are two separate statements, so there's no
  // ternary expression for the type checker to potentially fail to narrow.
  let dueDate: string = existing.due_date;
  if (data.due_date !== undefined) {
    dueDate = data.due_date;
    if (!dueDate.includes('T')) {
      dueDate += 'T13:00:00';
    }
  }

  let title: string = existing.title;
  if (data.title !== undefined) {
    title = data.title.trim();
  }

  let description: string | null = existing.description ?? null;
  if (data.description !== undefined) {
    description = data.description;
  }

  let topic: string = existing.topic;
  if (data.topic !== undefined) {
    topic = data.topic.trim();
  }

  let status: TaskStatus = existing.status;
  if (data.status !== undefined) {
    status = data.status;
  }

  const db = getDb();
  const stmt = db.prepare(`
    UPDATE tasks
    SET title = @title,
        description = @description,
        due_date = @due_date,
        topic = @topic,
        status = @status,
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = @id
  `);

  stmt.run({
    id,
    title,
    description,
    due_date: dueDate,
    topic,
    status,
  });

  const updated = getTaskById(id);
  if (!updated) {
    throw new Error('Failed to load task after update');
  }
  return updated;
}
// archiveTask — never deletes. Sets archived_at on the same row.

export function archiveTask(id: number): TaskWithOverdue {
  const existing = getTaskById(id);
  if (!existing) {
    throw new Error(`Task ${id} not found`);
  }
 
  const db = getDb();
  db.prepare(`
    UPDATE tasks
    SET archived_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
        updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    WHERE id = ?
  `).run(id);
 
  const archived = getTaskById(id);
  if (!archived) {
    throw new Error('Failed to load task after archiving');
  }
  return archived;
}

// listTasks — filter by archived state, sort by a whitelisted column

export interface ListTasksOptions {
  sort?: string;
  direction?: 'asc' | 'desc';
  includeArchived?: boolean;
}
 
export function listTasks(opts: ListTasksOptions = {}): TaskWithOverdue[] {
  const db = getDb();
 
  const sortColumn: SortableColumn = isSortableColumn(opts.sort) ? opts.sort : 'due_date';
  const direction = opts.direction === 'desc' ? 'DESC' : 'ASC';
 
  const whereClause = opts.includeArchived ? '' : 'WHERE archived_at IS NULL';
 
  // sortColumn/direction come only from the whitelist above, never raw
  // user input, so this string build is safe from SQL injection.
  const query = `
    SELECT * FROM tasks
    ${whereClause}
    ORDER BY ${sortColumn} ${direction}
  `;
 
  const rows = db.prepare(query).all() as unknown as Task[];
  return rows.map(attachOverdue);
}

//Stats

export interface TaskStats {
  totalActive: number;
  totalArchived: number;
  byStatus: Record<TaskStatus, number>;
  overdueCount: number;
  completionRate: number; // percentage of active tasks that are Complete
  byTopic: { topic: string; count: number }[];
}
 
export function getStats(): TaskStats {
  const db = getDb();
 
  const activeTasks = listTasks({ includeArchived: false });
  const archivedCountRow = db
    .prepare('SELECT COUNT(*) as count FROM tasks WHERE archived_at IS NOT NULL')
    .get() as { count: number };
 
  const byStatus: Record<TaskStatus, number> = {
    Todo: 0,
    'In-Progress': 0,
    Complete: 0,
  };
  for (const task of activeTasks) {
    byStatus[task.status] += 1;
  }
 
  const overdueCount = activeTasks.filter((t) => t.is_overdue).length;
 
  const completionRate =
    activeTasks.length === 0
      ? 0
      : Math.round((byStatus.Complete / activeTasks.length) * 100);
 
  const topicRows = db
    .prepare(
      `SELECT topic, COUNT(*) as count FROM tasks WHERE archived_at IS NULL GROUP BY topic ORDER BY count DESC`
    )
    .all() as { topic: string; count: number }[];
 
  return {
    totalActive: activeTasks.length,
    totalArchived: archivedCountRow.count,
    byStatus,
    overdueCount,
    completionRate,
    byTopic: topicRows,
  };
}
 