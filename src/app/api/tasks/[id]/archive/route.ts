// src/app/api/tasks/[id]/archive/route.ts

import { NextResponse } from 'next/server';
import { archiveTask } from '@/lib/tasks';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    return NextResponse.json({ error: 'Invalid task id' }, { status: 400 });
  }

  try {
    const task = archiveTask(taskId);
    return NextResponse.json(task);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to archive task';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}