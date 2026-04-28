---
phase: 01-foundation
plan: 03
subsystem: Settings
tags: [settings, sorting, filtering]
requirements:
  - LOC-01
  - LOC-02
  - LOC-03
  - LOC-04
  - SET-01
  - SET-02
  - SET-03
  - SET-04
  - TODO-06
  - TODO-07
---

# Phase 1 Plan 3: Settings & Sorting/Filtering Summary

**Executed:** 2026-04-28
**Status:** Complete

## One-Liner

Configurable settings for family members, locations, priorities with full CRUD + enhanced todo list with sorting and filtering on all applicable fields.

## Tasks Completed

| Task | Name | Files Created |
|------|------|---------------|
| 1 | Create Family Members Settings | src/app/api/settings/family-members/route.ts, [id]/route.ts |
| 2 | Create Locations Settings | src/app/api/settings/locations/route.ts, [id]/route.ts |
| 3 | Create Priorities Settings | src/app/api/settings/priorities/route.ts, [id]/route.ts |
| 4 | Add Sorting and Filtering | src/app/api/todos/route.ts (updated) |

## Key Decisions

- **All settings soft deletable:** deletedAt timestamp on all models
- **Configurable lists:** No hardcoded enums per SET-04
- **Sort fields:** title, createdAt, dueDate, completedAt, startDate, priorityId, locationId
- **Filter fields:** priorityId, locationId, assigneeId, status, date ranges, readyToExecute

## Files Modified

| File | Description |
|------|-------------|
| src/app/api/settings/family-members/route.ts | List and create family members |
| src/app/api/settings/family-members/[id]/route.ts | Get, update, delete family member |
| src/app/api/settings/locations/route.ts | List and create locations |
| src/app/api/settings/locations/[id]/route.ts | Get, update, delete location |
| src/app/api/settings/priorities/route.ts | List and create priorities |
| src/app/api/settings/priorities/[id]/route.ts | Get, update, delete priority |
| src/app/api/todos/route.ts | Updated with sort/filter |

## Requirements Addressed

- LOC-01: User can add locations in settings ✓
- LOC-02: User can assign a location to each todo ✓
- LOC-03: User can edit locations in settings ✓
- LOC-04: Locations are configurable (no hardcoded enums) ✓
- SET-01: User can configure family members list in settings ✓
- SET-02: User can configure locations list in settings ✓
- SET-03: User can configure priorities list in settings ✓
- SET-04: All configuration lists are modifiable without code changes ✓
- TODO-06: Todos can be sorted by all applicable fields ✓
- TODO-07: Todos can be filtered by all applicable fields ✓

## Query Parameters for Todo List

| Parameter | Description |
|-----------|-------------|
| sortBy | title, createdAt, dueDate, completedAt, startDate, priorityId, locationId |
| sortOrder | asc, desc |
| priorityId | Filter by priority |
| locationId | Filter by location |
| assigneeId | Filter by assignee (ASGN-03) |
| status | completed, incomplete |
| startDateFrom, startDateTo | Filter by start date range |
| dueDateFrom, dueDateTo | Filter by due date range |
| completedFrom, completedTo | Filter by completion date range |
| readyToExecute | true, false |

## Commits

- `2eb561a` feat(01-03): add settings and sorting/filtering

## Metrics

- Duration: ~15 minutes
- Files created: 6
- Files modified: 1
- Lines added: ~689

---

*Summary created: 2026-04-28*