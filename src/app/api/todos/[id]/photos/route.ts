import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { convertToWebP, validatePhotoSize } from '@/lib/photo-processing';

const MAX_PHOTOS_PER_TODO = 10;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: todoId } = await params;
    
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const photos = await prisma.photo.findMany({
      where: {
        todoId,
        deletedAt: null,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    
    return NextResponse.json({
      success: true,
      data: { photos },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch photos';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: todoId } = await params;
    
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const todo = await prisma.todo.findUnique({
      where: { id: todoId, deletedAt: null },
    });
    
    if (!todo || todo.userId !== userId) {
      return NextResponse.json(
        { success: false, data: null, error: 'Todo not found' },
        { status: 404 }
      );
    }
    
    const photoCount = await prisma.photo.count({
      where: { todoId, deletedAt: null },
    });
    
    if (photoCount >= MAX_PHOTOS_PER_TODO) {
      return NextResponse.json(
        { success: false, data: null, error: `Maximum ${MAX_PHOTOS_PER_TODO} photos allowed` },
        { status: 400 }
      );
    }
    
    const formData = await req.formData();
    const file = formData.get('photo') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { success: false, data: null, error: 'Photo file required' },
        { status: 400 }
      );
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    if (!validatePhotoSize(buffer)) {
      return NextResponse.json(
        { success: false, data: null, error: 'Photo must be under 10MB' },
        { status: 400 }
      );
    }
    
    const { data, thumbnail } = await convertToWebP(buffer);
    
    const photo = await prisma.photo.create({
      data: {
        todoId,
        data,
        thumbnail,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: { photo: { id: photo.id, createdAt: photo.createdAt } },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to upload photo';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}