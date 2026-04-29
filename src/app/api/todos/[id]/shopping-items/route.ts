import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';
import { recalculateReadyStatus } from '@/lib/ready-status';

const shoppingItemSchema = z.object({
  description: z.string().min(1),
  amount: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  notes: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/todos/[id]/shopping-items - List shopping items for todo
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const payload = await authMiddleware(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: todoId } = await params;

    const todo = await prisma.todo.findFirst({
      where: { id: todoId, userId: payload.userId, deletedAt: null },
    });

    if (!todo) {
      return NextResponse.json(
        { success: false, data: null, error: 'Todo not found' },
        { status: 404 }
      );
    }

    const items = await prisma.shoppingItem.findMany({
      where: { todoId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: { items },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch shopping items';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}

// POST /api/todos/[id]/shopping-items - Add shopping item to todo
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const payload = await authMiddleware(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: todoId } = await params;

    const todo = await prisma.todo.findFirst({
      where: { id: todoId, userId: payload.userId, deletedAt: null },
    });

    if (!todo) {
      return NextResponse.json(
        { success: false, data: null, error: 'Todo not found' },
        { status: 404 }
      );
    }

    const body = shoppingItemSchema.parse(await req.json());

    const item = await prisma.shoppingItem.create({
      data: {
        todoId,
        description: body.description,
        amount: body.amount,
        price: body.price ? new Prisma.Decimal(body.price.toString()) : undefined,
        notes: body.notes,
      },
    });

    await recalculateReadyStatus(todoId);

    return NextResponse.json({
      success: true,
      data: { item },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to add shopping item';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}