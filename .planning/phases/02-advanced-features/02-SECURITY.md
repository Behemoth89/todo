---
phase: 02-advanced-features
threats_open: 0

# Threat Register

| ID | Category | Component | Disposition | Status | Evidence |
|----|----------|-----------|-------------|--------|----------|
| T-02-01 | Denial of Service | Photo upload | validate file size < 10MB | CLOSED | validatePhotoSize() in photo-processing.ts |
| T-02-02 | Denial of Service | Sharp conversion | resize large images before conversion | CLOSED | Resize logic in convertToWebP() |
| T-02-03 | Information Disclosure | Photo serving | verify user owns todo | CLOSED | todo.userId check in photos/[photoId]/route.ts |
| T-02-04 | Tampering | Photo data | store as WebP only | CLOSED | sharp().webp() conversion |
| T-02-05 | Tampering | parentId update | validate cycle before save | CLOSED | detectCycle() in ready-status.ts |
| T-02-06 | Denial of Service | Deep parent chain | accept | ACCEPTED | Deep chains timeout - DB constraint |
| T-02-07 | Information Disclosure | Parent info leak | verify user owns both todos | CLOSED | parentTodo ownership check |
| T-02-08 | Tampering | Item data | Zod validation | CLOSED | shoppingItemSchema in routes |
| T-02-09 | Information Disclosure | Aggregate list | filter by userId ownership | CLOSED | where: { todo: { userId } } |
| T-02-10 | Repudiation | Bought status | store timestamp | CLOSED | boughtAt timestamp field |

# Trust Boundaries

| Boundary | Description |
|----------|-------------|
| client→API | Untrusted file upload enters photo endpoint |
| API→sharp | Image processing happens here |
| client→API | Untrusted parentId from client |
| API→database | Cycle detection runs here |
| client→API | Untrusted shopping item data |
| API→database | Soft delete and calculations |

# Accepted Risks

- **T-02-06 Deep parent chain:** Chain depth limit ~100, database will timeout on excessively deep chains. This is an acceptable DoS risk given the user population and use case.

---

## Security Audit 2026-04-28

| Metric | Count |
|--------|-------|
| Threats found | 10 |
| Closed | 9 |
| Open | 0 |
| Accepted | 1 |

---

*Phase: 02-advanced-features*
*Secured: 2026-04-28*