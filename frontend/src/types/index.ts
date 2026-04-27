export interface User {
  id: string
  username: string
  name: string
}

export interface Todo {
  id: string
  title: string
  description?: string
  priority?: { id: string; name: string }
  location?: { id: string; name: string }
  assignees: { id: string; name: string }[]
  parent_todo?: { id: string; title: string }
  start_date?: string
  due_date?: string
  completion_date?: string
  notes?: string
  photos?: Photo[]
  shopping_items?: ShoppingItem[]
  is_ready_to_execute: boolean
  created_at: string
  updated_at: string
  version: number
}

export interface ShoppingItem {
  id: string
  description: string
  amount?: string
  price?: number
  notes?: string
  is_bought: boolean
  bought_by?: { id: string; name: string }
  bought_at?: string
  todo?: { id: string; title: string; location?: { id: string; name: string } }
}

export interface Photo {
  id: string
  original_filename: string
  stored_filename: string
  file_size_bytes: number
  created_at: string
}

export interface Settings {
  locations: { id: string; name: string; sort_order?: number }[]
  priorities: { id: string; name: string; sort_order?: number }[]
}

export interface PaginatedResponse<T> {
  items?: T[]
  todos?: T[]
  total: number
  page: number
  limit?: number
}

export interface ConflictError {
  error: 'conflict'
  message: string
  current_version: number
}