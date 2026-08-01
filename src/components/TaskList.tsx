// src/components/TaskList.tsx

'use client';

import { useEffect, useState, useCallback } from 'react';
import type { TaskWithOverdue, TaskStatus } from '@/lib/tasks';
import { TaskRow } from './TaskRow';
import { TaskForm, TaskFormValues } from './TaskForm';
import { SortControls, SortField } from './SortControls';
import styles from '@/styles/TaskList.module.css';

interface TaskListProps {
  archived?: boolean;
}

export function TaskList({ archived = false }: TaskListProps) {
  const [tasks, setTasks] = useState<TaskWithOverdue[]>([]);
  const [sort, setSort] = useState<SortField>('due_date');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithOverdue | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tasks?sort=${sort}&archived=${archived}`);
      if (!res.ok) throw new Error('Failed to load tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [sort, archived]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleCreate(values: TaskFormValues) {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      setShowForm(false);
      fetchTasks();
    } else {
      const body = await res.json();
      setError(body.error ?? 'Failed to create task');
    }
  }

  async function handleUpdate(values: TaskFormValues) {
    if (!editingTask) return;
    const res = await fetch(`/api/tasks/${editingTask.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      setEditingTask(null);
      fetchTasks();
    } else {
      const body = await res.json();
      setError(body.error ?? 'Failed to update task');
    }
  }

  async function handleStatusChange(id: number, status: TaskStatus) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      fetchTasks();
    }
  }

  async function handleArchive(id: number) {
    const res = await fetch(`/api/tasks/${id}/archive`, { method: 'PATCH' });
    if (res.ok) {
      fetchTasks();
    }
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <SortControls value={sort} onChange={setSort} />
        {!archived && !showForm && !editingTask && (
          <button className={styles.newTaskButton} onClick={() => setShowForm(true)}>
            + New task
          </button>
        )}
      </div>

      {error && <p className={styles.errorBanner}>{error}</p>}

      {showForm && (
        <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {editingTask && (
        <TaskForm
          initialTask={editingTask}
          onSubmit={handleUpdate}
          onCancel={() => setEditingTask(null)}
        />
      )}

      {loading ? (
        <p className={styles.empty}>Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <p className={styles.empty}>
          {archived ? 'No archived tasks yet.' : 'No tasks yet — add one to get started.'}
        </p>
      ) : (
        <div>
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onEdit={setEditingTask}
              onArchive={handleArchive}
              showArchiveAction={!archived}
            />
          ))}
        </div>
      )}
    </div>
  );
}