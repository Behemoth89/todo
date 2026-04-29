import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';

const updateSchema = z.object({
  name: z.string().min(1),
  sortOrder: z.number().int().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single priority
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
    const priority = await prisma.priority.findFirst({
      where: { id, userId: payload.userId, deletedAt: null },
    });

    if (!priority) {
      return NextResponse.json(
        { success: false, data: null, error: 'Priority not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { priority },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch priority';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}

// PUT /api/settings/priorities/[id] - Edit priority
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

    const existing = await prisma.priority.findFirst({
      where: { id, userId: payload.userId, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, data: null, error: 'Priority not found' },
        { status: 404 }
      );
    }

    const priority = await prisma.priority.update({
      where: { id },
      data: {
        name: body.name,
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    });

    return NextResponse.json({
      success: true,
      data: { priority },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update priority';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}

// DELETE /api/settings/priorities/[id] - Soft delete priority
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

    const existing = await prisma.priority.findFirst({
      where: { id, userId: payload.userId, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, data: null, error: 'Priority not found' },
        { status: 404 }
      );
    }

    await prisma.priority.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Priority deleted' },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete priority';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}