import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';

const updateSchema = z.object({
  name: z.string().min(1),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single location
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
    const location = await prisma.location.findFirst({
      where: { id, userId: payload.userId, deletedAt: null },
    });

    if (!location) {
      return NextResponse.json(
        { success: false, data: null, error: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { location },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch location';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}

// PUT /api/settings/locations/[id] - Edit location (LOC-03)
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

    const existing = await prisma.location.findFirst({
      where: { id, userId: payload.userId, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, data: null, error: 'Location not found' },
        { status: 404 }
      );
    }

    const location = await prisma.location.update({
      where: { id },
      data: { name: body.name },
    });

    return NextResponse.json({
      success: true,
      data: { location },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update location';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}

// DELETE /api/settings/locations/[id] - Soft delete location
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

    const existing = await prisma.location.findFirst({
      where: { id, userId: payload.userId, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, data: null, error: 'Location not found' },
        { status: 404 }
      );
    }

    await prisma.location.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Location deleted' },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete location';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}