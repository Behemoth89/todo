# FamilyTodo

## What This Is

A multi-family to-do application that allows families to organize and share tasks. Each family can create, assign, and track to-do items with members collaborating in a shared space. The initial phase focuses on establishing solid authentication with family management.

## Core Value

Secure family-based authentication where users can create or join families using invite codes, enabling collaborative task management within family units.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can register with email/password
- [ ] User can create a new family during registration
- [ ] User can join an existing family using invite code
- [ ] User can log in and maintain session
- [ ] User can log out
- [ ] JWT authentication with refresh tokens

### Out of Scope

- Real-time collaboration features
- Task assignment and tracking
- Family member management beyond invite codes
- Mobile apps
- Push notifications

## Context

- **Frontend:** Vue 3 + TailwindCSS + Pinia (TypeScript strict mode)
- **Backend:** Node.js/Express (TypeScript strict mode)
- **Database:** PostgreSQL
- **API Documentation:** Swagger/OpenAPI
- **Authentication:** JWT with refresh tokens

## Constraints

- **Tech Stack**: Vue 3 + Tailwind + Pinia + TypeScript (strict) — Frontend requirement
- **Tech Stack**: PostgreSQL + Swagger — Backend requirement
- **Security**: JWT access tokens with refresh token rotation
- **Family Model**: Invite codes must be known to join family (not link-based)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Invite codes over links | More controllable, offline-shareable | — Pending |
| JWT + refresh tokens | Standard secure auth pattern | — Pending |
| Family-first model | Users MUST associate with family on register | — Pending |

---

*Last updated: 2026-04-29 after project initialization*