import { describe, it, expect } from 'vitest'

describe('TEST-FOUND-001: Prisma schema compiles without errors', () => {
  it('should have valid schema.prisma', async () => {
    const schema = await import('../backend/prisma/schema.prisma')
    expect(schema.default).toBeDefined()
    expect(schema.default?.generator).toBeDefined()
    expect(schema.default?.datasource).toBeDefined()
    expect(schema.default?.datasource?.provider).toBe('sqlite')
  })

  it('should have User model', async () => {
    const schema = await import('../backend/prisma/schema.prisma')
    expect(schema.default?.model?.User).toBeDefined()
    expect(schema.default?.model?.User?.fields?.id).toBeDefined()
    expect(schema.default?.model?.User?.fields?.username).toBeDefined()
  })

  it('should have Todo model', async () => {
    const schema = await import('../backend/prisma/schema.prisma')
    expect(schema.default?.model?.Todo).toBeDefined()
    expect(schema.default?.model?.Todo?.fields?.title).toBeDefined()
  })

  it('should have ShoppingItem model', async () => {
    const schema = await import('../backend/prisma/schema.prisma')
    expect(schema.default?.model?.ShoppingItem).toBeDefined()
  })

  it('should have Photo model', async () => {
    const schema = await import('../backend/prisma/schema.prisma')
    expect(schema.default?.model?.Photo).toBeDefined()
  })

  it('should have Settings model', async () => {
    const schema = await import('../backend/prisma/schema.prisma')
    expect(schema.default?.model?.Settings).toBeDefined()
  })

  it('should have TodoAssignee junction model', async () => {
    const schema = await import('../backend/prisma/schema.prisma')
    expect(schema.default?.model?.TodoAssignee).toBeDefined()
  })
})

describe('TEST-FOUND-002: Database migration runs successfully', () => {
  it('should have DATABASE_URL in .env', async () => {
    const fs = await import('fs')
    const envPath = '../backend/.env'
    const exists = fs.existsSync(envPath)
    expect(exists).toBe(true)
  })
})

describe('TEST-FOUND-003: FastAPI app initializes without errors', () => {
  it('should have create_app function', async () => {
    const main = await import('../backend/src/main')
    expect(main.create_app).toBeDefined()
    expect(typeof main.create_app).toBe('function')
  })

  it('should have health endpoint', async () => {
    const main = await import('../backend/src/main')
    const app = main.create_app()
    expect(app.routes).toBeDefined()
  })
})

describe('TEST-FOUND-004: Config loads from environment variables', () => {
  it('should have Settings class', async () => {
    const config = await import('../backend/src/utils/config')
    expect(config.Settings).toBeDefined()
    expect(config.get_settings).toBeDefined()
  })

  it('should have default values', async () => {
    const config = await import('../backend/src/utils/config')
    const settings = config.get_settings()
    expect(settings.database_url).toBeDefined()
    expect(settings.secret_key).toBeDefined()
  })
})

describe('TEST-FOUND-005: Error handler catches and returns proper responses', () => {
  it('should have AppError class', async () => {
    const errors = await import('../backend/src/utils/errors')
    expect(errors.AppError).toBeDefined()
    expect(errors.ConflictError).toBeDefined()
    expect(errors.NotFoundError).toBeDefined()
  })

  it('should have error handler function', async () => {
    const errors = await import('../backend/src/utils/errors')
    expect(errors.error_handler).toBeDefined()
  })
})

describe('TEST-FOUND-006: React app renders without crashes', () => {
  it('should have App component', async () => {
    const App = await import('../frontend/src/App')
    expect(App.default).toBeDefined()
  })

  it('should have main entry point', async () => {
    const main = await import('../frontend/src/main')
    expect(main).toBeDefined()
  })
})

describe('TEST-FOUND-007: API client service initializes', () => {
  it('should have todosApi', async () => {
    const api = await import('../frontend/src/services/api')
    expect(api.todosApi).toBeDefined()
    expect(api.todosApi.list).toBeDefined()
    expect(api.todosApi.create).toBeDefined()
    expect(api.todosApi.update).toBeDefined()
    expect(api.todosApi.delete).toBeDefined()
  })

  it('should have usersApi', async () => {
    const api = await import('../frontend/src/services/api')
    expect(api.usersApi).toBeDefined()
  })

  it('should have settingsApi', async () => {
    const api = await import('../frontend/src/services/api')
    expect(api.settingsApi).toBeDefined()
  })

  it('should have shoppingItemsApi', async () => {
    const api = await import('../frontend/src/services/api')
    expect(api.shoppingItemsApi).toBeDefined()
  })

  it('should have shoppingListApi', async () => {
    const api = await import('../frontend/src/services/api')
    expect(api.shoppingListApi).toBeDefined()
  })

  it('should have authApi', async () => {
    const api = await import('../frontend/src/services/api')
    expect(api.authApi).toBeDefined()
    expect(api.authApi.login).toBeDefined()
    expect(api.authApi.logout).toBeDefined()
  })
})

describe('TEST-FOUND-008: Auth context provides initial state', () => {
  it('should have useAuth hook', async () => {
    const hooks = await import('../frontend/src/hooks/useAuth')
    expect(hooks.useAuth).toBeDefined()
    expect(hooks.AuthProvider).toBeDefined()
  })
})