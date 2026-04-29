import { prisma } from './prisma';

export async function calculateReadyToExecute(todoId: string): Promise<boolean> {
  const shoppingItems = await prisma.shoppingItem.findMany({
    where: { todoId, deletedAt: null },
    select: { boughtAt: true },
  });
  
  const allShoppingBought = shoppingItems.length === 0 || 
    shoppingItems.every(item => item.boughtAt !== null);
  
  const todo = await prisma.todo.findUnique({
    where: { id: todoId },
    select: { parentId: true },
  });
  
  if (!todo || !todo.parentId) {
    return allShoppingBought;
  }
  
  const parent = await prisma.todo.findUnique({
    where: { id: todo.parentId },
    select: { completedAt: true, deletedAt: true },
  });
  
  if (!parent || parent.deletedAt) {
    return allShoppingBought;
  }
  
  const parentCompleted = parent.completedAt !== null;
  
  return allShoppingBought && parentCompleted;
}

export async function recalculateReadyStatus(todoId: string): Promise<void> {
  const ready = await calculateReadyToExecute(todoId);
  
  await prisma.todo.update({
    where: { id: todoId },
    data: { readyToExecute: ready },
  });
  
  const children = await prisma.todo.findMany({
    where: { parentId: todoId },
    select: { id: true },
  });
  
  for (const child of children) {
    await recalculateReadyStatus(child.id);
  }
}

export async function detectCycle(todoId: string, newParentId: string): Promise<boolean> {
  if (todoId === newParentId) return true;
  
  let currentId: string | null = newParentId;
  
  while (currentId) {
    if (currentId === todoId) {
      return true;
    }
    
    const current = await prisma.todo.findUnique({
      where: { id: currentId },
      select: { parentId: true },
    });
    
    currentId = current?.parentId || null;
  }
  
  return false;
}