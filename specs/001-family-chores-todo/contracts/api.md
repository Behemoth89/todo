# API Contracts

This document describes the REST API contracts exposed by the Family Chores Todo backend.

## Authentication

### POST /api/auth/login

Login with username and password.

**Request**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response** (200):
```json
{
  "token": "jwt-token-string",
  "user": {
    "id": "uuid",
    "username": "string",
    "name": "string"
  }
}
```

### POST /api/auth/logout

Logout current user.

**Response** (200):
```json
{
  "success": true
}
```

---

## Todos

### GET /api/todos

List todos with sorting and filtering.

**Query Parameters**:
- `sort_by`: title | priority | start_date | due_date | completion_date | created_at
- `sort_order`: asc | desc
- `filter_status`: active | completed | all (default: active)
- `filter_priority`: priority UUID
- `filter_assignee`: user UUID
- `filter_location`: location UUID
- `filter_ready`: true | false
- `date_from`: ISO date (filter by created_at)
- `date_to`: ISO date
- `page`: integer (default: 1)
- `limit`: integer (default: 20, max: 100)

**Response** (200):
```json
{
  "todos": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "priority": { "id": "uuid", "name": "string" },
      "location": { "id": "uuid", "name": "string" },
      "assignees": [{ "id": "uuid", "name": "string" }],
      "parent_todo": { "id": "uuid", "title": "string" },
      "start_date": "2026-04-27",
      "due_date": "2026-04-28",
      "completion_date": null,
      "notes": "string",
      "photos": [...],
      "shopping_items": [...],
      "is_ready_to_execute": true,
      "created_at": "2026-04-27T10:00:00Z",
      "updated_at": "2026-04-27T10:00:00Z",
      "version": 1
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### POST /api/todos

Create a new todo.

**Request**:
```json
{
  "title": "string (required, max 200)",
  "description": "string (max 5000)",
  "priority_id": "uuid",
  "location_id": "uuid",
  "parent_todo_id": "uuid",
  "assignee_ids": ["uuid"],
  "start_date": "2026-04-27",
  "due_date": "2026-04-28",
  "notes": "string",
  "version": 1
}
```

**Response** (201):
```json
{
  "todo": { ... },
  "conflict": false
}
```

**Conflict Response** (409):
```json
{
  "error": "conflict",
  "message": "The todo was modified by another user",
  "current_version": 2
}
```

### GET /api/todos/:id

Get todo by ID.

**Response** (200):
```json
{
  "todo": { ... }
}
```

### PUT /api/todos/:id

Update a todo (optimistic locking).

**Request**:
```json
{
  "title": "string",
  "description": "string",
  "priority_id": "uuid",
  "location_id": "uuid",
  "parent_todo_id": "uuid",
  "assignee_ids": ["uuid"],
  "start_date": "2026-04-27",
  "due_date": "2026-04-28",
  "notes": "string",
  "completion_date": "2026-04-27",
  "version": 1
}
```

**Response** (200):
```json
{
  "todo": { ... },
  "conflict": false
}
```

### DELETE /api/todos/:id

Soft delete a todo.

**Response** (200):
```json
{
  "success": true
}
```

---

## Photos

### POST /api/todos/:todoId/photos

Upload a photo to a todo.

**Request**: Multipart form data
- `file`: image file (max 10MB)
- `version`: integer (current todo version)

**Response** (201):
```json
{
  "photo": {
    "id": "uuid",
    "original_filename": "string",
    "stored_filename": "string",
    "file_size_bytes": 12345,
    "created_at": "2026-04-27T10:00:00Z"
  }
}
```

### DELETE /api/photos/:id

Soft delete a photo.

---

## Shopping Items

### GET /api/todos/:todoId/shopping-items

List shopping items for a todo.

### POST /api/todos/:todoId/shopping-items

Add shopping item to todo.

**Request**:
```json
{
  "description": "string (required)",
  "amount": "string",
  "price": 50.00,
  "notes": "string",
  "version": 1
}
```

### PUT /api/shopping-items/:id

Update shopping item.

**Request**:
```json
{
  "description": "string",
  "amount": "string",
  "price": 50.00,
  "notes": "string",
  "is_bought": true,
  "version": 1
}
```

### DELETE /api/shopping-items/:id

Soft delete shopping item.

---

## Aggregate Shopping List

### GET /api/shopping-list

Get all shopping items across all todos.

**Query Parameters**:
- `filter_bought`: true | false
- `filter_todo`: todo UUID
- `filter_location`: location UUID
- `page`: integer
- `limit`: integer (default: 50, max: 100)

**Response** (200):
```json
{
  "items": [
    {
      "id": "uuid",
      "description": "string",
      "amount": "string",
      "price": 50.00,
      "notes": "string",
      "is_bought": false,
      "todo": {
        "id": "uuid",
        "title": "string",
        "location": { "id": "uuid", "name": "string" }
      },
      "bought_by": { "id": "uuid", "name": "string" },
      "bought_at": "2026-04-27T10:00:00Z"
    }
  ],
  "total": 50,
  "page": 1
}
```

---

## Settings

### GET /api/settings

Get all settings grouped by category.

**Response** (200):
```json
{
  "locations": [
    { "id": "uuid", "name": "string", "sort_order": 1 }
  ],
  "priorities": [
    { "id": "uuid", "name": "string", "sort_order": 1 }
  ]
}
```

### POST /api/settings

Create a new settings entry.

**Request**:
```json
{
  "category": "location | priority",
  "name": "string",
  "sort_order": 1
}
```

### PUT /api/settings/:id

Update a settings entry.

### DELETE /api/settings/:id

Soft delete a settings entry.

---

## Users (Family Members)

### GET /api/users

List family members (users).

### POST /api/users

Create a new family member.

**Request**:
```json
{
  "username": "string (unique)",
  "password": "string",
  "name": "string"
}
```

### PUT /api/users/:id

Update user details.

### DELETE /api/users/:id

Soft delete a user.