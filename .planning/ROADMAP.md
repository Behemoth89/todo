# Roadmap: Family Chores Todo App

**Created:** 2026-04-28
**Phases:** 2
**Requirements:** 48 (all v1)

## Phase 1: Foundation

**Goal:** Core todo management with authentication, CRUD operations, soft delete, and configurable settings.

### Requirements Covered

| ID | Requirement |
|----|-------------|
| AUTH-01 | User can sign up with email and password |
| AUTH-02 | User can log in and stay logged in across sessions |
| AUTH-03 | User can log out from any page |
| AUTH-04 | Each family member has individual login credentials |
| TODO-01 | User can create a todo with title, description, priority, assignees, location, start date, due date, and notes |
| TODO-02 | User can edit existing todos |
| TODO-03 | User can soft-delete todos |
| TODO-04 | User can mark todos as complete (sets completion date) |
| TODO-05 | User can view todos assigned to them |
| TODO-06 | Todos can be sorted by title, priority, assignees, location, start date, due date, completion date, status, ready-to-execute |
| TODO-07 | Todos can be filtered by priority, assignees, location, start date, due date, completion date, status, ready-to-execute |
| ASGN-01 | User can assign one family member to a todo |
| ASGN-02 | User can assign multiple family members to a todo |
| ASGN-03 | User can view todos assigned to them specifically |
| LOC-01 | User can add locations (rooms/areas) in settings |
| LOC-02 | User can assign a location to each todo |
| LOC-03 | User can edit locations in settings |
| LOC-04 | Locations are configurable (no hardcoded enums) |
| SET-01 | User can configure family members list in settings |
| SET-02 | User can configure locations list in settings |
| SET-03 | User can configure priorities list in settings |
| SET-04 | All configuration lists are modifiable without code changes |
| SOFT-01 | Todos use soft delete with timestamps |
| SOFT-04 | Locations use soft delete |
| SOFT-05 | Date filters determine what to show in lists |

**Success Criteria:**

1. Users can register and log in with individual credentials
2. Users can create, edit, view, and soft-delete todos with all fields
3. Users can assign todos to one or more family members
4. Sort and filter works on all applicable fields
5. Locations can be configured in settings
6. Soft delete hides items but preserves them with timestamps
7. Date-based filtering shows/hides items correctly

---

## Phase 2: Advanced Features

**Goal:** Photos, parent dependencies, shopping lists, and ready-to-execute status.

### Requirements Covered

| ID | Requirement |
|----|-------------|
| PHOTO-01 | User can attach multiple photos to a todo (max 10MB each, stored as WebP) |
| PHOTO-02 | User can view photos attached to a todo |
| PHOTO-03 | User can remove photos from a todo |
| PHOTO-04 | Photo thumbnails displayed in todo list |
| DEPN-01 | User can define a parent todo as a blocker |
| DEPN-02 | System prevents circular parent dependencies |
| DEPN-03 | Child todo shows parent as incomplete until parent is complete |
| SHOP-01 | User can add shopping items to a todo with description, amount, price, notes |
| SHOP-02 | User can edit shopping items |
| SHOP-03 | User can mark shopping items as bought (remains visible) |
| SHOP-04 | User can soft-delete shopping items |
| AGGR-01 | User can view all shopping items across all todos in one view |
| AGGR-02 | User can filter aggregate list by bought status |
| AGGR-03 | User can filter aggregate list by todo or location |
| AGGR-04 | Bought status syncs between todo view and aggregate view |
| RDY-01 | Todo shows NOT ready if shopping items are not all bought |
| RDY-02 | Todo shows NOT ready if parent todos are not complete |
| RDY-03 | Todo shows READY when all shopping items bought AND all parent todos complete |
| RDY-04 | Todo with no shopping items and no parents shows READY |
| SOFT-02 | Shopping items use soft delete |
| SOFT-03 | Photos use soft delete |

**Success Criteria:**

1. Users can attach photos to todos (stored as WebP)
2. Parent-child dependencies work with cycle detection
3. Shopping items can be added to todos with all fields
4. Aggregate shopping list shows all items across todos
5. Ready-to-execute status correctly reflects shopping items bought AND parent todos complete
6. Bought status syncs in both views

---

## Phase Summary

| Phase | Name | Requirements | Success Criteria |
|-------|------|-------------|----------------|
| 1 | Foundation | 25 | 7 |
| 2 | Advanced Features | 23 | 6 |

**Total:** 2 phases | 48 requirements | 13 success criteria

---

*Roadmap created: 2026-04-28*
*Last updated: 2026-04-28 after initial creation*