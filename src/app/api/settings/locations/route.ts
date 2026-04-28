import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';

const locationSchema = z.object({
  name: z.string().min(1),
});

// GET /api/settings/locations
export async function GET(req: NextRequest) {
  try {
    const payload = await authMiddleware(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, data: null, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const locations = await prisma.location.findMany({
      where: { userId: payload.userId, deletedAt: null },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: { locations },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch locations';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}

// POST /api/settings/locations - Add location (LOC-01)
export async function POST(req: NextRequest) {
  try {
    const payload = await authMiddleware(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, data: null, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = locationSchema.parse(await req.json());

    const location = await prisma.location.create({
      data: {
        userId: payload.userId,
        name: body.name,
      },
    });

    return NextResponse.json({
      success: true,
      data: { location },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create location';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}