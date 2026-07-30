// src/app/api/tasks/route.ts

import { NextResponse } from 'next/server';
import { createTask, listTasks } from '@/lib/tasks';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const sort = searchParams.get('sort') ?? undefined;
  const includeArchived = searchParams.get('archived') === 'true';

  const tasks = listTasks({ sort, includeArchived });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task = createTask(body);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create task';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}