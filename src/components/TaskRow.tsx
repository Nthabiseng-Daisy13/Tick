// src/components/TaskRow.tsx

import type { TaskWithOverdue, TaskStatus } from '@/lib/tasks';
import styles from '@/styles/TaskRow.module.css';

interface TaskRowProps {
  task: TaskWithOverdue;
  onStatusChange: (id: number, status: TaskStatus) => void;
  onEdit: (task: TaskWithOverdue) => void;
  onArchive: (id: number) => void;
  showArchiveAction?: boolean;
}

const STATUS_OPTIONS: TaskStatus[] = ['Todo', 'In-Progress', 'Complete'];

// Click order for the round complete button: white -> orange -> green -> white...
const STATUS_CYCLE: TaskStatus[] = ['Todo', 'In-Progress', 'Complete'];

function nextStatus(current: TaskStatus): TaskStatus {
  const idx = STATUS_CYCLE.indexOf(current);
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
}

function statusClass(status: TaskStatus): string {
  if (status === 'Todo') return styles['status-Todo'];
  if (status === 'In-Progress') return styles['status-In-Progress'];
  return styles['status-Complete'];
}

// Inline fallback colors so the button works even without extra CSS classes
const STATUS_COLORS: Record<TaskStatus, string> = {
  'Todo': '#ffffff',
  'In-Progress': '#f5a623',
  'Complete': '#2ecc71',
};

function statusButtonClass(status: TaskStatus): string {
  if (status === 'Todo') return styles['completeButton-Todo'] ?? '';
  if (status === 'In-Progress') return styles['completeButton-In-Progress'] ?? '';
  return styles['completeButton-Complete'] ?? '';
}

export function TaskRow({
  
  task,
  onStatusChange,
  onEdit,
  onArchive,
  showArchiveAction = true,
}: TaskRowProps) {
  const due = new Date(task.due_date);

  const formattedDate = due.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = due.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return (
    <div
    className={`${styles.card} ${
        task.status === "Complete" ? styles.completedCard : ""
      } ${task.status === "In-Progress" ? styles.inProgressCard : ""}`}
    >

      <button
        className={`${styles.completeButton} ${statusButtonClass(task.status)}`}
        style={{ backgroundColor: STATUS_COLORS[task.status] }}
        onClick={() => onStatusChange(task.id, nextStatus(task.status))}
        aria-label={`Cycle status for ${task.title} (currently ${task.status})`}
        title={task.status}
      >
        {task.status === "Complete" ? "✓" : ""}
      </button>
      <div className={styles.main}>
        <div className={styles.titleLine}>
          <span
            className={`${styles.title} ${
              task.status === "Complete" ? styles.completedTitle : ""
            }`}
          >
            {task.title}
          </span>
          {task.is_overdue && <span className={styles.overdueFlag}>Overdue</span>}
        </div>

        {task.description && <p className={styles.description}>{task.description}</p>}

        <div className={styles.meta}>
          <span className={styles.metaItem}>{task.topic}</span>
          <span className={styles.metaDivider}>·</span>
          <span className={styles.metaItem}>Due {formattedDate} • {formattedTime}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <select
          className={`${styles.statusSelect} ${statusClass(task.status)}`}
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          aria-label={`Status for ${task.title}`}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button className={styles.iconButton} onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>
          Edit
        </button>

        {showArchiveAction && (
          <button
            className={styles.iconButton}
            onClick={() => onArchive(task.id)}
            aria-label={`Archive ${task.title}`}
          >
            Archive
          </button>
        )}
      </div>
    </div>
  );
}