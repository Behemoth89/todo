---
status: testing
phase: 02-advanced-features
source: 02-01-SUMMARY.md, 02-02-SUMMARY.md, 02-03-SUMMARY.md
started: 2026-04-28T00:00:00Z
updated: 2026-04-28T00:00:00Z
---

## Current Test

number: 1
name: Photo Model in Schema
expected: |
  Prisma schema has Photo model with data, thumbnail (Bytes), todoId relation, soft delete fields.
  Todo model has photos relation.
awaiting: user response

## Tests

### 1. Photo Model in Schema
expected: Prisma schema has Photo model with data, thumbnail (Bytes), todoId relation, soft delete fields. Todo model has photos relation.
result: pending

### 2. Photo Upload Endpoint - 10MB Validation
expected: POST to /api/todos/[id]/photos accepts file, validates <10MB, converts to WebP, stores in DB, returns photo ID
result: pending

### 3. Photo List Endpoint
expected: GET /api/todos/[id]/photos returns list of photos (id, createdAt) for the todo
result: pending

### 4. Photo Delete - Soft Delete
expected: DELETE /api/todos/[id]/photos/[photoId] sets deletedAt timestamp, photo no longer appears in list
result: pending

### 5. Photo Serve - Ownership Check
expected: GET /api/photos/[photoId] returns 401 if user doesn't own the todo, returns WebP if authorized
result: pending

### 6. Parent Dependency - Cycle Detection
expected: PATCH /api/todos/[id] with parentId pointing to itself or a descendant returns 400 error
result: pending

### 7. Parent Dependency - Assignment
expected: PATCH /api/todos/[id] with parentId of another user's todo returns 404
result: pending

### 8. Ready Status - No Parents Complete
expected: Todo without parent and no shopping items has readyToExecute: true
result: pending

### 9. Ready Status - Parent Incomplete Blocks
expected: Todo with incomplete parent has readyToExecute: false
result: pending

### 10. Shopping Item - Add to Todo
expected: POST /api/todos/[id]/shopping-items creates item, item appears in GET
result: pending

### 11. Shopping Item - Buy Toggle
expected: POST /api/shopping-items/[id]/buy toggles boughtAt between timestamp and null
result: pending

### 12. Aggregate Shopping List - Filters
expected: GET /api/shopping-items?bought=true returns only bought items, ?bought=false returns unbought
result: pending

## Summary

total: 12
passed: 0
issues: 0
pending: 12
skipped: 0
blocked: 0

## Gaps

[none yet]