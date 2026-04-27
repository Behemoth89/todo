# Research: Family Chores Todo App

## Decisions Made

### Photo Storage

- **Decision**: Use Sharp library on backend to convert uploaded images to optimized WebP format
- **Rationale**: WebP provides 25-35% smaller file sizes than JPEG with comparable quality. Sharp is the standard Node.js image processing library with excellent performance.
- **Alternatives considered**: 
  - Cloudinary: Adds external dependency, cost
  - S3 image optimization: Requires additional Lambda processing
  - Store original: Would bloat storage, slower loading

### Parent-Child Todo Dependencies

- **Decision**: Store parent_todo_id on each todo, recursive query for dependency chain
- **Rationale**: Simple and performant for typical family use (depth < 10). Cycle detection at creation time prevents infinite loops.
- **Alternatives considered**:
  - Adjacency list with path: More complex queries
  - Nested sets: Complex maintenance for frequent updates
  - Closure table: Best for deep trees but overkill for this use case

### Optimistic Locking

- **Decision**: Add `version` field to all entities, compare-and-swap on updates
- **Rationale**: Simple to implement, works well for single-user apps with rare concurrent edits. User notified when their changes overwrite another's.
- **Alternatives considered**:
  - Pessimistic locking: Blocks access, poor UX
  - CRDTs: Overly complex for this use case
  - Last-write-wins: Already the behavior, just need to notify user

### Sorting and Filtering

- **Decision**: Backend handles all sorting/filtering via Prisma queries
- **Rationale**: Client-side sorting insufficient for large datasets. Backend pagination + Prisma filtering provides consistent performance.
- **Alternatives considered**:
  - Client-side: Fails with 100+ items
  - ElasticSearch: Overkill for single-family app

### Configurable Lists (No Enums)

- **Decision**: Settings table with key-value pairs for configurable lists (locations, priorities, family members)
- **Rationale**: User explicitly requested no hardcoded enums. Settings table provides flexibility while maintaining structure.
- **Alternatives considered**:
  - JSON column: Harder to query individually
  - Separate tables per type: Over-abstracted

## Technology Stack

- **Frontend**: React 18 with TypeScript, Vite for build
- **Backend**: FastAPI (Python) or Express/Node.js - **NEEDS DECISION**
- **Database**: SQLite (dev), PostgreSQL (prod) via Prisma ORM
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Image Processing**: Sharp for WebP conversion

## Clarifications Resolved

1. **Photo storage mechanism**: Use Sharp on backend to convert to WebP before storage
2. **Concurrent edit handling**: Optimistic locking with version field
3. **Platform**: Pure responsive web, no offline capability required per clarifications

## Unresolved

(None - all unknowns resolved)