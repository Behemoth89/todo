# Phase 2: Advanced Features - Context

**Gathered:** 2026-04-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Photos, parent dependencies, shopping items, aggregate shopping list view, and ready-to-execute status.
</domain>

<decisions>
## Implementation Decisions

### Photo Storage
- **D-01:** Database (BLOB) storage
- Store photos directly in database as WebP
- Max 10 photos per todo

### Photo Conversion
- **D-02:** Convert to WebP at upload time
- Photos converted immediately upon upload
- Storage savings from the start

### Thumbnails
- **D-03:** Generate at upload
- 150x150 pixel thumbnail generated during upload pipeline
- Thumbnail stored alongside full image

### Photo Deletion
- **D-04:** Soft delete photos
- When todo is soft-deleted, photos are also soft-deleted

### Parent Dependency UI
- **D-05:** Search dialog
- Modal with search and filter for selecting parent todo

### Cycle Detection
- **D-06:** Detect on save
- Validate for circular dependencies when saving parent reference
- Immediate feedback prevents bad data

### Shopping Data Model
- **D-07:** Separate table
- Shopping items in their own table with foreign key to todo
- Queryable and syncable

### Aggregate Shopping API
- **D-08:** Separate endpoint
- New endpoint /shopping-items with todo_id filter

### Ready-to-Execute
- **D-09:** Stored + event-driven
- Status saved to database, recalculated on relevant changes
- Shopping item bought changed, parent completed, etc.

### Shopping Sync
- **D-10:** Frontend sync
- Single source of truth in database, frontend updates both displays

### Frontend Framework
- **D-11:** Vue SPA frontend with Next.js API
- Next.js API routes for backend (existing)
- Vue for frontend UI
- Separate frontend application

</decisions>

<specifics>
## Specific Ideas

- "I want Vue as the frontend framework"

</specifics>

<canonical_refs>
## Canonical References

### Requirements
- `.planning/REQUIREMENTS.md` — Phase 2 requirements (PHOTO-01 through RDY-04, SHOP-01 through AGGR-04, SOFT-02, SOFT-03)
- `.planning/ROADMAP.md` — Phase 2 scope

### Phase 1 Context
- `.planning/phases/01-foundation/01-CONTEXT.md` — Backend decisions (Prisma, PostgreSQL, JWT, REST API)

</canonical_refs>

 代码上下文
## Existing Code Insights

### Reusable Assets
- Prisma schema from Phase 1 with soft delete patterns
- JWT authentication middleware
- REST API patterns with Zod validation

### Established Patterns
- Soft delete using deleted_at timestamp
- Separate table entities with relations
- Event-driven recalculation for ready status

### Integration Points
- Photos integrate with todo entity (one-to-many)
- Shopping items integrate with todo entity (one-to-many)
- Parent dependency is self-referential relation on todos

</code_context>

<deferred>
## Deferred Ideas

- Full tech stack decision - Frontend framework choice noted in this phase (Phase 1 should have addressed this earlier)

</deferred>

---

*Phase: 02-advanced-features*
*Context gathered: 2026-04-28*