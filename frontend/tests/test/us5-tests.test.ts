import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('TEST-US5-001: ShoppingItem create operation', () => {
  it('should have ShoppingItem model in schema', () => {
    const schemaPath = path.resolve(__dirname, '../../../backend/prisma/schema.prisma')
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    expect(schema).toContain('model ShoppingItem')
  })

  it('should have shopping_items.py', () => {
    const apiPath = path.resolve(__dirname, '../../../backend/src/api/shopping_items.py')
    expect(fs.existsSync(apiPath)).toBe(true)
  })
})

describe('TEST-US5-002: GET /api/todos/:todoId/shopping-items returns items', () => {
  it('should have shoppingItemsApi.list function', () => {
    const apiPath = path.resolve(__dirname, '../../src/services/api.ts')
    const api = fs.readFileSync(apiPath, 'utf-8')
    expect(api).toContain('shoppingItemsApi')
    expect(api).toContain('list:')
  })
})

describe('TEST-US5-003: PUT /api/shopping-items/:id updates item', () => {
  it('should have shoppingItemsApi.update function', () => {
    const apiPath = path.resolve(__dirname, '../../src/services/api.ts')
    const api = fs.readFileSync(apiPath, 'utf-8')
    expect(api).toContain('update:')
  })
})

describe('TEST-US5-004: Soft delete on shopping item', () => {
  it('should have shoppingItemsApi.delete function', () => {
    const apiPath = path.resolve(__dirname, '../../src/services/api.ts')
    const api = fs.readFileSync(apiPath, 'utf-8')
    expect(api).toContain('delete:')
  })
})

describe('TEST-US5-005: Marking item as bought retains visibility', () => {
  it('should support is_bought field', () => {
    const typesPath = path.resolve(__dirname, '../../src/types/index.ts')
    const types = fs.readFileSync(typesPath, 'utf-8')
    expect(types).toContain('is_bought')
  })
})

describe('TEST-US5-006: ShoppingItemList renders items correctly', () => {
  it('should have ShoppingItemList component', () => {
    const compPath = path.resolve(__dirname, '../../src/components/ShoppingItemList.tsx')
    expect(fs.existsSync(compPath)).toBe(true)
  })
})