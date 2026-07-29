// src/lib/tasks.ts

export type TaskStatus = 'Todo' | 'In-Progress' | 'Complete';

export interface TaskInput {
  title: string;
  description?: string;
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

export function createTask(data: TaskInput) {
  // TODO: validate + insert into SQLite
}

export function updateTask(id: number, data: Partial<TaskInput>) {
  // TODO: partial update
}

export function archiveTask(id: number) {
  // TODO: set archived_at
}

export function listTasks(opts: { sort?: string; includeArchived?: boolean }) {
  // TODO: query + sort
  return [];
}

export function isOverdue(task: Task): boolean {
  return new Date(task.due_date) < new Date() && task.status !== 'Complete';
}