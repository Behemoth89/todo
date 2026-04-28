import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priorityId: z.string().nullable().optional(),
  locationId: z.string().nullable().optional(),
  assigneeIds: z.array(z.string()).optional(),
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

    // Check todo exists and belongs to user
    const existing = await prisma.todo.findFirst({
      where: { id, userId: payload.userId, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, data: null, error: 'Todo not found' },
        { status: 404 }
      );
    }

    // Handle assignee update
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

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.priorityId !== undefined && { priorityId: body.priorityId }),
        ...(body.locationId !== undefined && { locationId: body.locationId }),
        ...(body.startDate !== undefined && { startDate: body.startDate ? new Date(body.startDate) : null }),
        ...(body.dueDate !== undefined && { dueDate: body.dueDate ? new Date(body.dueDate) : null }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
      include: {
        priority: true,
        location: true,
        assignees: { include: { familyMember: true } },
      },
    });

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

    // Soft delete: set deletedAt timestamp (per D-02)
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