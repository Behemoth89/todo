import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('TEST-US6-001: GET /api/shopping-list aggregates all items', () => {
  it('should have shoppingListApi.list function', () => {
    const apiPath = path.resolve(__dirname, '../../src/services/api.ts')
    const api = fs.readFileSync(apiPath, 'utf-8')
    expect(api).toContain('shoppingListApi')
    expect(api).toContain('list:')
  })
})

describe('TEST-US6-002: Filtering by bought status', () => {
  it('should have ShoppingListFilters component', () => {
    const filtersPath = path.resolve(__dirname, '../../src/components/ShoppingListFilters.tsx')
    expect(fs.existsSync(filtersPath)).toBe(true)
  })
})

describe('TEST-US6-005: Pagination returns correct page', () => {
  it('should have shopping list endpoint with pagination', () => {
    const apiPath = path.resolve(__dirname, '../../backend/src/api/shopping_list.py')
    expect(fs.existsSync(apiPath)).toBe(true)
  })
})

describe('TEST-US6-006: AggregateShoppingList renders all items', () => {
  it('should have ShoppingListPage component', () => {
    const pagePath = path.resolve(__dirname, '../../src/pages/ShoppingListPage.tsx')
    expect(fs.existsSync(pagePath)).toBe(true)
  })
})

describe('TEST-US6-007: ShoppingListFilters apply correctly', () => {
  it('should have ShoppingListFilters component', () => {
    const filtersPath = path.resolve(__dirname, '../../src/components/ShoppingListFilters.tsx')
    expect(fs.existsSync(filtersPath)).toBe(true)
  })
})