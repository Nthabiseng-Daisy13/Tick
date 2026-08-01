// src/app/api/stats/route.ts

import { NextResponse } from 'next/server';
import { getStats } from '@/lib/tasks';

export async function GET() {
  const stats = getStats();
  return NextResponse.json(stats);
}