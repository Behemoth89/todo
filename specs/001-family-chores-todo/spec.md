# Feature Specification: Family Chores Todo App

**Feature Branch**: `001-family-chores-todo`  
**Created**: 2026-04-27  
**Status**: Draft  
**Input**: User description: "I want to build a to-do app to manage my familys chores. i want to prioritise and assign todo to one or many family members. i want to be able to mark an object to todo, for example living room or yard. i want to be able to add photos to todos. todo can have parent todo that is blocker, for example i can not paint a wall before i have built a wall. i want to add shopping list items to todo. shopping list has to be visible and manageable separetely also, so i can see my full shopping list over all todo-s. shopping list item has to have at least description, ammount, price and notes fields. i need to be able to mark item bought, it still should show at todos that it has been bought. i want to distinguish todos that are ready to be executed, meaning all items have been bought and all parent tasks have been done. todos need to have notes section, some bigger things need more detailed plan to be memorised. i need to have start, due and completion date. soft delete all around, use dates to determine when and what to show. all lists should be configurable in settings, no enums."

## Clarifications

### Session 2026-04-27

- Q: Authentication model → A: Each family member has individual login (authentication required)
- Q: User vs FamilyMember relationship → A: User = FamilyMember (one entity, authenticated users are family members who can be assigned todos)
- Q: Photo upload limits and storage → A: Maximum file size 10MB per photo, convert to optimized WebP for storage
- Q: Platform/application type → A: Single Page Application (SPA) with API backend
- Q: Concurrent edit handling → A: Full concurrent edit support with optimistic locking (last-write-wins with user notification)
- Q: Mobile access approach → A: Pure responsive web (mobile browser only, no offline)
- Q: Todo sorting and filtering → A: Todos MUST be sortable and filterable by all fields except descriptions (title, priority, assignees, location, dates, status, ready-to-execute)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Manage Family Chore Todos (Priority: P1)

As a family member, I want to create, edit, and manage chore todos so that I can organize household tasks.

**Why this priority**: Core functionality - without todo creation and management, nothing else matters.

**Independent Test**: Can be tested by creating a todo with all fields (title, description, priority, assignee, location, dates, notes) and verifying it persists and displays correctly.

**Acceptance Scenarios**:

1. **Given** no todos exist, **When** I create a new todo with title "Clean kitchen", priority "high", assignee "Mom", location "Kitchen", start date "today", due date "tomorrow", **Then** the todo appears in the todo list with all fields correctly stored.

2. **Given** a todo exists, **When** I update its priority, assignee, location, or dates, **Then** the changes are persisted and reflected in the display.

3. **Given** a todo exists, **When** I soft-delete it, **Then** it is hidden from active views but retained in the system with deletion timestamp.

4. **Given** todos with various deleted timestamps, **When** I view the todo list with date filters, **Then** only todos within the selected date range are shown.

---

### User Story 2 - Assign Todos to Family Members (Priority: P1)

As a logged-in family member, I want to see todos assigned to me and assign todos to other family members so that responsibilities are clear.

**Why this priority**: Core requirement - the app exists to assign tasks to family members with individual authentication.

**Independent Test**: Can be tested by assigning a todo to multiple family members and verifying all assigned members can see the todo in their view.

**Acceptance Scenarios**:

1. **Given** family members "Mom", "Dad", "Kids" exist, **When** I assign a todo to "Mom" and "Dad", **Then** both Mom and Dad see the todo in their assigned views.

2. **Given** a todo is assigned to multiple members, **When** I view the todo details, **Then** all assignees are listed.

---

### User Story 3 - Add Photos to Todos (Priority: P2)

As a user, I want to attach photos to todos so I can see visual references for chores.

**Why this priority**: Adds visual context - helpful for complex tasks like "organize the garage" where seeing the current state helps.

**Independent Test**: Can be tested by uploading a photo to a todo and verifying it displays with the todo.

**Acceptance Scenarios**:

1. **Given** a todo exists, **When** I attach a photo to it, **Then** the photo is stored and visible when viewing the todo details.

2. **Given** a todo has multiple photos, **When** I view the todo, **Then** all photos are displayed in a gallery or list.

---

### User Story 4 - Parent Todo Blockers (Priority: P2)

As a user, I want to define parent-child todo dependencies so that I cannot start a task until its prerequisites are complete.

