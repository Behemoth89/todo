# Requirements: Family Chores Todo App

**Defined:** 2026-04-28
**Core Value:** Help families organize and track household chores with clear responsibility assignment and material tracking.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication

- [ ] **AUTH-01**: User can sign up with email and password
- [ ] **AUTH-02**: User can log in and stay logged in across sessions
- [ ] **AUTH-03**: User can log out from any page
- [ ] **AUTH-04**: Each family member has individual login credentials

### Todos

- [ ] **TODO-01**: User can create a todo with title, description, priority, assignees, location, start date, due date, and notes
- [ ] **TODO-02**: User can edit existing todos
- [ ] **TODO-03**: User can soft-delete todos
- [ ] **TODO-04**: User can mark todos as complete (sets completion date)
- [ ] **TODO-05**: User can view todos assigned to them
- [ ] **TODO-06**: Todos can be sorted by title, priority, assignees, location, start date, due date, completion date, status, ready-to-execute
- [ ] **TODO-07**: Todos can be filtered by priority, assignees, location, start date, due date, completion date, status, ready-to-execute

### Assignment

- [ ] **ASGN-01**: User can assign one family member to a todo
- [ ] **ASGN-02**: User can assign multiple family members to a todo
- [ ] **ASGN-03**: User can view todos assigned to them specifically

### Locations

- [ ] **LOC-01**: User can add locations (rooms/areas) in settings
- [ ] **LOC-02**: User can assign a location to each todo
- [ ] **LOC-03**: User can edit locations in settings
- [ ] **LOC-04**: Locations are configurable (no hardcoded enums)

### Photos

- [ ] **PHOTO-01**: User can attach multiple photos to a todo (max 10MB each, stored as WebP)
- [ ] **PHOTO-02**: User can view photos attached to a todo
- [ ] **PHOTO-03**: User can remove photos from a todo
- [ ] **PHOTO-04**: Photo thumbnails displayed in todo list

### Parent Dependencies

- [ ] **DEPN-01**: User can define a parent todo as a blocker
- [ ] **DEPN-02**: System prevents circular parent dependencies
- [ ] **DEPN-03**: Child todo shows parent as incomplete until parent is complete

### Shopping Items

- [ ] **SHOP-01**: User can add shopping items to a todo with description, amount, price, notes
- [ ] **SHOP-02**: User can edit shopping items
- [ ] **SHOP-03**: User can mark shopping items as bought (remains visible)
- [ ] **SHOP-04**: User can soft-delete shopping items

### Aggregate Shopping List

- [ ] **AGGR-01**: User can view all shopping items across all todos in one view
- [ ] **AGGR-02**: User can filter aggregate list by bought status
- [ ] **AGGR-03**: User can filter aggregate list by todo or location
- [ ] **AGGR-04**: Bought status syncs between todo view and aggregate view

### Ready to Execute

- [ ] **RDY-01**: Todo shows NOT ready if shopping items are not all bought
- [ ] **RDY-02**: Todo shows NOT ready if parent todos are not complete
- [ ] **RDY-03**: Todo shows READY when all shopping items bought AND all parent todos complete
- [ ] **RDY-04**: Todo with no shopping items and no parents shows READY

### Settings

- [ ] **SET-01**: User can configure family members list in settings
- [ ] **SET-02**: User can configure locations list in settings
- [ ] **SET-03**: User can configure priorities list in settings
- [ ] **SET-04**: All configuration lists are modifiable without code changes

### Soft Delete

- [ ] **SOFT-01**: Todos use soft delete with timestamps
- [ ] **SOFT-02**: Shopping items use soft delete
- [ ] **SOFT-03**: Photos use soft delete
- [ ] **SOFT-04**: Locations use soft delete
- [ ] **SOFT-05**: Date filters determine what to show in lists

## v2 Requirements

### Notifications

- **NOTF-01**: User receives notifications when assigned a todo
- **NOTF-02**: User receives notifications when todo status changes

### Calendar View

- **CAL-01**: User can view todos in calendar format
- **CAL-02**: User can filter calendar by assignee

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time collaborative editing | Using optimistic locking instead |
| Mobile native app | Responsive web only |
| Offline mode | Not required for v1 |
| Push notifications | V2+ |
| Video attachments | Photos sufficient for v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| TODO-01 | Phase 1 | Pending |
| TODO-02 | Phase 1 | Pending |
| TODO-03 | Phase 1 | Pending |
| TODO-04 | Phase 1 | Pending |
| TODO-05 | Phase 1 | Pending |
| TODO-06 | Phase 1 | Pending |
| TODO-07 | Phase 1 | Pending |
| ASGN-01 | Phase 1 | Pending |
| ASGN-02 | Phase 1 | Pending |
| ASGN-03 | Phase 1 | Pending |
| LOC-01 | Phase 1 | Pending |
| LOC-02 | Phase 1 | Pending |
| LOC-03 | Phase 1 | Pending |
| LOC-04 | Phase 1 | Pending |
| PHOTO-01 | Phase 2 | Pending |
| PHOTO-02 | Phase 2 | Pending |
| PHOTO-03 | Phase 2 | Pending |
| PHOTO-04 | Phase 2 | Pending |
| DEPN-01 | Phase 2 | Pending |
| DEPN-02 | Phase 2 | Pending |
| DEPN-03 | Phase 2 | Pending |
| SHOP-01 | Phase 2 | Pending |
| SHOP-02 | Phase 2 | Pending |
| SHOP-03 | Phase 2 | Pending |
| SHOP-04 | Phase 2 | Pending |
| AGGR-01 | Phase 2 | Pending |
| AGGR-02 | Phase 2 | Pending |
| AGGR-03 | Phase 2 | Pending |
| AGGR-04 | Phase 2 | Pending |
| RDY-01 | Phase 2 | Pending |
| RDY-02 | Phase 2 | Pending |
| RDY-03 | Phase 2 | Pending |
| RDY-04 | Phase 2 | Pending |
| SET-01 | Phase 1 | Pending |
| SET-02 | Phase 1 | Pending |
| SET-03 | Phase 1 | Pending |
| SET-04 | Phase 1 | Pending |
| SOFT-01 | Phase 1 | Pending |
| SOFT-02 | Phase 1 | Pending |
| SOFT-03 | Phase 2 | Pending |
| SOFT-04 | Phase 1 | Pending |
| SOFT-05 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 48 total
- Mapped to phases: 48
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-28*
*Last updated: 2026-04-28 after initial definition*