import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  try {
    const { photoId } = await params;
    const searchParams = req.nextUrl.searchParams;
    const thumbnail = searchParams.get('thumbnail') === 'true';
    
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { todo: { select: { userId: true } } },
    });
    
    if (!photo || photo.deletedAt || photo.todo.userId !== userId) {
      return NextResponse.json(
        { success: false, data: null, error: 'Photo not found' },
        { status: 404 }
      );
    }
    
    const imageData = thumbnail ? photo.thumbnail : photo.data;
    
    return new NextResponse(new Uint8Array(imageData), {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch photo';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}