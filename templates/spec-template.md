# Feature Specification Template

## Meta

- **Feature Name:** [Descriptive name]
- **Spec Version:** 1.0.0
- **Constitution Version:** 1.0.0
- **Author:** [Name/agent]
- **Created:** YYYY-MM-DD
- **Status:** Draft | Proposed | Approved | Implemented

---

## Overview

[2-3 sentences describing what this feature does and why it matters]

---

## Constitution Alignment

This specification adheres to:

- [x] **Clarity Over Cleverness** - Feature is explainable in plain terms
- [x] **Incremental Delivery** - Can be delivered in small verifiable steps
- [x] **Testable Assertions** - Each requirement has verifiable acceptance criteria
- [x] **Explicit Dependencies** - All required dependencies are listed
- [x] **Documented Decisions** - Design choices have rationale
- [x] **Minimal Surface Area** - Only necessary interfaces are exposed

---

## Requirements

### Functional Requirements

| ID | Requirement | Acceptance Criteria | Priority |
|----|-------------|---------------------|----------|
| FR-001 | [What the system must do] | [How to verify completion] | Must/Should/Could |
| FR-002 | [Requirement] | [Criteria] | [Priority] |

### Non-Functional Requirements

| ID | Requirement | Target | Measurement |
|----|-------------|--------|-------------|
| NFR-001 | [Performance/Reliability/etc] | [Target metric] | [How measured] |

---

## Design

### Architecture

[Diagram or description of how components interact]

### Data Model

[If applicable, describe key data structures]

### API Surface

[For exposed interfaces - minimize per Minimal Surface Area principle]

| Endpoint | Method | Input | Output | Rationale |
|----------|--------|-------|--------|-----------|
| [path] | GET/POST/etc | [shape] | [shape] | [why needed] |

---

## Dependencies

| Dependency | Version Constraint | Justification |
|------------|-------------------|----------------|
| [name] | [version/range] | [why required] |

---

## Test Plan

| Test ID | Type | Scenario | Expected Result |
|---------|------|----------|-----------------|
| TC-001 | Unit | [Condition] | [Outcome] |
| TC-002 | Integration | [Condition] | [Outcome] |

---

## Implementation Notes

### Incremental Delivery Steps

1. [Step 1]
2. [Step 2]
3. [Step 3]

### Known Constraints

- [Limitation 1]
- [Limitation 2]

---

## Decisions

| Decision | Rationale |
|----------|-----------|
| [Chosen approach] | [Why preferred over alternatives] |