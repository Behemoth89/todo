import { request } from './api'

export interface ShoppingItem {
  id: string
  todoId: string
  todoTitle: string
  description: string
  amount?: number
  price?: number
  notes?: string
  bought: boolean
  deletedAt?: string
  createdAt: string
}

export interface CreateShoppingItemInput {
  todoId: string
  description: string
  amount?: number
  price?: number
  notes?: string
}

export const shoppingApi = {
  list: (params?: { todoId?: string; bought?: boolean }) =>
    request<ShoppingItem[]>('/shopping-items' + (params ? '?' + new URLSearchParams(params as any) : '')),
  
  create: (input: CreateShoppingItemInput) =>
    request<ShoppingItem>('/shopping-items', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  
  update: (id: string, input: Partial<CreateShoppingItemInput>) =>
    request<ShoppingItem>(`/shopping-items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  
  delete: (id: string) =>
    request<void>(`/shopping-items/${id}`, { method: 'DELETE' }),
  
  toggleBought: (id: string) =>
    request<ShoppingItem>(`/shopping-items/${id}/toggle-bought`, { method: 'POST' }),
}