import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';
import { recalculateReadyStatus } from '@/lib/ready-status';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/todos/[id]/complete - Mark todo as complete (TODO-04)
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const payload = await authMiddleware(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, data: null, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const todo = await prisma.todo.findFirst({
      where: { id, userId: payload.userId, deletedAt: null },
    });

    if (!todo) {
      return NextResponse.json(
        { success: false, data: null, error: 'Todo not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: { completedAt: new Date() },
      include: {
        priority: true,
        location: true,
        assignees: { include: { familyMember: true } },
      },
    });

    await recalculateReadyStatus(id);

    return NextResponse.json({
      success: true,
      data: { todo: updated },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to complete todo';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}