import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createAccessToken, createRefreshToken } from '@/lib/auth';
import { compare } from 'bcryptjs';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = loginSchema.parse(await req.json());
    
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const validPassword = await compare(body.password, user.passwordHash);
    
    if (!validPassword) {
      return NextResponse.json(
        { success: false, data: null, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

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
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}