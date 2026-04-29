# Phase 4: Refactor and Run - Context

**Gathered:** 2026-04-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Restructure project for consistency, add Docker setup, get app running in Docker containers.
</domain>

<decisions>
## Implementation Decisions

### Project Structure
- **D-01:** Backend in root `/backend` directory
  - Move Next.js backend from `/src` to `/backend`
  - Backend = Next.js API with Prisma
- **D-02:** Frontend in root `/frontend` directory
  - Keep existing `/frontend` as-is
  - Frontend = Vue SPA with Vuetify
- Consistent structure: both in root, separate purposes

### Configuration Files
- **D-03:** Add .gitignore files
  - Root .gitignore with common patterns (node_modules, .env, dist, etc.)
  - Backend-specific (.next, coverage)
  - Frontend-specific (dist, eslint cache)

### Docker Setup
- **D-04:** Backend Dockerfile
  - Next.js based image
  - Prisma migrate and generate
  - Build and run
- **D-05:** Frontend Dockerfile
  - Node.js + Vite build
  - Multi-stage build (build then serve)
- **D-06:** Docker Compose
  - Services: backend, frontend, postgres, (optional nginx proxy)
  - Shared network for communication
  - Environment variables via .env files
- **D-07:** Database in Docker
  - PostgreSQL container via Docker Compose
  - Prisma migration on startup

### Execution
- **D-08:** Run via Docker Compose
  - `docker-compose up --build` to start all services
  - Or individual: `docker-compose up backend`

</decisions>

<canonical_refs>
## Canonical References

### Project Structure
- `.planning/phases/01-foundation/01-CONTEXT.md` — Backend decisions (Next.js, Prisma, JWT)
- `.planning/phases/03-frontend-ui/03-CONTEXT.md` — Frontend decisions (Vue, Vuetify, Pinia)

### Docker Best Practices
- Official Node.js Docker images
- Multi-stage builds for smaller images
- non-root user for security

</canonical_refs>

 代码上下文
## Existing Code Insights

### Current Structure
- Backend: `/src` with Next.js app router (`/src/app/api`)
- Frontend: `/frontend` with Vue + Vuetify
- Database: Prisma in `/prisma`

### Established Patterns
- REST API with Zod validation
- JWT authentication
- Soft delete patterns

### Integration Points
- Frontend calls backend API
- Backend connects to PostgreSQL via Prisma

</code_context>

<specifics>
## Specific Ideas

- "I want frontend is frontend/src but backend is src/app/api" → restructure to `/backend` and `/frontend` at root
- Get app running in Docker
- Use best practices

</specifics>

<deferred>
## Deferred Ideas

- None — full scope confirmed

</deferred>

---

*Phase: 04-refactor-run*
*Context gathered: 2026-04-29*