**Why this priority**: Enables task sequencing - essential for project-style chores like "build wall" then "paint wall".

**Independent Test**: Can be tested by creating a dependent todo and verifying the "ready to execute" status reflects parent completion.

**Acceptance Scenarios**:

1. **Given** todo "Build wall" exists, **When** I create todo "Paint wall" with parent "Build wall", **Then** "Paint wall" shows "Build wall" as a blocker.

2. **Given** "Paint wall" has parent "Build wall" which is not complete, **When** I check if "Paint wall" is ready to execute, **Then** it is marked as NOT ready because parent is incomplete.

3. **Given** "Paint wall" has parent "Build wall" which is marked complete, **When** I check if "Paint wall" is ready to execute, **Then** parent dependency is satisfied.

---

### User Story 5 - Shopping List Items on Todos (Priority: P1)

As a user, I want to add shopping items to todos so I can track what materials are needed for each chore.

**Why this priority**: Core requirement - user explicitly wants shopping items linked to todos.

**Independent Test**: Can be tested by adding shopping items (description, amount, price, notes) to a todo and verifying they persist.

**Acceptance Scenarios**:

1. **Given** a todo exists, **When** I add a shopping item with description "Paint", amount "2 gallons", price "$50", notes "Eggshell white", **Then** the shopping item is attached to the todo.

2. **Given** a todo has shopping items, **When** I view the todo details, **Then** all shopping items are listed with their fields.

3. **Given** a shopping item is marked as bought, **When** I view the todo, **Then** the item shows as bought but remains visible.

---

### User Story 6 - Aggregate Shopping List View (Priority: P1)

As a user, I want to see all shopping items across all todos in one view so I can plan my shopping trip.

**Why this priority**: Core requirement - user wants a consolidated shopping list separate from individual todos.

**Independent Test**: Can be tested by adding shopping items to multiple todos and verifying they all appear in the aggregate shopping list view.

**Acceptance Scenarios**:

1. **Given** todo A has shopping item "Paint" and todo B has shopping item "Nails", **When** I view the aggregate shopping list, **Then** both items appear in the list.

2. **Given** a shopping item is marked bought on one todo, **When** I view the aggregate shopping list, **Then** the item shows as bought status.

3. **Given** items across multiple todos, **When** I view aggregate list with filters, **Then** I can filter by bought status, todo, or location.

---

### User Story 7 - Ready to Execute Status (Priority: P1)

As a user, I want to quickly identify which todos are ready to be executed so I know what can be done now.

**Why this priority**: Core requirement - user wants to distinguish actionable todos.

**Independent Test**: Can be tested by creating todos with shopping items and parent dependencies, then verifying ready status updates appropriately.

**Acceptance Scenarios**:

1. **Given** a todo has shopping items that are NOT all bought, **When** I check if todo is ready to execute, **Then** it shows as NOT ready.

2. **Given** a todo has all shopping items bought but has incomplete parent todos, **When** I check if todo is ready to execute, **Then** it shows as NOT ready.

3. **Given** a todo has all shopping items bought AND all parent todos complete, **When** I check if todo is ready to execute, **Then** it shows as READY.

4. **Given** a todo has no shopping items and no parent todos, **When** I check if todo is ready to execute, **Then** it shows as READY.

---

### User Story 8 - Configurable Lists in Settings (Priority: P2)

As a user, I want to configure lists like family members, locations, and priorities in settings so the app adapts to my needs.

**Why this priority**: Core requirement - user explicitly wants configurable lists with no enums.

**Independent Test**: Can be tested by adding/modifying settings entries and verifying they appear in dropdowns.

**Acceptance Scenarios**:

1. **Given** settings allow configuring family members, **When** I add "Grandma" to family members list, **Then** "Grandma" appears in assignee dropdowns.

2. **Given** settings allow configuring locations, **When** I add "Basement" to locations list, **Then** "Basement" appears in location dropdowns.

3. **Given** settings allow configuring priorities, **When** I modify priority list, **Then** the changes reflect in todo creation/editing.

---

### Edge Cases

