// src/app/page.tsx

import { PageHeader } from '@/components/PageHeader';
import { TaskList } from '@/components/TaskList';

export default function HomePage() {
  return (
    <div>
      <PageHeader title="Active Tasks" />
      <TaskList archived={false} />
    </div>
  );
}