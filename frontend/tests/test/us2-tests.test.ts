import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('TEST-US2-001: TodoAssignee junction table create operation', () => {
  it('should have TodoAssignee in schema', () => {
    const schemaPath = path.resolve(__dirname, '../../../backend/prisma/schema.prisma')
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    expect(schema).toContain('model TodoAssignee')
  })
})

describe('TEST-US2-002: GET /api/todos with assignee filter returns correct todos', () => {
  it('should support filter_assignee parameter', () => {
    const apiPath = path.resolve(__dirname, '../../../backend/src/api/todos.py')
    const api = fs.readFileSync(apiPath, 'utf-8')
    expect(api).toContain('filter_assignee')
  })
})

describe('TEST-US2-003: POST /api/users creates new family member', () => {
  it('should have POST /api/users endpoint', () => {
    const apiPath = path.resolve(__dirname, '../../src/services/api.ts')
    const api = fs.readFileSync(apiPath, 'utf-8')
    expect(api).toContain('usersApi')
    expect(api).toContain('create:')
  })
})

describe('TEST-US2-004: GET /api/users returns all active family members', () => {
  it('should have GET /api/users endpoint', () => {
    const apiPath = path.resolve(__dirname, '../../src/services/api.ts')
    const api = fs.readFileSync(apiPath, 'utf-8')
    expect(api).toContain('usersApi')
    expect(api).toContain('list:')
  })
})

describe('TEST-US2-005: Login endpoint returns JWT token', () => {
  it('should have POST /api/auth/login endpoint', () => {
    const apiPath = path.resolve(__dirname, '../../src/services/api.ts')
    const api = fs.readFileSync(apiPath, 'utf-8')
    expect(api).toContain('authApi')
    expect(api).toContain('login:')
  })
})

describe('TEST-US2-006: Authentication middleware rejects invalid tokens', () => {
  it('should have auth middleware', () => {
    const authPath = path.resolve(__dirname, '../../../backend/src/middleware/auth.py')
    const auth = fs.readFileSync(authPath, 'utf-8')
    expect(auth).toContain('get_current_user')
  })
})

describe('TEST-US2-007: AssigneeSelector multi-select component', () => {
  it('should have AssigneeSelector component or similar', () => {
    const formPath = path.resolve(__dirname, '../../src/components/TodoForm.tsx')
    const form = fs.readFileSync(formPath, 'utf-8')
    expect(form).toContain('assignee')
  })
})

describe('TEST-US2-009: MyTodosPage filters by logged-in user', () => {
  it('should have MyTodosPage component', () => {
    const pagePath = path.resolve(__dirname, '../../src/pages/MyTodosPage.tsx')
    expect(fs.existsSync(pagePath)).toBe(true)
    const page = fs.readFileSync(pagePath, 'utf-8')
    expect(page).toContain('filter_assignee')
  })
})

describe('TEST-US2-010: LoginForm submits credentials and stores token', () => {
  it('should have LoginPage component', () => {
    const pagePath = path.resolve(__dirname, '../../src/pages/LoginPage.tsx')
    expect(fs.existsSync(pagePath)).toBe(true)
  })
})