# Phase 1: Foundation - Context

**Gathered:** 2026-04-28 (updated)
**Status:** Ready for planning

<domain>
## Phase Boundary

Core todo management with authentication, CRUD operations, soft delete, and configurable settings. Users can register, login, create/edit/list todos, assign to family members, manage locations, sort/filter lists, and configure settings.
</domain>

<decisions>
## Implementation Decisions

### Authentication
- **D-01:** JWT + refresh token for session management
- Access token expires in 15 minutes, refresh token in 7 days
- Enables security while reducing re-login friction

### Soft Delete
- **D-02:** Database filters applied automatically
- All queries include WHERE deleted_at IS NULL
- Simple, consistent approach across all entities

### REST API Design
- **D-03:** Resource-based endpoint design
- Standard REST patterns: POST/GET/PUT/DELETE on /todos, /locations, /family-members, etc.
- Intuitive and well-understood by developers

### Settings Storage
- **D-04:** Configurable settings stored in database
- Family members, locations, priorities stored as database entities with soft delete
- Allows runtime changes without app restart
- Per-family configuration

### Password Recovery
- **D-05:** Email reset link flow
- User requests password reset → email with reset link → click to set new password
- Standard, secure, self-service approach

### Database/ORM
- **D-06:** Prisma ORM with PostgreSQL
- Type-safe queries, easy migrations, great DX
- Schema-defined data model with soft delete fields

### API Response Format
- **D-07:** Envelope format
- { success: boolean, data: {...}, error: null }
- Consistent, frontend-friendly

### Validation Library
- **D-08:** Zod for request validation
- TypeScript-first, integrates with Prisma
- Schema-based validation

### Error Handling
- **D-09:** Centralized error handler middleware
- Express middleware catches all errors
- Format consistently across endpoints

### the agent's Discretion
- Exact token expiration times can be adjusted
- Pagination defaults
- Sorting/filtering URL parameter naming
- Exact database connection string format

</decisions>

<specifics>
## Specific Ideas

- "I want my family members to have individual logins"
- Settings should be configurable without code changes

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `spec.md` — Feature specification with entity definitions and acceptance criteria
- `.planning/REQUIREMENTS.md` — Traceability table

### Phase Scope
- `.planning/ROADMAP.md` — Phase 1 requirements mapped from roadmap

[If no external specs: "No external specs — requirements fully captured in decisions above"]

</canonical_refs>

@lwind
## Existing Code Insights

### Reusable Assets
- None yet — no existing codebase

### Established Patterns
- Soft delete using timestamps (deleted_at, created_at, updated_at)

### Integration Points
- Authentication gates all API endpoints
- Settings relate to todo creation/assignment

</code_context>

<deferred>
## Deferred Ideas

- Photos attached to todos — Phase 2
- Parent-child dependencies — Phase 2
- Shopping items linked to todos — Phase 2

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-04-28*