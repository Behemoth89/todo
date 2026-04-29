import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';

const familyMemberSchema = z.object({
  name: z.string().min(1),
});

// GET /api/settings/family-members
export async function GET(req: NextRequest) {
  try {
    const payload = await authMiddleware(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, data: null, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const members = await prisma.familyMember.findMany({
      where: { userId: payload.userId, deletedAt: null },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: { familyMembers: members },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch family members';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}

// POST /api/settings/family-members - Add family member (SET-01, ASGN-01, ASGN-02)
export async function POST(req: NextRequest) {
  try {
    const payload = await authMiddleware(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, data: null, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = familyMemberSchema.parse(await req.json());

    const member = await prisma.familyMember.create({
      data: {
        userId: payload.userId,
        name: body.name,
      },
    });

    return NextResponse.json({
      success: true,
      data: { familyMember: member },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create family member';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}