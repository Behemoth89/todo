import { beforeEach } from 'vitest'

beforeEach(() => {
  localStorage.clear()
})

export const mockUser = {
  id: 'test-user-id',
  username: 'testuser',
  name: 'Test User',
}

export const mockTodo = {
  id: 'test-todo-id',
  title: 'Test Todo',
  description: 'Test description',
  assignees: [],
  is_ready_to_execute: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  version: 1,
}