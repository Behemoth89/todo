# Tasks: Family Chores Todo App

**Input**: Design documents from `/specs/001-family-chores-todo/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api.md, research.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US8)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create backend project structure in backend/src/
- [ ] T002 Create frontend project structure in frontend/src/
- [ ] T003 [P] Initialize Python/FastAPI project with dependencies in backend/pyproject.toml
- [ ] T004 [P] Initialize React project with Vite and dependencies in frontend/package.json
- [ ] T005 [P] Configure TypeScript for frontend in frontend/tsconfig.json
- [ ] T006 [P] Configure Python environment for backend with FastAPI dependencies
- [ ] T007 [P] Configure linting (ESLint for frontend, Ruff for backend)
- [ ] T008 [P] Configure environment variables in backend/.env and frontend/.env

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T009 Setup Prisma schema in backend/prisma/schema.prisma with all entities
- [ ] T010 Initialize SQLite database with Prisma migrations
- [ ] T011 [P] Implement JWT authentication middleware in backend/src/middleware/auth.py
- [ ] T012 [P] Setup FastAPI app structure in backend/src/main.py
- [ ] T013 [P] Create API route structure in backend/src/api/
- [ ] T014 Create error handling and logging infrastructure in backend/src/utils/errors.py
- [ ] T015 Setup environment configuration management in backend/src/utils/config.py
- [ ] T016 [P] Create React app structure and routing in frontend/src/App.tsx
- [ ] T017 [P] Implement API client service in frontend/src/services/api.ts
- [ ] T018 Create auth context and hooks in frontend/src/hooks/useAuth.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Create and Manage Family Chore Todos (Priority: P1)

**Goal**: Core todo CRUD with all fields (title, priority, location, dates, notes, soft delete)

**Independent Test**: Create a todo with all fields, verify persistence and display; update fields, verify changes; soft-delete, verify hidden but retained; filter by date range

### Implementation for User Story 1

- [ ] T019 [P] [US1] Create User model and CRUD service in backend/src/models/user.py
- [ ] T020 [P] [US1] Create Todo model and CRUD service in backend/src/models/todo.py
- [ ] T021 [P] [US1] Create Settings model for locations/priorities in backend/src/models/settings.py
- [ ] T022 [US1] Implement GET /api/todos endpoint in backend/src/api/todos.py
- [ ] T023 [US1] Implement POST /api/todos endpoint in backend/src/api/todos.py
- [ ] T024 [US1] Implement GET /api/todos/:id endpoint in backend/src/api/todos.py
- [ ] T025 [US1] Implement PUT /api/todos/:id endpoint with optimistic locking in backend/src/api/todos.py
- [ ] T026 [US1] Implement DELETE /api/todos/:id endpoint for soft delete in backend/src/api/todos.py
- [ ] T027 [US1] Implement GET /api/settings endpoint in backend/src/api/settings.py
- [ ] T028 [US1] Implement TodoList React component in frontend/src/components/TodoList.tsx
- [ ] T029 [US1] Implement TodoForm React component in frontend/src/components/TodoForm.tsx
- [ ] T030 [US1] Implement TodoCard React component in frontend/src/components/TodoCard.tsx
- [ ] T031 [US1] Add sorting and filtering support in backend/src/services/todo_service.py
- [ ] T032 [US1] Add date range filtering logic in frontend/src/pages/TodoPage.tsx

**Checkpoint**: User Story 1 fully functional and testable independently

---

## Phase 4: User Story 2 - Assign Todos to Family Members (Priority: P1)

**Goal**: Assign todos to one or more family members, view assigned todos

**Independent Test**: Assign todo to multiple users, verify all can see it in their views; view todo details, verify all assignees listed

### Implementation for User Story 2

- [ ] T033 [P] [US2] Create TodoAssignee junction model in backend/prisma/schema.prisma
- [ ] T034 [US2] Implement assignee management in backend/src/services/todo_service.py
- [ ] T035 [US2] Extend GET /api/todos with assignee filtering in backend/src/api/todos.py
- [ ] T036 [US2] Implement POST /api/users endpoint in backend/src/api/users.py
- [ ] T037 [US2] Implement GET /api/users endpoint in backend/src/api/users.py
- [ ] T038 [US2] Implement AssigneeSelector React component in frontend/src/components/AssigneeSelector.tsx
- [ ] T039 [US2] Add assignee display to TodoCard in frontend/src/components/TodoCard.tsx
- [ ] T040 [US2] Add "My Assigned Todos" view in frontend/src/pages/MyTodosPage.tsx
- [ ] T041 [US2] Implement POST /api/auth/login endpoint in backend/src/api/auth.py
- [ ] T042 [US2] Implement user dropdown in todo form in frontend/src/components/TodoForm.tsx

**Checkpoint**: User Stories 1 AND 2 both work independently

---

## Phase 5: User Story 5 - Shopping List Items on Todos (Priority: P1)

**Goal**: Add shopping items to todos with description, amount, price, notes; mark as bought

**Independent Test**: Add shopping item to todo, verify persistence; view todo, verify items listed; mark item bought, verify shows as bought but visible

### Implementation for User Story 5

- [ ] T043 [P] [US5] Create ShoppingItem model in backend/prisma/schema.prisma
- [ ] T044 [P] [US5] Create ShoppingItem service in backend/src/services/shopping_service.py
- [ ] T045 [US5] Implement GET /api/todos/:todoId/shopping-items in backend/src/api/shopping_items.py
- [ ] T046 [US5] Implement POST /api/todos/:todoId/shopping-items in backend/src/api/shopping_items.py
- [ ] T047 [US5] Implement PUT /api/shopping-items/:id in backend/src/api/shopping_items.py
- [ ] T048 [US5] Implement DELETE /api/shopping-items/:id for soft delete in backend/src/api/shopping_items.py
- [ ] T049 [US5] Implement ShoppingItemList React component in frontend/src/components/ShoppingItemList.tsx
- [ ] T050 [US5] Implement ShoppingItemForm React component in frontend/src/components/ShoppingItemForm.tsx
- [ ] T051 [US5] Add shopping items section to TodoDetail view in frontend/src/pages/TodoDetailPage.tsx

**Checkpoint**: Shopping items on todos fully functional

---

## Phase 6: User Story 6 - Aggregate Shopping List View (Priority: P1)

**Goal**: View all shopping items across all todos in one consolidated list

**Independent Test**: Add shopping items to multiple todos, verify all appear in aggregate view; mark item bought, verify status shown; filter by bought status, todo, location

### Implementation for User Story 6

- [ ] T052 [US6] Implement GET /api/shopping-list endpoint in backend/src/api/shopping_list.py
- [ ] T053 [US6] Add filtering to shopping list (bought, todo, location) in backend/src/services/shopping_service.py
- [ ] T054 [US6] Add pagination to aggregate shopping list in backend/src/api/shopping_list.py
- [ ] T055 [US6] Implement AggregateShoppingList React page in frontend/src/pages/ShoppingListPage.tsx
- [ ] T056 [US6] Add shopping list filters in frontend/src/components/ShoppingListFilters.tsx
- [ ] T057 [US6] Add "Mark as Bought" quick action in frontend/src/components/ShoppingItemRow.tsx

**Checkpoint**: Aggregate shopping list fully functional

---

## Phase 7: User Story 7 - Ready to Execute Status (Priority: P1)

**Goal**: Automatic "ready to execute" calculation based on shopping items bought and parent todos complete

**Independent Test**: Create todo with unbought items, verify NOT ready; mark all items bought, verify still NOT ready (incomplete parent); mark parent complete, verify READY; todo with no items/parents should be READY immediately

### Implementation for User Story 7

- [ ] T058 [US7] Implement is_ready_to_execute calculation in backend/src/services/todo_service.py
- [ ] T059 [US7] Add ready status to all todo list responses in backend/src/api/todos.py
- [ ] T060 [US7] Implement ready status indicator in frontend/src/components/TodoCard.tsx
- [ ] T061 [US7] Add ready filter to todo list in frontend/src/components/TodoFilters.tsx
- [ ] T062 [US7] Add "Ready to Execute" quick filter button in frontend/src/pages/TodoPage.tsx

**Checkpoint**: Ready to execute status fully functional for all todos

---

## Phase 8: User Story 4 - Parent Todo Blockers (Priority: P2)

**Goal**: Define parent-child todo dependencies; child cannot start until parent is complete

**Independent Test**: Create dependent todo, verify blocker shown; parent incomplete, verify child NOT ready; parent complete, verify child ready

### Implementation for User Story 4

- [ ] T063 [P] [US4] Add parent_todo_id field to Todo model in backend/prisma/schema.prisma
- [ ] T064 [P] [US4] Update Todo service with parent relationship handling in backend/src/services/todo_service.py
- [ ] T065 [US4] Add cycle detection for parent-child in backend/src/services/todo_service.py
- [ ] T066 [US4] Update todo CRUD to handle parent_todo_id in backend/src/api/todos.py
- [ ] T067 [US4] Add parent selector in TodoForm in frontend/src/components/TodoForm.tsx
- [ ] T068 [US4] Display parent blocker in TodoCard in frontend/src/components/TodoCard.tsx
- [ ] T069 [US4] Display child todos in TodoDetail view in frontend/src/pages/TodoDetailPage.tsx

**Checkpoint**: Parent-child dependencies fully functional

---

## Phase 9: User Story 3 - Add Photos to Todos (Priority: P2)

**Goal**: Attach multiple photos to todos, max 10MB each, convert to WebP

**Independent Test**: Upload photo to todo, verify stored and displayed; upload multiple photos, verify gallery view

### Implementation for User Story 3

- [ ] T070 [P] [US3] Create Photo model in backend/prisma/schema.prisma
- [ ] T071 [P] [US3] Create photo service with Sharp WebP conversion in backend/src/services/photo_service.py
- [ ] T072 [US3] Implement POST /api/todos/:todoId/photos upload endpoint in backend/src/api/photos.py
- [ ] T073 [US3] Implement DELETE /api/photos/:id endpoint for soft delete in backend/src/api/photos.py
- [ ] T074 [US3] Add file size validation (10MB) and format validation in backend/src/utils/validators.py
- [ ] T075 [US3] Implement PhotoUpload React component in frontend/src/components/PhotoUpload.tsx
- [ ] T076 [US3] Implement PhotoGallery React component in frontend/src/components/PhotoGallery.tsx
- [ ] T077 [US3] Add photo section to TodoDetail view in frontend/src/pages/TodoDetailPage.tsx

**Checkpoint**: Photo attachments fully functional

---

## Phase 10: User Story 8 - Configurable Lists in Settings (Priority: P2)

**Goal**: Configure locations, priorities, family members in settings without code changes

**Independent Test**: Add new location in settings, verify appears in location dropdown; modify priorities, verify reflect in forms

### Implementation for User Story 8

- [ ] T078 [P] [US8] Create Settings endpoints (POST, PUT, DELETE) in backend/src/api/settings.py
- [ ] T079 [US8] Implement settings validation (no duplicates, soft delete) in backend/src/services/settings_service.py
- [ ] T080 [US8] Implement SettingsPage React component in frontend/src/pages/SettingsPage.tsx
- [ ] T081 [US8] Add dynamic dropdown components using settings data in frontend/src/components/SettingsDropdown.tsx
- [ ] T082 [US8] Implement SettingsForm for locations and priorities in frontend/src/components/SettingsForm.tsx

**Checkpoint**: Configurable lists fully functional

---

## Phase 11: User Story 2 Enhancement - User Authentication (Priority: P1)

**Goal**: Full authentication with login/logout, protected routes

**Independent Test**: Login with credentials, verify token; access protected routes, verify unauthorized without token; logout, verify token cleared

### Implementation for User Story 2 Enhancement

- [ ] T083 [P] [US2] Implement JWT token generation with expiration in backend/src/utils/auth.py
- [ ] T084 [P] [US2] Create auth middleware for protected routes in backend/src/middleware/auth.py
- [ ] T085 [US2] Implement POST /api/auth/logout endpoint in backend/src/api/auth.py
- [ ] T086 [US2] Implement auth guard for protected routes in frontend/src/hooks/useAuth.tsx
- [ ] T087 [US2] Add login form in frontend/src/components/LoginForm.tsx
- [ ] T088 [US2] Implement protected route wrapper in frontend/src/components/ProtectedRoute.tsx
- [ ] T089 [US2] Add user menu with logout in frontend/src/components/UserMenu.tsx

**Checkpoint**: Full authentication working

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T090 [P] Create seed data script with sample users and locations in backend/prisma/seed.py
- [ ] T091 [P] Add optimistic locking conflict handling in frontend/src/services/api.ts
- [ ] T092 [P] Add loading states and error handling in React components
- [ ] T093 [P] Mobile responsive styling for all pages in frontend/src/styles/
- [ ] T094 Add pagination to todo list (20 per page default) in backend/src/api/todos.py
- [ ] T095 Performance optimization: add database indexes for frequently queried fields in backend/prisma/schema.prisma
- [ ] T096 Run and validate quickstart.md scenarios
- [ ] T097 Create database backup and restore scripts in backend/scripts/
- [ ] T098 Update README with deployment instructions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed in parallel if staffed, or sequentially by priority
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Core todo CRUD - foundation for all other stories
- **US2 (P1)**: Assignment - depends on US1 (needs todo model)
- **US5 (P1)**: Shopping items - depends on US1 (needs todo model)
- **US6 (P1)**: Aggregate shopping - depends on US5 (needs shopping items)
- **US7 (P1)**: Ready status - depends on US5 (shopping) and US4 (parents) when implemented
- **US4 (P2)**: Parent blockers - depends on US1 (needs todo model)
- **US3 (P2)**: Photos - depends on US1 (needs todo model)
- **US8 (P2)**: Settings - independent, can be implemented anytime after US1

### Within Each User Story

- Models before services
- Services before endpoints
- Endpoints before React components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all P1 stories (US1, US2, US5) can start in parallel
- Within each story, all [P] tasks can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: P1 MVP Stories

```bash
# Launch all P1 stories together (after Phase 2 complete):
Task: "Implement User Story 1 - Todo CRUD"
Task: "Implement User Story 2 - Assignment"
Task: "Implement User Story 5 - Shopping Items"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 + US2 + US5 + US6 + US7 (P1 stories) → Test → Deploy (MVP!)
3. Add US4 + US3 + US8 (P2 stories) → Test → Deploy
4. Polish → Final release

