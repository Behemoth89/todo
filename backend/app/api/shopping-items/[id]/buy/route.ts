import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';
import { recalculateReadyStatus } from '@/lib/ready-status';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/shopping-items/[id]/buy - Toggle bought status
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const payload = await authMiddleware(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: itemId } = await params;

    const item = await prisma.shoppingItem.findUnique({
      where: { id: itemId },
      include: { todo: { select: { userId: true, id: true } } },
    });

    if (!item || item.deletedAt || item.todo.userId !== payload.userId) {
      return NextResponse.json(
        { success: false, data: null, error: 'Item not found' },
        { status: 404 }
      );
    }

    const boughtAt = item.boughtAt ? null : new Date();

    const updated = await prisma.shoppingItem.update({
      where: { id: itemId },
      data: { boughtAt },
    });

    await recalculateReadyStatus(item.todoId);

    return NextResponse.json({
      success: true,
      data: { item: updated },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to toggle bought status';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}