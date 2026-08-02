// src/app/archive/page.tsx

import { PageHeader } from '@/components/PageHeader';
import { TaskList } from '@/components/TaskList';

export default function ArchivePage() {
  return (
    <div>
      <PageHeader title="Archive" />
      <TaskList archived={true} />
    </div>
  );
}