# Phase 1: Authentication Foundation - Context

**Gathered:** 2026-04-29 (assumptions mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish secure authentication with family management. Users can register, login, logout, and manage family membership via invite codes. All auth endpoints under `/api/v1/auth/` prefix.

</domain>

<decisions>
## Implementation Decisions

### Database ORM
- **D-01:** Use Prisma over TypeORM — better TypeScript integration and schema management

### JWT Token Strategy
- **D-02:** HttpOnly cookies for access token, refresh token stored in database
- **D-03:** Access token expires in 15 minutes, refresh token expires in 7 days

### Invite Code Format
- **D-04:** Custom invite codes (user-generated, not auto-UUID)
- **D-05:** One-time use invite codes supported — family member can create codes that expire after single use

### API Endpoint Structure
- **D-06:** All auth endpoints prefixed with `/api/v1/auth/`
- **D-07:** Separate endpoints for registration flows:
  - `POST /api/v1/auth/register/new-family` — Create new family with name
  - `POST /api/v1/auth/register/join-family` — Join existing family with invite code

### Login/Logout
- **D-08:** `POST /api/v1/auth/login` — Email + password, returns tokens
- **D-09:** `POST /api/v1/auth/logout` — Invalidates refresh token
- **D-10:** `POST /api/v1/auth/refresh` — Get new access token from valid refresh token

### Invite Code Management
- **D-11:** `POST /api/v1/auth/family/invite` — Generate new invite code (custom or auto-generated)
- **D-12:** `DELETE /api/v1/auth/family/invite/:code` — Revoke/invalidate invite code

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

- `.planning/ROADMAP.md` — Phase 1 requirements and success criteria
- `.planning/REQUIREMENTS.md` — AUTH-01 through AUTH-05, FAM-01 through FAM-04
- `.planning/PROJECT.md` — Tech stack decisions: Vue 3 + Tailwind + Pinia + TypeScript, PostgreSQL, Express

</canonical_refs>

 <delete_file>
## Existing Code Insights

### Reusable Assets
- None yet — no codebase exists

### Established Patterns
- Docker Compose setup already configured for PostgreSQL + backend + frontend
- JWT secrets configured via environment variables

### Integration Points
- Frontend Vue 3 app will need auth state management (Pinia store)
- HTTP client requires token interceptor for cookie handling

</code_context>

<specifics>
## Specific Ideas

- "Family member can create custom one-time invite code" — Custom codes + one-time use option
- "Use versioning" — All endpoints under `/api/v1/` prefix
- "Use separate endpoints" — New-family vs join-family registration

</specifics>

<deferred>
## Deferred Ideas

None — analysis stayed within phase scope

</deferred>

---

*Phase: 01-authentication-foundation*
*Context gathered: 2026-04-29*