import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('TEST-SETUP-001: Backend project structure exists', () => {
  it('should have backend/src/api directory', () => {
    expect(fs.existsSync(path.resolve(__dirname, '../../../backend/src/api'))).toBe(true)
  })

  it('should have backend/src/middleware directory', () => {
    expect(fs.existsSync(path.resolve(__dirname, '../../../backend/src/middleware'))).toBe(true)
  })

  it('should have backend/src/utils directory', () => {
    expect(fs.existsSync(path.resolve(__dirname, '../../../backend/src/utils'))).toBe(true)
  })

  it('should have backend/prisma directory', () => {
    expect(fs.existsSync(path.resolve(__dirname, '../../../backend/prisma'))).toBe(true)
  })
})

describe('TEST-SETUP-002: Frontend project structure exists', () => {
  it('should have frontend/src/components directory', () => {
    expect(fs.existsSync(path.resolve(__dirname, '../../src/components'))).toBe(true)
  })

  it('should have frontend/src/pages directory', () => {
    expect(fs.existsSync(path.resolve(__dirname, '../../src/pages'))).toBe(true)
  })

  it('should have frontend/src/services directory', () => {
    expect(fs.existsSync(path.resolve(__dirname, '../../src/services'))).toBe(true)
  })

  it('should have frontend/src/hooks directory', () => {
    expect(fs.existsSync(path.resolve(__dirname, '../../src/hooks'))).toBe(true)
  })

  it('should have frontend/src/types directory', () => {
    expect(fs.existsSync(path.resolve(__dirname, '../../src/types'))).toBe(true)
  })
})

describe('TEST-SETUP-003: FastAPI dependencies resolve', () => {
  it('should have fastapi in pyproject.toml', () => {
    const pyproject = fs.readFileSync(path.resolve(__dirname, '../../../backend/pyproject.toml'), 'utf-8')
    expect(pyproject).toContain('fastapi')
  })

  it('should have prisma in dependencies', () => {
    const pyproject = fs.readFileSync(path.resolve(__dirname, '../../../backend/pyproject.toml'), 'utf-8')
    expect(pyproject).toContain('prisma')
  })

  it('should have uvicorn in dependencies', () => {
    const pyproject = fs.readFileSync(path.resolve(__dirname, '../../../backend/pyproject.toml'), 'utf-8')
    expect(pyproject).toContain('uvicorn')
  })
})

describe('TEST-SETUP-004: React dependencies resolve', () => {
  it('should have react in package.json', () => {
    const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8'))
    expect(pkg.dependencies).toHaveProperty('react')
  })

  it('should have react-router-dom in dependencies', () => {
    const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8'))
    expect(pkg.dependencies).toHaveProperty('react-router-dom')
  })

  it('should have axios in dependencies', () => {
    const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8'))
    expect(pkg.dependencies).toHaveProperty('axios')
  })
})

describe('TEST-SETUP-005: TypeScript configuration is valid', () => {
  it('should have valid tsconfig.json', () => {
    const tsconfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../tsconfig.json'), 'utf-8'))
    expect(tsconfig.compilerOptions).toBeDefined()
    expect(tsconfig.compilerOptions.strict).toBe(true)
    expect(tsconfig.include).toContain('src')
  })
})

describe('TEST-SETUP-006: Python environment configured', () => {
  it('should have pyproject.toml with requires-python', () => {
    const pyproject = fs.readFileSync(path.resolve(__dirname, '../../../backend/pyproject.toml'), 'utf-8')
    expect(pyproject).toContain('requires-python')
  })
})

describe('TEST-SETUP-007: Linting configuration valid', () => {
  it('should have eslint config', () => {
    expect(fs.existsSync(path.resolve(__dirname, '../../eslint.config.js'))).toBe(true)
  })

  it('should have ruff config in pyproject.toml', () => {
    const pyproject = fs.readFileSync(path.resolve(__dirname, '../../../backend/pyproject.toml'), 'utf-8')
    expect(pyproject).toContain('tool.ruff')
  })
})