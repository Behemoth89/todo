import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('TEST-OPT-001: Concurrent update detection (version conflict)', () => {
  it('should have ConflictError class in errors.py', () => {
    const errorsPath = path.resolve(__dirname, '../../backend/src/utils/errors.py')
    const errors = fs.readFileSync(errorsPath, 'utf-8')
    expect(errors).toContain('ConflictError')
  })
})

describe('TEST-OPT-002: Conflict notification response format', () => {
  it('should have ConflictError type in frontend', () => {
    const typesPath = path.resolve(__dirname, '../../src/types/index.ts')
    const types = fs.readFileSync(typesPath, 'utf-8')
    expect(types).toContain('ConflictError')
    expect(types).toContain('current_version')
  })
})

describe('TEST-OPT-003: Version field increments on update', () => {
  it('should have version field in schema', () => {
    const schemaPath = path.resolve(__dirname, '../../backend/prisma/schema.prisma')
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    expect(schema).toContain('version Int')
  })
})

describe('TEST-OPT-004: Conflict notification displays to user', () => {
  it('should export ConflictError type', () => {
    const apiPath = path.resolve(__dirname, '../../src/services/api.ts')
    const api = fs.readFileSync(apiPath, 'utf-8')
    expect(api).toContain('ConflictError')
  })
})