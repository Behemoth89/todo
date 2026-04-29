import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createAccessToken, createRefreshToken } from '@/lib/auth';
import { hash, compare } from 'bcryptjs';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = registerSchema.parse(await req.json());
    
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, data: null, error: 'Email already registered' },
        { status: 400 }
      );
    }

    const passwordHash = await hash(body.password, 12);
    
    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        name: body.name,
      },
    });

    const accessToken = await createAccessToken({ userId: user.id, email: user.email });
    const refreshToken = await createRefreshToken({ userId: user.id, email: user.email });

    const response = NextResponse.json({
      success: true,
      data: { user: { id: user.id, email: user.email, name: user.name } },
      error: null,
    });

    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}