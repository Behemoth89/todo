# Phase 2: Advanced Features - Research

**Researched:** 2026-04-28
**Status:** Complete

## Domain Overview

Phase 2 adds five major feature areas to the Foundation:
1. Photo attachments with WebP conversion
2. Parent-child todo dependencies with cycle detection
3. Shopping items linked to todos
4. Aggregate shopping list view
5. Ready-to-execute status calculation

---

## Photo Attachments

### Requirement Summary

- PHOTO-01: Attach multiple photos (max 10MB each, stored as WebP)
- PHOTO-02: View photos attached to a todo
- PHOTO-03: Remove photos from a todo
- PHOTO-04: Photo thumbnails in todo list
- SOFT-03: Photos use soft delete

### Implementation Approach

**Storage Decision (per D-01):** Database BLOB storage
- Store full image and thumbnail as binary in the database
- Prisma `Bytes` type for binary data
- Per-file size limit enforced at API level before conversion

**WebP Conversion (per D-02):**
- Use `sharp` library for Node.js image processing
- Convert uploaded images to WebP on the server
- Quality: 80% for full images, 60% for thumbnails
- Max dimensions: Full 2048x2048, Thumbnail 150x150

**Thumbnail Generation (per D-03):**
- Generate 150x150 thumbnail during upload pipeline
- Store thumbnail as separate Bytes field in Photo model
- Thumbnail displayed in list views, full image on detail view

**API Endpoints Needed:**
- `POST /api/todos/[id]/photos` - Add photo(s)
- `GET /api/todos/[id]/photos` - List photos
- `DELETE /api/todos/[id]/photos/[photoId]` - Remove photo
- `GET /api/photos/[photoId]` - Serve photo (with ?thumbnail query)

### Dependencies

- `sharp` - Image processing library
- Next.js API routes for upload handling
- Prisma schema update for Photo model

---

## Parent Dependencies

### Requirement Summary

- DEPN-01: Define a parent todo as a blocker
- DEPN-02: Prevent circular parent dependencies
- DEPN-03: Child shows parent incomplete until parent done

### Implementation Approach

**Data Model:**
- Self-referential relation on Todo model: `parentId` optional field
- Each todo can have one parent (not multiple)
- Multiple children can reference the same parent

**Cycle Detection (per D-06):**
- Algorithm: DFS traversal from potential parent
- If the potential child appears in the ancestor chain of the parent, it's a cycle
- Validate on create/update of parentId
- Return 400 error if cycle detected

```typescript
// Cycle detection pseudocode
async function detectCycle(todoId: string, newParentId: string): Promise<boolean> {
  let current = await prisma.todo.findUnique({ where: { id: newParentId } });
  
  while (current && current.parentId) {
    if (current.parentId === todoId) return true; // Cycle found
    current = await prisma.todo.findUnique({ where: { id: current.parentId } });
  }
  
  return false;
}
```

**Completion Status Propagation:**
- When a parent is marked complete, check all children
- If any child has this parent as blocker and is incomplete, flag it
- Use database query to find affected children and update cache/status

### API Endpoints Needed

- `PUT /api/todos/[id]` - Update includes parentId field
- Cycle detection happens on the PUT operation

### Edge Cases

- Deleting a parent: Children become unblocked (parentId set to null)
- Moving a child to a new parent: Validate cycle against new parent chain

---

## Shopping Items

### Requirement Summary

- SHOP-01: Add shopping items (description, amount, price, notes)
- SHOP-02: Edit shopping items
- SHOP-03: Mark as bought (remains visible)
- SHOP-04: Soft-delete shopping items
- SOFT-02: Shopping items use soft delete

### Implementation Approach

**Data Model (per D-07):**
- Separate `ShoppingItem` table with foreign key to Todo
- Fields: id, todoId, description, amount, price, notes, boughtAt, createdAt, updatedAt, deletedAt
- boughtAt null = not bought, timestamp = bought

**API Endpoints (per D-08 - separate endpoint):**

- `GET /api/shopping-items` - Aggregate list (AGGR requirements)
  - Query params: ?bought={true/false}, ?todoId=xxx, ?locationId=xxx
- `POST /api/todos/[id]/shopping-items` - Add to specific todo
- `PUT /api/shopping-items/[id]` - Edit item
- `DELETE /api/shopping-items/[id]` - Soft delete

**Display Integration:**
- Shopping items display in todo detail view
- Aggregate view shows across all todos (AGGR requirements)

---

## Aggregate Shopping List

### Requirement Summary

- AGGR-01: View all shopping items across all todos in one view
- AGGR-02: Filter by bought status
- AGGR-03: Filter by todo or location
- AGGR-04: Bought status syncs between views

### Implementation Approach

**Separate Endpoint (per D-08):**
- `GET /api/shopping-items` - Returns all items for user
- Query parameters for filtering:
  - `?bought=true` - Only bought items
  - `?bought=false` - Only unbought items
  - `?todoId=xxx` - Items for specific todo
  - `?locationId=xxx` - Items for todos at location
- Include todo title and location name for context

**Sync (per D-10):**
- Single source of truth in database
- Frontend updates both views when status changes
- The same ShoppingItem record appears in both contexts

