// src/components/PageHeader.tsx

import styles from '@/styles/PageHeader.module.css';

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{title}</h1>
    </div>
  );
}