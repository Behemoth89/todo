# Phase 1: Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the discussion.

**Date:** 2026-04-28 (updated)
**Phase:** 01-foundation
**Mode:** discuss

## Discussion Coverage

| Area | Options Presented | Selection |
|------|-----------------|-----------|
| Auth session approach | JWT+refresh, JWT only, Server sessions | JWT + refresh token (Recommended) |
| Soft delete queries | Database filters, Separate endpoints, Query param | Database filters (Recommended) |
| REST API design | Resource-based, Action-based | Resource-based (Recommended) |
| Settings storage | Database, JSON config, Env vars | Database (Recommended) |
| Password recovery | Email reset, Recovery questions, Admin-only | Email reset link (Recommended) |
| Database/ORM | Prisma+Postgres, better-sqlite3, MongoDB | Prisma (Recommended) |
| API response format | Envelope, Direct data, Error-first | Envelope format (Recommended) |
| Validation library | Zod, Yup, Joi | Zod (Recommended) |
| Error handling | Centralized, Inline, Custom classes | Centralized handler (Recommended) |

## Notes

All discussions confirmed with user - no corrections needed.

## Deferred Ideas

- Photos attached to todos — Phase 2
- Parent-child dependencies — Phase 2
- Shopping items linked to todos — Phase 2