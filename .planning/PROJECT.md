# Family Chores Todo App

## What This Is

A family chore management app that lets family members create, assign, and track household tasks with support for multi-member assignment, parent-child dependencies, shopping lists linked to todos, and photo attachments.

## Core Value

Help families organize and track household chores with clear responsibility assignment and material tracking.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Family members can create and manage chore todos
- [ ] Todos can be assigned to one or more family members
- [ ] Todos can have locations (rooms/areas)
- [ ] Todos can have photos attached
- [ ] Parent-child todo dependencies (blockers)
- [ ] Shopping items linked to todos (description, amount, price, notes)
- [ ] Aggregate shopping list view across all todos
- [ ] Ready-to-execute status calculation
- [ ] Configurable lists in settings (family members, locations, priorities)
- [ ] Soft delete all entities
- [ ] Start, due, and completion dates
- [ ] Sorting and filtering on all fields
- [ ] User authentication

### Out of Scope

- Real-time collaborative editing (use optimistic locking)
- Mobile native app (responsive web only)
- Offline mode
- Push notifications

## Context

Initial requirements already documented in SPEC.md. This is a new project that will be built as a SPA with API backend.

## Constraints

- **Platform**: Single Page Application with API backend
- **Storage**: Photos converted to WebP (max 10MB per photo)
- **Data**: Soft delete using timestamps
- **Config**: All lists must be configurable (no hardcoded enums)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| SPA with API | Separation of concerns, mobile-friendly | — Pending |
| Soft delete | Maintain history, configurable lists | — Pending |
| Optimistic locking | Handle concurrent edits simply | — Pending |

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state