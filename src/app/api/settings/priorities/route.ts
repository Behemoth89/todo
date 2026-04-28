import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';

const prioritySchema = z.object({
  name: z.string().min(1),
  sortOrder: z.number().int().optional().default(0),
});

// GET /api/settings/priorities
export async function GET(req: NextRequest) {
  try {
    const payload = await authMiddleware(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, data: null, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const priorities = await prisma.priority.findMany({
      where: { userId: payload.userId, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: { priorities },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch priorities';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}

// POST /api/settings/priorities - Add priority (SET-03)
export async function POST(req: NextRequest) {
  try {
    const payload = await authMiddleware(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, data: null, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = prioritySchema.parse(await req.json());

    const priority = await prisma.priority.create({
      data: {
        userId: payload.userId,
        name: body.name,
        sortOrder: body.sortOrder,
      },
    });

    return NextResponse.json({
      success: true,
      data: { priority },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create priority';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}