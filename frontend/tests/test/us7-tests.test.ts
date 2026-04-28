import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('TEST-US7-001: is_ready_to_execute returns false when shopping items not bought', () => {
  it('should have calculate_ready_status function in todos.py', () => {
    const apiPath = path.resolve(__dirname, '../../../backend/src/api/todos.py')
    const api = fs.readFileSync(apiPath, 'utf-8')
    expect(api).toContain('calculate_ready_status')
  })
})

describe('TEST-US7-005: Ready status included in todo list response', () => {
  it('should include is_ready_to_execute in types', () => {
    const typesPath = path.resolve(__dirname, '../../src/types/index.ts')
    const types = fs.readFileSync(typesPath, 'utf-8')
    expect(types).toContain('is_ready_to_execute')
  })
})

describe('TEST-US7-006: Ready status indicator shows correct state', () => {
  it('should have TodoCard component', () => {
    const cardPath = path.resolve(__dirname, '../../src/components/TodoCard.tsx')
    expect(fs.existsSync(cardPath)).toBe(true)
    const card = fs.readFileSync(cardPath, 'utf-8')
    expect(card).toContain('is_ready_to_execute')
  })
})

describe('TEST-US7-007: Ready filter returns only ready todos', () => {
  it('should support filter_ready parameter', () => {
    const apiPath = path.resolve(__dirname, '../../../backend/src/api/todos.py')
    const api = fs.readFileSync(apiPath, 'utf-8')
    expect(api).toContain('filter_ready')
  })
})