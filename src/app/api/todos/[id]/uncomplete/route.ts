import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/todos/[id]/uncomplete - Mark todo as incomplete
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

    // Clear completedAt
    const updated = await prisma.todo.update({
      where: { id },
      data: { completedAt: null },
      include: {
        priority: true,
        location: true,
        assignees: { include: { familyMember: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: { todo: updated },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to uncomplete todo';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}