---

## Ready-to-Execute Status

### Requirement Summary

- RDY-01: NOT ready if shopping items not all bought
- RDY-02: NOT ready if parent todos not complete
- RDY-03: READY when all shopping items bought AND all parents complete
- RDY-04: No shopping items and no parents = READY

### Implementation Approach

**Stored + Event-Driven (per D-09):**

**Data Model:**
- `readyToExecute` Boolean field on Todo
- Calculated and stored, not computed on read
- Event-driven recalculation

**Calculation Logic:**

```
readyToExecute = (
  shoppingItems.length === 0 OR shoppingItems.every(bought === true)
) AND (
  parentTodos.length === 0 OR parentTodos.every(completedAt !== null)
)
)
```

**Events That Trigger Recalculation:**

1. Shopping item bought status changes → recalculate that todo
2. Parent todo completion status changes → recalculate dependent todos
3. Shopping item added/removed → recalculate todo
4. Parent relationship added/removed → recalculate todo

**Implementation:**
- Create utility function: `calculateReadyToExecute(todoId)`
- Call after each relevant mutation
- Store result in readyToExecute field

### API Updates Needed

- Update existing `POST /api/todos/[id]/complete` to calculate ready status
- Update shopping item mutations to trigger recalculation
- Update parent relationship mutations to trigger recalculation
- Return readyToExecute in todo list and detail responses

---

## Schema Changes Summary

### New Models

```prisma
model Photo {
  id          String   @id @default(cuid())
  todoId      String   @map("todo_id")
  data        Bytes    // Full image WebP
  thumbnail  Bytes    // 150x150 thumbnail
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  deletedAt   DateTime? @map("deleted_at")

  todo       Todo     @relation(fields: [todoId], references: [id], onDelete: Cascade)

  @@map("photos")
}

model ShoppingItem {
  id          String    @id @default(cuid())
  todoId      String    @map("todo_id")
  description String
  amount      Int?      // Number of items
  price       Decimal?  // Unit price
  notes       String?
  boughtAt    DateTime? @map("bought_at") // null = not bought
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  deletedAt   DateTime? @map("deleted_at")

  todo        Todo      @relation(fields: [todoId], references: [id], onDelete: Cascade)

  @@map("shopping_items")
}
```

### Todo Model Updates

```prisma
model Todo {
  // ... existing fields ...
  parentId     String?  @map("parent_id")  // Parent todo (for DEPN)
  readyToExecute Boolean @default(false) @map("ready_to_execute")

  parent       Todo?    @relation("TodoChildren", fields: [parentId], references: [id])
  children    Todo[]   @relation("TodoChildren")
  photos      Photo[]
  shoppingItems ShoppingItem[]
}
```

---

## API Surface Summary

### New Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/todos/[id]/photos` | POST | Add photo(s) |
| `/api/todos/[id]/photos` | GET | List photos |
| `/api/todos/[id]/photos/[photoId]` | DELETE | Remove photo |
| `/api/photos/[photoId]` | GET | Get photo (with ?thumbnail) |
| `/api/todos/[id]/shopping-items` | POST | Add shopping item |
| `/api/shopping-items` | GET | Aggregate list |
| `/api/shopping-items/[id]` | PUT | Edit item |
| `/api/shopping-items/[id]` | DELETE | Soft delete |
| `/api/shopping-items/[id]/buy` | POST | Mark as bought |

### Updated Endpoints

| Endpoint | Change |
|----------|--------|
| `PUT /api/todos/[id]` | Add parentId field + cycle validation |
| `GET /api/todos` | Include readyToExecute in response |
| `GET /api/todos/[id]` | Include readyToExecute, photos, shoppingItems |
| `POST /api/todos/[id]/complete` | Trigger ready status recalculation |

---

## Dependencies

### NPM Packages

- `sharp` - Image processing (WebP conversion, thumbnails)
- `zod` - Already in use for validation

### Existing Patterns to Reuse

- Soft delete pattern from Phase 1 (deletedAt timestamp)
- Envelope response format {success, data, error}
- Prisma client singleton
- Auth middleware pattern

---

## Validation Architecture

The phase should include these validation points:

| Dimension | What Validates |
|-----------|-----------------|
| Photo upload | File size <= 10MB, valid image format |
| Photo conversion | Successful WebP conversion, thumbnail generated |
| Cycle detection | DFS check returns no cycle |
| Ready calculation | All combinations of bought/parent status tested |
| Aggregate filter | All query combinations return correct subset |
| Soft delete | Photo/shopping items hidden when deletedAt set |

---

## Risk Factors

1. **Large photo storage** - Database BLOB vs file storage tradeoff. D-01 chose database; verify performance at scale.

2. **Cycle detection performance** - Deep parent chains could slow validation. Consider caching ancestor chains if needed.

3. **Ready status calculation** - Event-driven updates must be reliable. Test race conditions.

4. **Aggregate list performance** - Large shopping lists across many todos. Consider pagination.

---

## Research Complete

**Phase:** 2
**Status:** Ready for planning

The research covers all five feature areas with concrete implementation approaches. CONTEXT.md decisions are validated and extended with technical details.