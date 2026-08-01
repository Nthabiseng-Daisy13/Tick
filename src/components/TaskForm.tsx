// src/components/TaskForm.tsx

import { useState } from 'react';
import type { TaskStatus, TaskWithOverdue } from '@/lib/tasks';
import styles from '@/styles/TaskForm.module.css';

export interface TaskFormValues {
  title: string;
  description: string;
  due_date: string;
  topic: string;
  status: TaskStatus;
}

interface TaskFormProps {
  initialTask?: TaskWithOverdue;
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
}

const STATUS_OPTIONS: TaskStatus[] = ['Todo', 'In-Progress', 'Complete'];

export function TaskForm({ initialTask, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [dueDate, setDueDate] = useState(initialTask?.due_date ?? '');
  const [topic, setTopic] = useState(initialTask?.topic ?? '');
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status ?? 'Todo');
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initialTask);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !dueDate || !topic.trim()) {
      setError('Title, due date, and topic are required.');
      return;
    }

    setError(null);
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate,
      topic: topic.trim(),
      status,
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>{isEditing ? 'Edit task' : 'New task'}</h2>

      {error && <p className={styles.error}>{error}</p>}

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Title</span>
        <input
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Description</span>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </label>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Due date</span>
          <input
            type="date"
            className={styles.input}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Topic</span>
          <input
            className={styles.input}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Work, Errands"
          />
        </label>
      </div>

      {isEditing && (
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Status</span>
          <select
            className={styles.input}
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.submitButton}>
          {isEditing ? 'Save changes' : 'Add task'}
        </button>
      </div>
    </form>
  );
}