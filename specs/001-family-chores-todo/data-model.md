# Data Model: Family Chores Todo App

## Entities

### User (FamilyMember)

Represents a family member who can log in and be assigned todos.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| username | String | Yes | Unique login identifier |
| password_hash | String | Yes | Bcrypt hashed password |
| name | String | Yes | Display name |
| created_at | DateTime | Yes | Creation timestamp |
| deleted_at | DateTime | No | Soft delete timestamp |
| version | Integer | Yes | Optimistic locking version |

**Relationships**:
- One User can be assigned to many Todos (many-to-many via TodoAssignee)
- One User can have many ShoppingItems they've marked as bought

---

### Todo

Represents a chore/task with all associated data.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| title | String | Yes | Task title |
| description | String | No | Task description |
| priority_id | UUID | No | Reference to Settings entry |
| location_id | UUID | No | Reference to Settings entry |
| parent_todo_id | UUID | No | Parent todo (blocker) |
| start_date | Date | No | When task begins |
| due_date | Date | No | Deadline |
| completion_date | Date | No | When marked complete |
| notes | Text | No | Detailed notes |
| created_at | DateTime | Yes | Creation timestamp |
| updated_at | DateTime | Yes | Last update timestamp |
| deleted_at | DateTime | No | Soft delete timestamp |
| version | Integer | Yes | Optimistic locking version |

**Relationships**:
- Many-to-many with User via TodoAssignee
- Many-to-one with self (parent_todo_id)
- One-to-many with Photo
- One-to-many with ShoppingItem

---

### TodoAssignee

Junction table for Todo-User many-to-many relationship.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| todo_id | UUID | Yes | Reference to Todo |
| user_id | UUID | Yes | Reference to User |

---

### Photo

Represents an image attached to a todo.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| todo_id | UUID | Yes | Reference to Todo |
| original_filename | String | Yes | Original upload filename |
| stored_filename | String | Yes | WebP filename on disk |
| file_path | String | Yes | Path to stored file |
| file_size_bytes | Integer | Yes | File size |
| created_at | DateTime | Yes | Upload timestamp |
| deleted_at | DateTime | No | Soft delete timestamp |
| version | Integer | Yes | Optimistic locking version |

**Constraints**:
- Max file size: 10MB per photo
- Format: WebP (converted from upload)

---

### ShoppingItem

Represents a shopping list item attached to a todo.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| todo_id | UUID | Yes | Reference to Todo |
| description | String | Yes | Item description |
| amount | String | No | Quantity needed |
| price | Decimal | No | Estimated cost |
| notes | String | No | Additional notes |
| is_bought | Boolean | Yes | Whether item has been purchased |
| bought_by_id | UUID | No | User who marked as bought |
| bought_at | DateTime | No | When marked bought |
| created_at | DateTime | Yes | Creation timestamp |
| deleted_at | DateTime | No | Soft delete timestamp |
| version | Integer | Yes | Optimistic locking version |

---

### Settings

Configurable lists for locations, priorities, and other options.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| category | String | Yes | "location", "priority", etc. |
| name | String | Yes | Display value |
| sort_order | Integer | No | Display ordering |
| created_at | DateTime | Yes | Creation timestamp |
| deleted_at | DateTime | No | Soft delete timestamp |
| version | Integer | Yes | Optimistic locking version |

**Note**: Family members are now stored in User table (not Settings), as they need authentication credentials.

---

## State Transitions

### Todo States

```
Draft → Active → In Progress → Completed
              ↓
            Blocked (by parent todo)
```

**Ready to Execute Logic**:
1. Has no uncompleted parent todos (parent_todo_id must be null OR parent is completed/deleted)
2. All shopping items are bought (is_bought = true for all ShoppingItems where deleted_at is null)

### Soft Delete

All entities have `deleted_at` timestamp. When set:
- Entity excluded from normal queries
- Still retained in database for audit/history
- Date range filtering uses deleted_at to show/hide deleted items

---

## Validation Rules

1. **Todo**: title required, max 200 chars; description max 5000 chars
2. **ShoppingItem**: description required, max 500 chars; price >= 0
3. **Photo**: max 10MB, convert to WebP, max 20 photos per todo
4. **User**: username unique, 3-50 chars; name 1-100 chars
5. **No circular parent dependencies**: Validate on todo create/update

---

## Query Patterns

### Ready to Execute Check

```sql
SELECT t.* 
FROM Todo t
WHERE t.deleted_at IS NULL
AND NOT EXISTS (
  SELECT 1 FROM Todo p 
  WHERE p.id = t.parent_todo_id 
  AND p.completion_date IS NULL 
  AND p.deleted_at IS NULL
)
AND NOT EXISTS (
  SELECT 1 FROM ShoppingItem si 
  WHERE si.todo_id = t.id 
  AND si.is_bought = false 
  AND si.deleted_at IS NULL
)
```

### Aggregate Shopping List

```sql
SELECT si.*, t.title as todo_title, t.location_id
FROM ShoppingItem si
JOIN Todo t ON t.id = si.todo_id
WHERE si.deleted_at IS NULL
AND t.deleted_at IS NULL
ORDER BY si.is_bought, t.due_date
```