- What happens when all family members are unassigned from a todo? (Allow unassigned todos)
- What happens when a parent todo is soft-deleted? (Child todos should still reference it, mark as "parent deleted")
- What happens when a shopping item is deleted? (Soft delete, show as removed from active lists)
- How does the system handle circular parent dependencies? (Prevent creation of circular references)
- What happens when there are 100+ shopping items? (Pagination in aggregate view)
- What happens when a todo has 10+ photos? (Gallery view with pagination)
- What happens when due date passes? (Show as overdue but still visible)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating todos with title, description, priority, assignees, location, start date, due date, and notes.
- **FR-002**: System MUST allow assigning one or more family members to a todo.
- **FR-003**: System MUST allow marking a location/object (e.g., living room, yard) on each todo.
- **FR-004**: System MUST allow attaching multiple photos to each todo, with maximum file size 10MB per photo, converted to optimized WebP for storage.
- **FR-005**: System MUST allow defining parent todo as a blocker - a todo cannot start until parent is complete.
- **FR-006**: System MUST support multiple levels of parent-child dependencies (grandparent tasks).
- **FR-007**: System MUST allow adding shopping list items to each todo with description, amount, price, and notes fields.
- **FR-008**: System MUST allow marking shopping items as bought while retaining visibility on the todo.
- **FR-009**: System MUST provide a separate aggregate shopping list view showing all items across all todos.
- **FR-010**: System MUST calculate and display "ready to execute" status for each todo based on: all shopping items bought AND all parent todos complete.
- **FR-011**: System MUST support soft delete on all entities (todos, shopping items, photos, family members, locations).
- **FR-012**: System MUST use date fields (created, deleted, effective dates) to determine what to show in lists.
- **FR-013**: System MUST allow configuring family members, locations, and priorities in settings (no hardcoded enums).
- **FR-014**: System MUST store completion date when a todo is marked complete.
- **FR-016**: System MUST support user authentication (login/logout) for each family member.
- **FR-017**: System MUST allow users to view todos assigned to them specifically.
- **FR-018**: System MUST handle concurrent edits with optimistic locking, notifying users when their changes overwrite others'.
- **FR-019**: System MUST support sorting todos by all fields (title, priority, assignees, location, start date, due date, completion date, status, ready-to-execute).
- **FR-020**: System MUST support filtering todos by all fields except descriptions (title, priority, assignees, location, start date, due date, completion date, status, ready-to-execute).

### Key Entities *(include if feature involves data)*

- **User**: Represents a family member who can log in, be assigned todos, and manage the app. Has authentication credentials (username/password), name, and soft delete timestamp. Same entity as FamilyMember - authenticated users are family members who can be assigned todos.
- **Todo**: Represents a chore/task with title, description, priority, assignees, location, dates (start, due, completion), notes, photos, shopping items, parent blocker reference.
- **Location**: Represents an object/room (e.g., living room, yard), has name and soft delete timestamp.
- **Photo**: Represents an image attached to a todo, stored with reference to todo.
- **ShoppingItem**: Represents a shopping list item attached to a todo, has description, amount, price, notes, bought status.
- **Settings**: Configurable lists for locations and priorities - each entry has name and soft delete. (Family members are now Users with auth).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a todo with all fields (priority, assignees, location, dates, notes) in under 2 minutes.
- **SC-002**: Aggregate shopping list displays all items from all todos with correct bought status within 1 second.
- **SC-003**: "Ready to execute" status accurately reflects shopping item completion and parent todo completion for 100% of todos.
- **SC-004**: Date-based filtering correctly shows/hides soft-deleted items based on selected date ranges.
- **SC-005**: Settings modifications (adding family members, locations, priorities) are immediately available in dropdowns.
- **SC-006**: All configuration lists (family members, locations, priorities) can be modified without code changes.
- **SC-007**: Todo list supports sorting and filtering on all applicable fields with response time under 500ms.

## Assumptions

- Each family member has their own login credentials.
- Users can view todos assigned to them specifically after login.
- Photos are stored locally or in cloud storage (actual storage mechanism to be determined during implementation).
- Photos are stored locally or in cloud storage (actual storage mechanism to be determined during implementation).
- Date handling follows standard calendar dates with timezone consideration.
- The system will be a Single Page Application (SPA) with API backend - pure responsive web, optimized for mobile browsers.
- Initial data will be seeded with sample users and locations for demonstration.
- Initial data will be seeded with sample family members and locations for demonstration.