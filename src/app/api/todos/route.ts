import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';

const todoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priorityId: z.string().optional(),
  locationId: z.string().optional(),
  assigneeIds: z.array(z.string()).optional(),
  startDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

// GET /api/todos - List todos (with soft delete filter per D-02)
export async function GET(req: NextRequest) {
  try {
    const payload = await authMiddleware(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, data: null, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const assigneeId = searchParams.get('assigneeId');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const filters: Record<string, unknown> = { userId: payload.userId, deletedAt: null };

    // Filter by assignee if specified (ASGN-03)
    if (assigneeId) {
      filters.assignees = { some: { familyMemberId: assigneeId } };
    }

    // Build sort object
    const sortObj: Record<string, string> = {};
    const validSortFields = ['title', 'createdAt', 'dueDate', 'completedAt', 'priorityId', 'locationId'];
    if (validSortFields.includes(sortBy)) {
      sortObj[sortBy] = sortOrder;
    }

    const todos = await prisma.todo.findMany({
      where: filters,
      include: {
        priority: true,
        location: true,
        assignees: { include: { familyMember: true } },
      },
      orderBy: sortObj,
    });

    return NextResponse.json({
      success: true,
      data: { todos },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch todos';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}

// POST /api/todos - Create todo (TODO-01)
export async function POST(req: NextRequest) {
  try {
    const payload = await authMiddleware(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, data: null, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = todoSchema.parse(await req.json());

    const todo = await prisma.todo.create({
      data: {
        userId: payload.userId,
        title: body.title,
        description: body.description,
        priorityId: body.priorityId,
        locationId: body.locationId,
        startDate: body.startDate ? new Date(body.startDate) : null,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        notes: body.notes,
        assignees: body.assigneeIds?.length
          ? { create: body.assigneeIds.map(id => ({ familyMemberId: id })) }
          : undefined,
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
    const message = error instanceof Error ? error.message : 'Failed to create todo';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}