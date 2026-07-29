import { NextResponse } from 'next/server';
import { listTasks, createTask } from '@/lib/tasks';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tasks = listTasks({
    sort: searchParams.get('sort') ?? undefined,
    includeArchived: searchParams.get('archived') === 'true',
  });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const task = createTask(body);
  return NextResponse.json(task, { status: 201 });
}