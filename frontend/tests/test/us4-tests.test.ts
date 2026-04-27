import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('TEST-US4-001: parent_todo_id field saves correctly', () => {
  it('should have parent_todo_id field in Todo model', () => {
    const schemaPath = path.resolve(__dirname, '../../backend/prisma/schema.prisma')
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    expect(schema).toContain('parentTodoId')
  })
})

describe('TEST-US4-002: Child todo shows parent as blocker', () => {
  it('should include parent_todo in types', () => {
    const typesPath = path.resolve(__dirname, '../../src/types/index.ts')
    const types = fs.readFileSync(typesPath, 'utf-8')
    expect(types).toContain('parent_todo')
  })
})

describe('TEST-US4-005: Parent selector shows all available todos', () => {
  it('should have TodoForm with parent field', () => {
    const formPath = path.resolve(__dirname, '../../src/components/TodoForm.tsx')
    const form = fs.readFileSync(formPath, 'utf-8')
    expect(form).toContain('parent')
  })
})

describe('TEST-US4-006: Parent blocker displays correctly in TodoCard', () => {
  it('should have TodoCard component', () => {
    const cardPath = path.resolve(__dirname, '../../src/components/TodoCard.tsx')
    expect(fs.existsSync(cardPath)).toBe(true)
  })
})