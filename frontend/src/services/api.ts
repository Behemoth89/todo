import axios, { AxiosError } from 'axios'
import type { User, Todo, ShoppingItem, Settings, PaginatedResponse, ConflictError } from '../types'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: async (username: string, password: string) => {
    const { data } = await api.post<{ token: string; user: User }>('/auth/login', { username, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data
  },
  logout: async () => {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

export const todosApi = {
  list: async (params?: Record<string, string | number | boolean>) => {
    const { data } = await api.get<PaginatedResponse<Todo>>('/todos', { params })
    return data
  },
  get: async (id: string) => {
    const { data } = await api.get<{ todo: Todo }>(`/todos/${id}`)
    return data.todo
  },
  create: async (todo: Partial<Todo> & { version?: number }) => {
    const { data } = await api.post<{ todo: Todo; conflict: boolean }>('/todos', todo)
    return data
  },
  update: async (id: string, todo: Partial<Todo> & { version: number }) => {
    const { data } = await api.put<{ todo: Todo; conflict: boolean }>(`/todos/${id}`, todo)
    return data
  },
  delete: async (id: string) => {
    await api.delete(`/todos/${id}`)
  },
}

export const usersApi = {
  list: async () => {
    const { data } = await api.get<User[]>('/users')
    return data
  },
  create: async (user: { username: string; password: string; name: string }) => {
    const { data } = await api.post<User>('/users', user)
    return data
  },
}

export const settingsApi = {
  get: async () => {
    const { data } = await api.get<Settings>('/settings')
    return data
  },
  create: async (setting: { category: string; name: string; sort_order?: number }) => {
    const { data } = await api.post('/settings', setting)
    return data
  },
  update: async (id: string, setting: { name?: string; sort_order?: number }) => {
    const { data } = await api.put(`/settings/${id}`, setting)
    return data
  },
  delete: async (id: string) => {
    await api.delete(`/settings/${id}`)
  },
}

export const shoppingItemsApi = {
  list: async (todoId: string) => {
    const { data } = await api.get<ShoppingItem[]>(`/todos/${todoId}/shopping-items`)
    return data
  },
  create: async (todoId: string, item: { description: string; amount?: string; price?: number; notes?: string }) => {
    const { data } = await api.post(`/todos/${todoId}/shopping-items`, item)
    return data
  },
  update: async (id: string, item: Partial<ShoppingItem> & { version: number }) => {
    const { data } = await api.put(`/shopping-items/${id}`, item)
    return data
  },
  delete: async (id: string) => {
    await api.delete(`/shopping-items/${id}`)
  },
}

export const shoppingListApi = {
  list: async (params?: { filter_bought?: boolean; filter_todo?: string; filter_location?: string; page?: number; limit?: number }) => {
    const { data } = await api.get<PaginatedResponse<ShoppingItem>>('/shopping-list', { params })
    return data
  },
}

export const photosApi = {
  upload: async (todoId: string, file: File, version: number) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post(`/todos/${todoId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
  delete: async (id: string) => {
    await api.delete(`/photos/${id}`)
  },
}

export type { ConflictError }