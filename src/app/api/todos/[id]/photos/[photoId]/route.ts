import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const { id: todoId, photoId } = await params;
    
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const photo = await prisma.photo.findFirst({
      where: { id: photoId, todoId },
      include: { todo: { select: { userId: true } } },
    });
    
    if (!photo || photo.deletedAt || photo.todo.userId !== userId) {
      return NextResponse.json(
        { success: false, data: null, error: 'Photo not found' },
        { status: 404 }
      );
    }
    
    await prisma.photo.update({
      where: { id: photoId },
      data: { deletedAt: new Date() },
    });
    
    return NextResponse.json({
      success: true,
      data: { message: 'Photo deleted' },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete photo';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}