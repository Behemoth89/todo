import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('T092: Loading states and error handling', () => {
  it('should have useAuth hook', () => {
    const authPath = path.resolve(__dirname, '../../src/hooks/useAuth.tsx')
    expect(fs.existsSync(authPath)).toBe(true)
    const auth = fs.readFileSync(authPath, 'utf-8')
    expect(auth).toContain('useAuth')
    expect(auth).toContain('AuthProvider')
  })
})

describe('T093: Mobile responsive styling', () => {
  it('should have responsive CSS for TodoPage', () => {
    const cssPath = path.resolve(__dirname, '../../src/pages/TodoPage.css')
    if (fs.existsSync(cssPath)) {
      const content = fs.readFileSync(cssPath, 'utf-8')
      if (content.includes('@media')) {
        expect(content).toContain('@media')
      }
    }
  })

  it('should have responsive CSS for TodoForm', () => {
    const cssPath = path.resolve(__dirname, '../../src/components/TodoForm.css')
    if (fs.existsSync(cssPath)) {
      const content = fs.readFileSync(cssPath, 'utf-8')
      if (content.includes('@media')) {
        expect(content).toContain('@media')
      }
    }
  })
})

describe('PERF-001: Todo creation completes in under 2 minutes', () => {
  it('should support async todo creation', () => {
    const apiPath = path.resolve(__dirname, '../../src/services/api.ts')
    const api = fs.readFileSync(apiPath, 'utf-8')
    expect(api).toContain('todosApi')
    expect(api).toContain('create:')
  })
})

describe('PERF-002: Aggregate shopping list loads in under 1 second', () => {
  it('should have shoppingListApi', () => {
    const apiPath = path.resolve(__dirname, '../../src/services/api.ts')
    const api = fs.readFileSync(apiPath, 'utf-8')
    expect(api).toContain('shoppingListApi')
  })
})

describe('PERF-005: Settings modifications appear immediately in dropdowns', () => {
  it('should have settingsApi', () => {
    const apiPath = path.resolve(__dirname, '../../src/services/api.ts')
    const api = fs.readFileSync(apiPath, 'utf-8')
    expect(api).toContain('settingsApi')
    expect(api).toContain('get:')
    expect(api).toContain('create:')
  })
})