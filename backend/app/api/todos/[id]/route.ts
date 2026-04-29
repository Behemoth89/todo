import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';
import { detectCycle, recalculateReadyStatus } from '@/lib/ready-status';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priorityId: z.string().nullable().optional(),
  locationId: z.string().nullable().optional(),
  assigneeIds: z.array(z.string()).optional(),
  parentId: z.string().nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  notes: z.string().nullable().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/todos/[id] - Get single todo
export async function GET(req: NextRequest, { params }: RouteParams) {
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
      include: {
        priority: true,
        location: true,
        assignees: { include: { familyMember: true } },
      },
    });

    if (!todo) {
      return NextResponse.json(
        { success: false, data: null, error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { todo },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch todo';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}

// PUT /api/todos/[id] - Update todo (TODO-02)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const payload = await authMiddleware(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, data: null, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = updateSchema.parse(await req.json());

    const existing = await prisma.todo.findFirst({
      where: { id, userId: payload.userId, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, data: null, error: 'Todo not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (body.assigneeIds !== undefined) {
      await prisma.todoAssignee.deleteMany({ where: { todoId: id } });
      if (body.assigneeIds.length > 0) {
        await prisma.todoAssignee.createMany({
          data: body.assigneeIds.map(memberId => ({
            todoId: id,
            familyMemberId: memberId,
          })),
        });
      }
    }

    if (body.parentId !== undefined) {
      if (body.parentId === null) {
        updateData.parentId = null;
      } else {
        const hasCycle = await detectCycle(id, body.parentId);
        if (hasCycle) {
          return NextResponse.json(
            { success: false, data: null, error: 'Setting this parent would create a circular dependency' },
            { status: 400 }
          );
        }
        
        const parentTodo = await prisma.todo.findFirst({
          where: { id: body.parentId, deletedAt: null, userId: payload.userId },
        });
        
        if (!parentTodo) {
          return NextResponse.json(
            { success: false, data: null, error: 'Parent todo not found' },
            { status: 404 }
          );
        }
        
        updateData.parentId = body.parentId;
      }
    }

    if (body.title) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.priorityId !== undefined) updateData.priorityId = body.priorityId;
    if (body.locationId !== undefined) updateData.locationId = body.locationId;
    if (body.startDate !== undefined) updateData.startDate = body.startDate ? new Date(body.startDate) : null;
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    if (body.notes !== undefined) updateData.notes = body.notes;

    const todo = await prisma.todo.update({
      where: { id },
      data: updateData,
      include: {
        priority: true,
        location: true,
        assignees: { include: { familyMember: true } },
      },
    });

    if (Object.keys(updateData).length > 0) {
      await recalculateReadyStatus(id);
    }

    return NextResponse.json({
      success: true,
      data: { todo },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update todo';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}

// DELETE /api/todos/[id] - Soft delete todo (TODO-03)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
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

    await prisma.todo.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Todo deleted' },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete todo';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}