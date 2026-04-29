import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken, createAccessToken, createRefreshToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, data: null, error: 'No refresh token' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(refreshToken);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, data: null, error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.deletedAt) {
      return NextResponse.json(
        { success: false, data: null, error: 'User not found' },
        { status: 401 }
      );
    }

    const newAccessToken = await createAccessToken({ userId: user.id, email: user.email });
    const newRefreshToken = await createRefreshToken({ userId: user.id, email: user.email });

    const response = NextResponse.json({
      success: true,
      data: { message: 'Tokens refreshed' },
      error: null,
    });

    response.cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
    });

    response.cookies.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Token refresh failed';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}