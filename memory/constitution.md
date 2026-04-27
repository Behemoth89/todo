# Project Constitution

## Meta

- **Version:** 1.0.0
- **Ratification Date:** 2026-04-27
- **Last Amended:** 2026-04-27

---

## Purpose

This document defines the governing principles, conventions, and operating norms for the todo project. All contributors and automated tools MUST adhere to these principles.

---

## Principles

### 1. Clarity Over Cleverness

Code and documentation MUST prioritize readability. Prefer explicit over implicit, simple over clever. Future maintainers (including AI agents) should understand intent without needing to decode obfuscation.

**Rationale:** Maintainability depends on legibility. Clever code often becomes technical debt when original authors are unavailable.

### 2. Incremental Delivery

All changes MUST be broken into small, verifiable increments. Each commit or unit of work should be testable in isolation and reviewable in a single pass.

**Rationale:** Small changes reduce risk, simplify debugging, and accelerate feedback cycles.

### 3. Testable Assertions

Every functional change MUST include or update tests that verify the expected behavior. Tests MUST be deterministic and MUST NOT depend on external timing, network, or mutable global state.

**Rationale:** Tests provide regression safety and document expected behavior. Non-deterministic tests erode confidence.

### 4. Explicit Dependencies

All external libraries, tools, and services MUST be declared in project configuration files with version constraints. Implicit runtime resolution is prohibited.

**Rationale:** Reproducible environments require explicit dependency management. Implicit resolution causes "works on my machine" failures.

### 5. Documented Decisions

Significant architectural or design decisions MUST be recorded in the project documentation. Decision rationale MUST accompany the decision record.

**Rationale:** Future contributors need context for why decisions were made. Without documentation, decisions appear arbitrary.

### 6. Minimal Surface Area

Public APIs and user-facing interfaces MUST be as small as necessary. Internal implementation details MUST remain internal.

**Rationale:** Smaller interfaces are easier to maintain, document, and secure. Encapsulation prevents accidental coupling.

---

## Governance

### Amendment Procedure

1. Propose changes by creating a branch with the amendment
2. Document the rationale for each principle addition, removal, or modification
3. Require review from at least one other contributor (or human user approval)
4. Increment version according to semantic versioning rules
5. Merge to main branch triggers propagation to dependent templates

### Versioning Policy

- **MAJOR (X.0.0):** Backward-incompatible changes to principles (removal, redefinition)
- **MINOR (0.X.0):** New principles added or materially expanded guidance
- **PATCH (0.0.X):** Clarifications, wording, typo fixes, non-semantic refinements

### Compliance Review

Before any merge, automated checks MUST verify:
- No unresolved placeholder tokens remain in documentation
- Version numbers in constitution match declared changes
- All referenced templates have been updated for consistency

---

## Templates

The following templates are maintained in sync with this constitution:

| Template | Purpose |
|----------|---------|
| `templates/plan-template.md` | Project planning structure |
| `templates/spec-template.md` | Feature specification format |
| `templates/tasks-template.md` | Task breakdown format |
| `templates/commands/*.md` | Standard operating procedures |

---

## Sync Impact Report

```html
<!--
Version Change: None (initial creation)
Status: Initial constitution for "todo" project

Placeholder tokens resolved: 15
- PROJECT_NAME: todo
- VERSION: 1.0.0
- RATIFICATION_DATE: 2026-04-27
- LAST_AMENDED_DATE: 2026-04-27
- PRINCIPLE_1: Clarity Over Cleverness
- PRINCIPLE_2: Incremental Delivery
- PRINCIPLE_3: Testable Assertions
- PRINCIPLE_4: Explicit Dependencies
- PRINCIPLE_5: Documented Decisions
- PRINCIPLE_6: Minimal Surface Area
- etc.

Templates requiring updates: 4
  - templates/plan-template.md (created)
  - templates/spec-template.md (created)
  - templates/tasks-template.md (created)
  - templates/commands/ (directory created, 1 command file created)

Deferred items: None
-->
```