### Parallel Team Strategy

With multiple developers:

1. Complete Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 + 7 (todo core + ready status)
   - Developer B: User Story 2 + 6 (assignment + aggregate shopping)
   - Developer C: User Story 5 + 8 (shopping items + settings)
3. P2 stories can be added by any available developer

---

## Task Summary

| Phase | Description | Tasks |
|-------|-------------|-------|
| Phase 1 | Setup | T001-T008 (8 tasks) |
| Phase 2 | Foundational | T009-T018 (10 tasks) |
| Phase 3 | US1: Create/Manage Todos | T019-T032 (14 tasks) |
| Phase 4 | US2: Assign Todos | T033-T042 (10 tasks) |
| Phase 5 | US5: Shopping Items | T043-T051 (9 tasks) |
| Phase 6 | US6: Aggregate Shopping | T052-T057 (6 tasks) |
| Phase 7 | US7: Ready Status | T058-T062 (5 tasks) |
| Phase 8 | US4: Parent Blockers | T063-T069 (7 tasks) |
| Phase 9 | US3: Photos | T070-T077 (8 tasks) |
| Phase 10 | US8: Settings | T078-T082 (5 tasks) |
| Phase 11 | Auth Enhancement | T083-T089 (7 tasks) |
| Phase 12 | Polish | T090-T098 (9 tasks) |

**Total**: 98 tasks

### Tasks per User Story

| Story | Priority | Tasks | Core Deliverable |
|-------|----------|-------|------------------|
| US1 | P1 | T019-T032 | Todo CRUD with all fields |
| US2 | P1 | T033-T042, T083-T089 | Assignment + Auth |
| US5 | P1 | T043-T051 | Shopping items on todos |
| US6 | P1 | T052-T057 | Aggregate shopping list |
| US7 | P1 | T058-T062 | Ready to execute status |
| US4 | P2 | T063-T069 | Parent-child blockers |
| US3 | P2 | T070-T077 | Photo attachments |
| US8 | P2 | T078-T082 | Configurable settings |

### Suggested MVP Scope

**Phase 1 + Phase 2 + Phase 3 = MVP** (28 tasks)

Core delivery: Todo creation and management with all fields. Deploy immediately after testing.

### Parallel Opportunities Identified

- Setup phase: 4 parallel tasks (T003, T004, T005, T006, T007, T008)
- Foundational phase: 4 parallel tasks (T011, T012, T013, T016, T017)
- Each user story phase: multiple [P] tasks can run in parallel
- P1 stories (US1, US2, US5) can run in parallel after Phase 2