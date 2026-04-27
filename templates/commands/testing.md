# Testing Workflow

## Purpose

This procedure defines how to create, maintain, and verify tests aligned with constitution principles.

## Principles

- **Testable Assertions** - Tests are deterministic and verifiable
- **Incremental Delivery** - Tests accompany each deliverable
- **Clarity Over Cleverness** - Test names describe expected behavior

## Procedure

### 1. Create Tests

**When:** Tests MUST be written before or alongside code changes

**Naming:**
```
[Unit/Integration/E2E]-[Component]-[Action]-[Expected-Result]
```

**Structure:**
```javascript
describe('Component', () => {
  it('should perform action that results in outcome', () => {
    // Given
    const input = setup();
    // When
    const result = subject.action(input);
    // Then
    expect(result).toMatchSnapshot();
  });
});
```

### 2. Determinism Rules

Tests MUST NOT:

- Rely on timing (setTimeout, setInterval without mocking)
- Make network calls without mocking
- Depend on mutable global state
- Use random values without seeding

Tests SHOULD:

- Use dependency injection
- Clean up state after each test
- Mock external systems
- Be run in isolation

### 3. Verification

Run tests with:
```bash
npm test
```

Constitution Check:
- [ ] All tests pass
- [ ] No skipped/focused tests in production
- [ ] Coverage meets project threshold
- [ ] No non-deterministic tests

### 4. Maintenance

When updating tests:

1. Verify the change maintains intent
2. Update documentation if behavior changes
3. Run full suite to check for regressions

## Verification

- Tests fail when code is broken
- Tests pass when code is correct
- Test output is readable without domain knowledge