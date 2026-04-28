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

// GET single family member
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
    const member = await prisma.familyMember.findFirst({
      where: { id, userId: payload.userId, deletedAt: null },
    });

    if (!member) {
      return NextResponse.json(
        { success: false, data: null, error: 'Family member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { familyMember: member },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch family member';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}

// PUT /api/settings/family-members/[id] - Edit family member
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

    const existing = await prisma.familyMember.findFirst({
      where: { id, userId: payload.userId, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, data: null, error: 'Family member not found' },
        { status: 404 }
      );
    }

    const member = await prisma.familyMember.update({
      where: { id },
      data: { name: body.name },
    });

    return NextResponse.json({
      success: true,
      data: { familyMember: member },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update family member';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}

// DELETE /api/settings/family-members/[id] - Soft delete family member
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

    const existing = await prisma.familyMember.findFirst({
      where: { id, userId: payload.userId, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, data: null, error: 'Family member not found' },
        { status: 404 }
      );
    }

    await prisma.familyMember.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Family member deleted' },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete family member';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}