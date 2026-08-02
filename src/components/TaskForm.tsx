// src/components/TaskForm.tsx

import { useState } from 'react';
import type { TaskStatus, TaskWithOverdue } from '@/lib/tasks';
import styles from '@/styles/TaskForm.module.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


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
// Split the stored datetime into date and time

// Format a Date using its LOCAL year/month/day — never toISOString(),
// which converts to UTC first and can shift the date back a day for
// any timezone ahead of UTC (e.g. SAST, UTC+2).
function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function TaskForm({ initialTask, onSubmit, onCancel }: TaskFormProps) {
  const initialDate = initialTask?.due_date
  ? initialTask.due_date.split('T')[0]
  : '';

  const initialTime = initialTask?.due_date
  ? initialTask.due_date.split('T')[1]?.substring(0, 5) || '13:00'
  : '13:00';  
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [dueDate, setDueDate] = useState<Date | null>(
  // Parse as local date parts, not `new Date(initialDate)` — passing a
  // bare "YYYY-MM-DD" string to the Date constructor parses it as UTC
  // midnight, which can also shift a day in either direction depending
  // on the browser's timezone offset.
  initialDate
    ? (() => {
        const [y, m, d] = initialDate.split('-').map(Number);
        return new Date(y, m - 1, d);
      })()
    : null
);
  const [dueTime, setDueTime] = useState(initialTime);
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
      due_date: dueDate
        ? `${toLocalDateString(dueDate)}T${dueTime || "13:00"}:00`
        : "",
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
      <label className={styles.field}>
          <span className={styles.fieldLabel}>Topic</span>
          <input
            className={styles.input}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Work, Errands"
          />
        </label>

      <div className={styles.dateTimeRow}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Due date</span>

          <DatePicker
            selected={dueDate}
            onChange={(date: Date | null) => setDueDate(date)}
            dateFormat="dd MMM yyyy"
            placeholderText="Select a due date"
            className={styles.datePicker}
            minDate={isEditing ? undefined : new Date()}
            showPopperArrow={false}
            calendarStartDay={1}
          />
        </label>

        <label className={styles.field}>
  <span className={styles.fieldLabel}>Time</span>

  <DatePicker
    selected={new Date(`2000-01-01T${dueTime}`)}
    onChange={(date: Date | null) => {
      if (!date) return;

      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      setDueTime(`${hours}:${minutes}`);
    }}
    showTimeSelect
    showTimeSelectOnly
    timeIntervals={15}
    timeCaption="Time"
    dateFormat="HH:mm"
    className={styles.datePicker}
    showPopperArrow={false}
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