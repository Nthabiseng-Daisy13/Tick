// src/app/calendar/page.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';
import type { TaskWithOverdue } from '@/lib/tasks';
import { PageHeader } from '@/components/PageHeader';
import styles from '@/styles/Calendar.module.css';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function buildMonthGrid(monthAnchor: Date): Date[] {
  const year = monthAnchor.getFullYear();
  const month = monthAnchor.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay(); // 0 = Sunday
  const gridStart = new Date(year, month, 1 - startOffset);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
  }
  return days;
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState<TaskWithOverdue[]>([]);
  const [monthAnchor, setMonthAnchor] = useState(() => new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks?archived=false')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      });
  }, []);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, TaskWithOverdue[]>();
    for (const task of tasks) {
      // due_date may be a plain date ("2026-08-15") or include a time
      // component; only the date part is used for grid placement.
      const dateKey = task.due_date.slice(0, 10);
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(task);
    }
    return map;
  }, [tasks]);

  const days = useMemo(() => buildMonthGrid(monthAnchor), [monthAnchor]);
  const todayKey = toDateKey(new Date());
  const currentMonthIndex = monthAnchor.getMonth();

  function goToPrevMonth() {
    setMonthAnchor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function goToNextMonth() {
    setMonthAnchor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  function goToToday() {
    setMonthAnchor(new Date());
  }

  const monthLabel = monthAnchor.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      <PageHeader title="Calendar" />
      <div className={styles.header}>
        <h2 className={styles.heading}>{monthLabel}</h2>
        <div className={styles.nav}>
          <button className={styles.navButton} onClick={goToPrevMonth} aria-label="Previous month">
            ‹
          </button>
          <button className={styles.todayButton} onClick={goToToday}>
            Today
          </button>
          <button className={styles.navButton} onClick={goToNextMonth} aria-label="Next month">
            ›
          </button>
        </div>
      </div>

      {loading ? (
        <p className={styles.empty}>Loading calendar…</p>
      ) : (
        <div className={styles.grid}>
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className={styles.weekdayLabel}>
              {label}
            </div>
          ))}

          {days.map((day) => {
            const dateKey = toDateKey(day);
            const dayTasks = tasksByDate.get(dateKey) ?? [];
            const isCurrentMonth = day.getMonth() === currentMonthIndex;
            const isToday = dateKey === todayKey;

            return (
              <div
                key={dateKey}
                className={`${styles.cell} ${!isCurrentMonth ? styles.cellMuted : ''} ${
                  isToday ? styles.cellToday : ''
                }`}
              >
                <span className={styles.dayNumber}>{day.getDate()}</span>
                <div className={styles.taskChips}>
                  {dayTasks.slice(0, 3).map((task) => (
                    <span
                      key={task.id}
                      className={`${styles.chip} ${
                        task.is_overdue ? styles.chipOverdue : styles[`chip-${task.status}`]
                      }`}
                      title={task.title}
                    >
                      {task.title}
                    </span>
                  ))}
                  {dayTasks.length > 3 && (
                    <span className={styles.chipMore}>+{dayTasks.length - 3} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}