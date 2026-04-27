# Constitution Amendment Procedure

## Purpose

This procedure defines how to properly amend the project constitution at `memory/constitution.md`.

## Principles

- **Documented Decisions** - All changes must have documented rationale
- **Incremental Delivery** - Changes should be reviewed in logical groupings
- **Clarity Over Cleverness** - Amendment summaries must be unambiguous

## Procedure

### 1. Propose

1. Create a branch for the amendment
2. Identify which principles are affected
3. Document the rationale for each change

### 2. Prepare

1. Update the version number following semver:
   - MAJOR for backward-incompatible changes
   - MINOR for additions or expansions
   - PATCH for clarifications
2. Update `LAST_AMENDED_DATE` to today (YYYY-MM-DD)
3. Update the Sync Impact Report comment at the top

### 3. Propagate

After merging, update all dependent templates:

- `templates/plan-template.md`
- `templates/spec-template.md`
- `templates/tasks-template.md`
- `templates/commands/*.md`

Check for:
- References to old principle names
- Version number alignment
- Constitution Check section updates

### 4. Verify

- No unresolved `[PLACEHOLDER]` tokens remain
- Version line matches Sync Impact Report
- Dates in ISO format (YYYY-MM-DD)
- Principles use MUST/SHOULD for non-negotiable/optional guidance

## Verification Checklist

- [ ] Version incremented correctly
- [ ] `LAST_AMENDED_DATE` updated
- [ ] Sync Impact Report updated
- [ ] All templates updated for consistency
- [ ] No bracket tokens remain (except intentional TODOs)
- [ ] Dates in YYYY-MM-DD format
- [ ] Principles are declarative and testable