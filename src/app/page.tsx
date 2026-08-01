// src/app/page.tsx

import { TaskList } from '@/components/TaskList';

export default function HomePage() {
  return <TaskList archived={false} />;
}