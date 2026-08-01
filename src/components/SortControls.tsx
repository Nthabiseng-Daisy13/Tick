// src/components/SortControls.tsx

import styles from '@/styles/SortControls.module.css';

export type SortField = 'topic' | 'status' | 'due_date';

interface SortControlsProps {
  value: SortField;
  onChange: (field: SortField) => void;
}

const OPTIONS: { field: SortField; label: string }[] = [
  { field: 'due_date', label: 'Due date' },
  { field: 'topic', label: 'Topic' },
  { field: 'status', label: 'Status' },
];

export function SortControls({ value, onChange }: SortControlsProps) {
  return (
    <div className={styles.wrapper} role="group" aria-label="Sort tasks by">
      <span className={styles.label}>Sort by</span>
      {OPTIONS.map((opt) => (
        <button
          key={opt.field}
          className={`${styles.option} ${value === opt.field ? styles.active : ''}`}
          onClick={() => onChange(opt.field)}
          aria-pressed={value === opt.field}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}