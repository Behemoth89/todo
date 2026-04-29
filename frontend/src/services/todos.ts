import { request } from './api'

export interface Todo {
  id: string
  title: string
  description?: string
  priority: string
  assignees: { id: string; name: string }[]
  location?: { id: string; name: string }
  startDate?: string
  dueDate?: string
  notes?: string
  completed: boolean
  completedAt?: string
  readyToExecute: boolean
  deletedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTodoInput {
  title: string
  description?: string
  priority: string
  assigneeIds?: string[]
  locationId?: string
  startDate?: string
  dueDate?: string
  notes?: string
}

export const todosApi = {
  list: (params?: { sortBy?: string; sortOrder?: string; filter?: string }) =>
    request<Todo[]>('/todos' + (params ? '?' + new URLSearchParams(params as any) : '')),
  
  get: (id: string) => request<Todo>(`/todos/${id}`),
  
  create: (input: CreateTodoInput) =>
    request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  
  update: (id: string, input: Partial<CreateTodoInput>) =>
    request<Todo>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  
  delete: (id: string) =>
    request<void>(`/todos/${id}`, { method: 'DELETE' }),
  
  complete: (id: string) =>
    request<Todo>(`/todos/${id}/complete`, { method: 'POST' }),
  
  uncomplete: (id: string) =>
    request<Todo>(`/todos/${id}/uncomplete`, { method: 'POST' }),
}