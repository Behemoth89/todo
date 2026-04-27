import { describe, it, expect, beforeEach } from 'vitest'
import { vi } from 'vitest'

describe('TEST-SETUP-001: Backend project structure exists', () => {
  it('should have backend/src/api directory', () => {
    expect(() => require.resolve('../backend/src/api')).not.toThrow()
  })

  it('should have backend/src/models directory', () => {
    expect(() => require.resolve('../backend/src/models')).not.toThrow()
  })

  it('should have backend/src/services directory', () => {
    expect(() => require.resolve('../backend/src/services')).not.toThrow()
  })

  it('should have backend/src/utils directory', () => {
    expect(() => require.resolve('../backend/src/utils')).not.toThrow()
  })

  it('should have backend/src/middleware directory', () => {
    expect(() => require.resolve('../backend/src/middleware')).not.toThrow()
  })

  it('should have backend/prisma directory', () => {
    expect(() => require.resolve('../backend/prisma')).not.toThrow()
  })
})

describe('TEST-SETUP-002: Frontend project structure exists', () => {
  it('should have frontend/src/components directory', () => {
    expect(() => require.resolve('../frontend/src/components')).not.toThrow()
  })

  it('should have frontend/src/pages directory', () => {
    expect(() => require.resolve('../frontend/src/pages')).not.toThrow()
  })

  it('should have frontend/src/services directory', () => {
    expect(() => require.resolve('../frontend/src/services')).not.toThrow()
  })

  it('should have frontend/src/hooks directory', () => {
    expect(() => require.resolve('../frontend/src/hooks')).not.toThrow()
  })

  it('should have frontend/src/types directory', () => {
    expect(() => require.resolve('../frontend/src/types')).not.toThrow()
  })

  it('should have frontend/src/styles directory', () => {
    expect(() => require.resolve('../frontend/src/styles')).not.toThrow()
  })
})

describe('TEST-SETUP-003: FastAPI dependencies resolve', () => {
  it('should have fastapi in dependencies', async () => {
    const pyproject = await import('../backend/pyproject.toml')
    const deps = pyproject.default?.dependencies || []
    expect(deps.some(d => d.includes('fastapi'))).toBe(true)
  })

  it('should have prisma in dependencies', async () => {
    const pyproject = await import('../backend/pyproject.toml')
    const deps = pyproject.default?.dependencies || []
    expect(deps.some(d => d.includes('prisma'))).toBe(true)
  })

  it('should have uvicorn in dependencies', async () => {
    const pyproject = await import('../backend/pyproject.toml')
    const deps = pyproject.default?.dependencies || []
    expect(deps.some(d => d.includes('uvicorn'))).toBe(true)
  })
})

describe('TEST-SETUP-004: React dependencies resolve', () => {
  it('should have react in package.json', async () => {
    const pkg = await import('../frontend/package.json')
    expect(pkg.default?.dependencies).toHaveProperty('react')
  })

  it('should have react-router-dom in dependencies', async () => {
    const pkg = await import('../frontend/package.json')
    expect(pkg.default?.dependencies).toHaveProperty('react-router-dom')
  })

  it('should have axios in dependencies', async () => {
    const pkg = await import('../frontend/package.json')
    expect(pkg.default?.dependencies).toHaveProperty('axios')
  })
})

describe('TEST-SETUP-005: TypeScript configuration is valid', () => {
  it('should have valid tsconfig.json', async () => {
    const tsconfig = await import('../frontend/tsconfig.json')
    expect(tsconfig.default?.compilerOptions).toBeDefined()
    expect(tsconfig.default?.compilerOptions?.strict).toBe(true)
    expect(tsconfig.default?.include).toContain('src')
  })
})

describe('TEST-SETUP-006: Python environment configured', () => {
  it('should have pyproject.toml with requires-python', async () => {
    const pyproject = await import('../backend/pyproject.toml')
    expect(pyproject.default?.['requires-python']).toBe('>=3.11')
  })
})

describe('TEST-SETUP-007: Linting configuration valid', () => {
  it('should have eslint config', async () => {
    const eslint = await import('../frontend/eslint.config.js')
    expect(eslint.default).toBeDefined()
  })

  it('should have ruff config in pyproject.toml', async () => {
    const pyproject = await import('../backend/pyproject.toml')
    expect(pyproject.default?.['tool.ruff']).toBeDefined()
  })
})