// src/app/archive/page.tsx

import { TaskList } from '@/components/TaskList';

export default function ArchivePage() {
  return <TaskList archived={true} />;
}