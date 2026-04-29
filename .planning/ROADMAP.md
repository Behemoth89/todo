# Roadmap: FamilyTodo

## Overview

| Phases | Requirements | Status |
|--------|------------|--------|
| 1 | 9 | Completed |

## Phase 1: Authentication Foundation

**Goal:** Establish secure authentication with family management

### Requirements Covered

- AUTH-01: User can register with email and password
- AUTH-02: User can log in with email and password
- AUTH-03: User session persists across browser refresh (JWT access token)
- AUTH-04: User can log out and invalidate session
- AUTH-05: JWT access token expires and refresh token allows session continuity
- FAM-01: User can create a new family during registration
- FAM-02: User can generate invite code for their family
- FAM-03: User can join existing family using invite code during registration
- FAM-04: Family invite code is validated before adding user

### Plans

- [x] 01-01-PLAN.md — Auth foundation (Prisma + JWT + all endpoints)
- [x] 01-02-PLAN.md — Frontend Vue 3 + Pinia auth UI

1. User can register with email/password and create family or enter invite code
2. User can log in and receive JWT access token + refresh token
3. Access token expires after configured duration
4. Refresh token can obtain new access token
5. User can log out (refresh token invalidated)
6. Invite code allows user to join existing family
7. Invalid invite code is rejected
8. PostgreSQL stores users, families, and session data
9. Swagger documents all auth endpoints

### Technical Components

- **Frontend:**
  - Vue 3 + Pinia store for auth state
  - Login/Register forms with family selection
  - TailwindCSS dark theme
  - HTTP client with token interceptors

- **Backend:**
  - Express + TypeScript (strict mode)
  - PostgreSQL + TypeORM/Prisma
  - JWT access token (15min) + refresh token (7 days)
  - bcrypt for password hashing
  - Swagger/OpenAPI documentation

---

*Roadmap created: 2026-04-29*
*Last updated: 2026-04-29 after phase 1 execution complete*