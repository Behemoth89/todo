# Implementation Plan: Family Chores Todo App

**Branch**: `001-family-chores-todo` | **Date**: 2026-04-27 | **Spec**: specs/001-family-chores-todo/spec.md
**Input**: Feature specification from `/specs/001-family-chores-todo/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Family Chores Todo App - A responsive SPA web application for managing household chores with family member assignment, photo attachments, parent-child dependencies, and integrated shopping lists. Backend provides REST API with optimistic locking; frontend is React-based with full sorting/filtering.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend), Python 3.11+ (backend)  
**Primary Dependencies**: React 18, FastAPI, Prisma, SQLite (dev) / PostgreSQL (prod)  
**Storage**: SQLite for local development, PostgreSQL for production  
**Testing**: Vitest (frontend), Jest (backend)  
**Target Platform**: Web browsers (responsive SPA, mobile-optimized)  
**Project Type**: Web application (SPA + REST API)  
**Performance Goals**: <500ms list response, <2min todo creation, 100% ready-status accuracy  
**Constraints**: Pure responsive web, mobile browser only, optimistic locking for concurrent edits  
**Scale/Scope**: Single family use (~10 users, typical 100s todos)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate Evaluation

| Principle | Status | Notes |
|-----------|--------|-------|
| I. User-First Design | PASS | Core features directly serve user needs (todo management, assignment, shopping lists) |
| II. Data Integrity | PASS | Soft delete preserves data, optimistic locking for concurrent edits |
| III. Test-First Development | PASS | Testing frameworks specified (Vitest, Jest) |
| IV. Observability | PASS | Structured logging and error tracking to be implemented |
| V. Simplicity & YAGNI | PASS | Single SPA approach, no unnecessary features |

| Data & Storage | Status | Notes |
|----------------|--------|-------|
| Local-first | FAIL | **NEEDS CLARIFICATION**: User input specifies SPA with API backend - is local-first required? User explicitly wanted online SPA. |
| JSON format | PASS | API responses in JSON |
| Schema versioning | PASS | To be implemented in database migrations |

### Justification for Violations

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| No local-first | User explicitly requested SPA with API backend per clarifications | User clarified: "Single Page Application (SPA) with API backend" |
| | | |

## Project Structure

### Documentation (this feature)

```text
specs/001-family-chores-todo/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/          # Prisma schemas
│   ├── services/        # Business logic
│   ├── api/             # FastAPI routes
│   └── utils/           # Helpers
└── tests/

frontend/
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── services/        # API clients
│   ├── hooks/           # Custom React hooks
│   └── types/           # TypeScript types
└── tests/
```

**Structure Decision**: Web application with React SPA frontend and FastAPI backend. Backend serves REST API, frontend is responsive SPA optimized for mobile browsers.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
