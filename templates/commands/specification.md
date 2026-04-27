# Specification Workflow

## Purpose

This procedure defines how to create feature specifications using `templates/spec-template.md`.

## Principles

- **Clarity Over Cleverness** - Features are explainable in simple terms
- **Minimal Surface Area** - Only necessary interfaces are defined
- **Testable Assertions** - Requirements have verifiable criteria

## Procedure

### 1. Draft Overview

1. Name the feature clearly (action-oriented)
2. Describe what it does in 2-3 sentences
3. Explain why it matters to users

### 2. Define Requirements

**Functional Requirements:**

- Each requirement is a complete sentence
- Includes acceptance criteria
- Has explicit priority (Must/Should/Could)

**Non-Functional Requirements:**

- Include measurable targets
- Define how measurement occurs

### 3. Design

1. Create architecture diagram or description
2. Define data model if applicable
3. Minimize API surface (Minimal Surface Area principle)
4. Document each interface with rationale

### 4. Test Plan

1. Map each functional requirement to test cases
2. Include both positive and negative scenarios
3. Define integration test requirements

### 5. Review

Constitution Check:

- [ ] Feature explainable to non-expert
- [ ] Requirements are independently verifiable
- [ ] API surface is minimal
- [ ] All dependencies declared

## Verification

- Each requirement maps to at least one test
- Design choices have documented rationale
- API surface cannot be reduced without removing capability