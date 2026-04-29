import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';

// GET /api/shopping-items - Aggregate shopping list
export async function GET(req: NextRequest) {
  try {
    const payload = await authMiddleware(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const boughtFilter = searchParams.get('bought');
    const todoIdFilter = searchParams.get('todoId');
    const locationIdFilter = searchParams.get('locationId');

    const where: any = {
      deletedAt: null,
      todo: { userId: payload.userId },
    };

    if (boughtFilter !== null) {
      where.boughtAt = boughtFilter === 'true' ? { not: null } : null;
    }

    if (todoIdFilter) {
      where.todoId = todoIdFilter;
    }

    const items = await prisma.shoppingItem.findMany({
      where,
      include: {
        todo: {
          select: { id: true, title: true, locationId: true },
          include: { location: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    let filteredItems = items;
    if (locationIdFilter) {
      filteredItems = items.filter(item => item.todo.locationId === locationIdFilter);
    }

    const responseItems = filteredItems.map(item => ({
      id: item.id,
      description: item.description,
      amount: item.amount,
      price: item.price ? item.price.toNumber() : null,
      notes: item.notes,
      boughtAt: item.boughtAt,
      createdAt: item.createdAt,
      todo: {
        id: item.todo.id,
        title: item.todo.title,
        location: item.todo.location?.name,
      },
    }));

    return NextResponse.json({
      success: true,
      data: { items: responseItems },
      error: null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch shopping items';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 400 }
    );
  }
}