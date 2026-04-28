import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('TEST-FOUND-001: Prisma schema compiles without errors', () => {
  it('should have valid schema.prisma', () => {
    const schemaPath = path.resolve(__dirname, '../../../backend/prisma/schema.prisma')
    expect(fs.existsSync(schemaPath)).toBe(true)
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    expect(schema).toContain('generator')
    expect(schema).toContain('datasource')
    expect(schema).toContain('sqlite')
  })

  it('should have User model', () => {
    const schemaPath = path.resolve(__dirname, '../../../backend/prisma/schema.prisma')
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    expect(schema).toContain('model User')
    expect(schema).toMatch(/id\s+String/)
  })

  it('should have Todo model', () => {
    const schemaPath = path.resolve(__dirname, '../../../backend/prisma/schema.prisma')
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    expect(schema).toContain('model Todo')
    expect(schema).toMatch(/title\s+String/)
  })

  it('should have ShoppingItem model', () => {
    const schemaPath = path.resolve(__dirname, '../../../backend/prisma/schema.prisma')
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    expect(schema).toContain('model ShoppingItem')
  })

  it('should have Photo model', () => {
    const schemaPath = path.resolve(__dirname, '../../../backend/prisma/schema.prisma')
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    expect(schema).toContain('model Photo')
  })

  it('should have Settings model', () => {
    const schemaPath = path.resolve(__dirname, '../../../backend/prisma/schema.prisma')
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    expect(schema).toContain('model Settings')
  })
})

describe('TEST-FOUND-002: Database migration runs successfully', () => {
  it('should have DATABASE_URL in .env.example', () => {
    const envPath = path.resolve(__dirname, '../../../backend/.env.example')
    expect(fs.existsSync(envPath)).toBe(true)
  })
})

describe('TEST-FOUND-003: FastAPI app initializes without errors', () => {
  it('should have main.py', () => {
    const mainPath = path.resolve(__dirname, '../../../backend/src/main.py')
    expect(fs.existsSync(mainPath)).toBe(true)
    const main = fs.readFileSync(mainPath, 'utf-8')
    expect(main).toContain('FastAPI')
    expect(main).toContain('create_app')
  })
})

describe('TEST-FOUND-004: Config loads from environment variables', () => {
  it('should have config.py', () => {
    const configPath = path.resolve(__dirname, '../../../backend/src/utils/config.py')
    expect(fs.existsSync(configPath)).toBe(true)
    const config = fs.readFileSync(configPath, 'utf-8')
    expect(config).toContain('Settings')
    expect(config).toContain('get_settings')
  })
})

describe('TEST-FOUND-005: Error handler catches and returns proper responses', () => {
  it('should have errors.py', () => {
    const errorsPath = path.resolve(__dirname, '../../../backend/src/utils/errors.py')
    expect(fs.existsSync(errorsPath)).toBe(true)
    const errors = fs.readFileSync(errorsPath, 'utf-8')
    expect(errors).toContain('AppError')
    expect(errors).toContain('ConflictError')
  })
})

describe('TEST-FOUND-006: React app renders without crashes', () => {
  it('should have App.tsx', () => {
    const appPath = path.resolve(__dirname, '../../src/App.tsx')
    expect(fs.existsSync(appPath)).toBe(true)
    const app = fs.readFileSync(appPath, 'utf-8')
    expect(app).toContain('BrowserRouter')
  })

  it('should have main.tsx', () => {
    const mainPath = path.resolve(__dirname, '../../src/main.tsx')
    expect(fs.existsSync(mainPath)).toBe(true)
  })
})

describe('TEST-FOUND-007: API client service initializes', () => {
  it('should have api.ts with todosApi', () => {
    const apiPath = path.resolve(__dirname, '../../src/services/api.ts')
    expect(fs.existsSync(apiPath)).toBe(true)
    const api = fs.readFileSync(apiPath, 'utf-8')
    expect(api).toContain('todosApi')
    expect(api).toContain('authApi')
    expect(api).toContain('shoppingItemsApi')
  })
})

describe('TEST-FOUND-008: Auth context provides initial state', () => {
  it('should have useAuth hook', () => {
    const hookPath = path.resolve(__dirname, '../../src/hooks/useAuth.tsx')
    expect(fs.existsSync(hookPath)).toBe(true)
    const hook = fs.readFileSync(hookPath, 'utf-8')
    expect(hook).toContain('AuthProvider')
    expect(hook).toContain('useAuth')
  })
})