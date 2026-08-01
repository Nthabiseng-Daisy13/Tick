// src/app/layout.tsx

import './globals.css';
import Link from 'next/link';
import { DaisyIcon } from '@/components/DaisyIcon';
import styles from '@/styles/Layout.module.css';

export const metadata = {
  title: 'Tick',
  description: 'A local-first to-do app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className={styles.shell}>
          <aside className={styles.sidebar}>
            <div className={styles.brand}>
              <DaisyIcon size={26} />
              <span className={styles.brandName}>Tick</span>
            </div>
            <nav className={styles.nav}>
              <Link href="/" className={styles.navLink}>
                Active
              </Link>
              <Link href="/archive" className={styles.navLink}>
                Archive
              </Link>
              <Link href="/calendar" className={styles.navLink}>
                Calendar
              </Link>
              <Link href="/stats" className={styles.navLink}>
                Statistics
              </Link>
            </nav>
          </aside>
          <main className={styles.main}>{children}</main>
        </div>
      </body>
    </html>
  );
}