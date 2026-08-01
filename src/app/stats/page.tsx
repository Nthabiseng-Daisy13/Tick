// src/app/stats/page.tsx

'use client';

import { useEffect, useState } from 'react';
import type { TaskStats } from '@/lib/tasks';
import styles from '@/styles/Stats.module.css';

export default function StatsPage() {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading || !stats) {
    return <p className={styles.empty}>Loading statistics…</p>;
  }

  return (
    <div>
      <h2 className={styles.heading}>Statistics</h2>

      <div className={styles.cardGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.totalActive}</span>
          <span className={styles.statLabel}>Active tasks</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.byStatus.Complete}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.overdueCount}</span>
          <span className={styles.statLabel}>Overdue</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.totalArchived}</span>
          <span className={styles.statLabel}>Archived</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subheading}>Completion rate</h3>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
        <span className={styles.progressLabel}>{stats.completionRate}% of active tasks complete</span>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subheading}>By status</h3>
        <div className={styles.barList}>
          {(['Todo', 'In-Progress', 'Complete'] as const).map((status) => (
            <div key={status} className={styles.barRow}>
              <span className={styles.barLabel}>{status}</span>
              <div className={styles.barTrack}>
                <div
                  className={`${styles.barFill} ${styles[`bar-${status}`]}`}
                  style={{
                    width:
                      stats.totalActive === 0
                        ? '0%'
                        : `${(stats.byStatus[status] / stats.totalActive) * 100}%`,
                  }}
                />
              </div>
              <span className={styles.barCount}>{stats.byStatus[status]}</span>
            </div>
          ))}
        </div>
      </div>

      {stats.byTopic.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.subheading}>By topic</h3>
          <div className={styles.barList}>
            {stats.byTopic.map(({ topic, count }) => (
              <div key={topic} className={styles.barRow}>
                <span className={styles.barLabel}>{topic}</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFillTopic}
                    style={{
                      width: `${(count / stats.byTopic[0].count) * 100}%`,
                    }}
                  />
                </div>
                <span className={styles.barCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}