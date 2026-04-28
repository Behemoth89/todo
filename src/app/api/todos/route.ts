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

// GET /api/todos - List todos with sorting and filtering (TODO-06, TODO-07)
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

    // Sorting (TODO-06)
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Valid sort fields per TODO-06
    const validSortFields = ['title', 'createdAt', 'dueDate', 'completedAt', 'startDate', 'priorityId', 'locationId'];
    const sortObj: Record<string, 'asc' | 'desc'> = {};
    if (validSortFields.includes(sortBy)) {
      sortObj[sortBy] = sortOrder === 'asc' ? 'asc' : 'desc';
    } else {
      sortObj.createdAt = 'desc';
    }

    // Filtering (TODO-07)
    const filters: Record<string, unknown> = { userId: payload.userId, deletedAt: null };

    // Filter by priority
    const priorityId = searchParams.get('priorityId');
    if (priorityId) filters.priorityId = priorityId;

    // Filter by location
    const locationId = searchParams.get('locationId');
    if (locationId) filters.locationId = locationId;

    // Filter by assignee
    const assigneeId = searchParams.get('assigneeId');
    if (assigneeId) filters.assignees = { some: { familyMemberId: assigneeId } };

    // Filter by status (completed/incomplete)
    const status = searchParams.get('status');
    if (status === 'completed') filters.completedAt = { not: null };
    if (status === 'incomplete') filters.completedAt = null;

    // Filter by date range
    const startDateFrom = searchParams.get('startDateFrom');
    const startDateTo = searchParams.get('startDateTo');
    if (startDateFrom || startDateTo) {
      filters.startDate = {};
      if (startDateFrom) (filters.startDate as Record<string, Date>).gte = new Date(startDateFrom);
      if (startDateTo) (filters.startDate as Record<string, Date>).lte = new Date(startDateTo);
    }

    const dueDateFrom = searchParams.get('dueDateFrom');
    const dueDateTo = searchParams.get('dueDateTo');
    if (dueDateFrom || dueDateTo) {
      filters.dueDate = {};
      if (dueDateFrom) (filters.dueDate as Record<string, Date>).gte = new Date(dueDateFrom);
      if (dueDateTo) (filters.dueDate as Record<string, Date>).lte = new Date(dueDateTo);
    }

    const completedFrom = searchParams.get('completedFrom');
    const completedTo = searchParams.get('completedTo');
    if (completedFrom || completedTo) {
      filters.completedAt = filters.completedAt || {};
      if (completedFrom) (filters.completedAt as Record<string, Date>).gte = new Date(completedFrom);
      if (completedTo) (filters.completedAt as Record<string, Date>).lte = new Date(completedTo);
    }

    // Filter by ready-to-execute (RDY-04)
    const readyToExecute = searchParams.get('readyToExecute');
    if (readyToExecute !== null) {
      filters.readyToExecute = readyToExecute === 'true';
    }

    // Fetch with filters and sort
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