// src/app/api/tasks/[id]/route.ts

import { NextResponse } from 'next/server';
import { updateTask } from '@/lib/tasks';

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
    const body = await request.json();
    const task = updateTask(taskId, body);
    return NextResponse.json(task);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update task';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}