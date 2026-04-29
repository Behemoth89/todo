import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';
import { recalculateReadyStatus } from '@/lib/ready-status';

const updateSchema = z.object({
  description: z.string().min(1).optional(),
  amount: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  notes: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/shopping-items/[id] - Update shopping item
export async function PUT(req: NextRequest, { params }: RouteParams) {
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
      include: { todo: { select: { userId: true, id: true } },
    });

    if (!item || item.deletedAt || item.todo.userId !== payload.userId) {
      return NextResponse.json(
        { success: false, data: null, error: 'Item not found' },
        { status: 404 }
      );
    }

    const body = updateSchema.parse(await req.json());

    const updateData: any = {};
    if (body.description) updateData.description = body.description;
    if (body.amount !== undefined) updateData.amount = body.amount;
    if (body.price !== undefined) updateData.price = new Prisma.Decimal(body.price.toString());
    if (body.notes !== undefined) updateData.notes = body.notes;

    const updated = await prisma.shoppingItem.update({
      where: { id: itemId },
      data: updateData,
    });

    await recalculateReadyStatus(item.todoId);

    return NextResponse.json({
      success: true,
      data: { item: updated },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update shopping item';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}

// DELETE /api/shopping-items/[id] - Soft delete shopping item
export async function DELETE(req: NextRequest, { params }: RouteParams) {
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
      include: { todo: { select: { userId: true, id: true } },
    });

    if (!item || item.deletedAt || item.todo.userId !== payload.userId) {
      return NextResponse.json(
        { success: false, data: null, error: 'Item not found' },
        { status: 404 }
      );
    }

    const todoId = item.todoId;

    await prisma.shoppingItem.update({
      where: { id: itemId },
      data: { deletedAt: new Date() },
    });

    await recalculateReadyStatus(todoId);

    return NextResponse.json({
      success: true,
      data: { message: 'Item deleted' },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete shopping item';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}