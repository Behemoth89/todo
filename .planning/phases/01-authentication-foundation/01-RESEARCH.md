# Phase 1: Authentication Foundation - Research

**Researched:** 2026-04-29
**Domain:** Express + PostgreSQL + Prisma JWT Authentication
**Confidence:** HIGH

## Summary

This phase implements secure JWT authentication with family management. Users register/login/logout with email/password, manage family membership via invite codes. The implementation uses short-lived access tokens (15 min) stored in HttpOnly cookies, with refresh tokens persisted in PostgreSQL via Prisma. All auth endpoints under `/api/v1/auth/` prefix.

**Primary recommendation:** Use jsonwebtoken 9.0.3 for JWT operations, bcryptjs 3.0.3 for password hashing, zod 4.3.6 for input validation. Store refresh tokens in database with tokenVersion for revocation. Set cookies with httpOnly, secure, sameSite=strict.

---

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Use Prisma over TypeORM
- **D-02:** HttpOnly cookies for access token, refresh token stored in database
- **D-03:** Access token expires in 15 minutes, refresh token expires in 7 days
- **D-04:** Custom invite codes (user-generated, not auto-UUID)
- **D-05:** One-time use invite codes supported
- **D-06:** All auth endpoints prefixed with `/api/v1/auth/`
- **D-07:** Separate endpoints: `register/new-family`, `register/join-family`
- **D-08:** `POST /api/v1/auth/login` — Email + password, returns tokens
- **D-09:** `POST /api/v1/auth/logout` — Invalidates refresh token
- **D-10:** `POST /api/v1/auth/refresh` — Get new access token from valid refresh token
- **D-11:** `POST /api/v1/auth/family/invite` — Generate new invite code
- **D-12:** `DELETE /api/v1/auth/family/invite/:code` — Revoke/invalidate invite code

### the agent's Discretion
- Validation library choice (Zod recommended but not locked)
- Specific cookie attribute values (httpOnly, secure, sameSite defaults)

### Deferred Ideas (OUT OF SCOPE)
- Email verification (AUTH-06) — deferred to v2
- Password reset via email (AUTH-07) — deferred to v2
- Invite code regeneration (FAM-05) — deferred to v2
- Family member list view (FAM-06) — deferred to v2

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | User can register with email and password | bcryptjs for password hashing, Zod for email/password validation |
| AUTH-02 | User can log in with email and password | jsonwebtoken for JWT generation, bcryptjs.compare for password verification |
| AUTH-03 | User session persists across browser refresh | Access token in HttpOnly cookie, middleware checks cookie on each request |
| AUTH-04 | User can log out and invalidate session | Delete refresh token from database, clear cookie |
| AUTH-05 | JWT access token expires and refresh token allows session continuity | Short access token (15m), database-stored refresh token (7d) with refresh endpoint |
| FAM-01 | User can create a new family during registration | Prisma schema with Family model, register/new-family endpoint |
| FAM-02 | User can generate invite code for their family | FamilyInvite model with code field, POST /family/invite endpoint |
| FAM-03 | User can join existing family using invite code during registration | register/join-family endpoint validates code against FamilyInvite |
| FAM-04 | Family invite code is validated before adding user | Check code exists, not expired, not used (if one-time) |

</phase_requirements>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| jsonwebtoken | 9.0.3 | JWT sign/verify for access tokens | [VERIFIED: npm registry] Most popular Node.js JWT library (18k stars), auth0 maintained |
| bcryptjs | 3.0.3 | Password hashing | [VERIFIED: npm registry] Pure JavaScript, zero dependencies, TypeScript support |
| prisma | 7.8.0 | ORM for PostgreSQL | [VERIFIED: npm registry] Locked in D-01 |
| zod | 4.3.6 | Input validation | [VERIFIED: npm registry] TypeScript-first, popular for Express APIs |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| cookie-parser | ^4.0.0 | Parse cookies from requests | Required to read HttpOnly cookies |
| express-validator | — | Request validation | NOT NEEDED — using Zod instead |

**Installation:**
```bash
npm install jsonwebtoken@9.0.3 bcryptjs@3.0.3 prisma@7.8.0 @prisma/client@7.8.0 zod@4.3.6 cookie-parser@4.0.0
npm install -D @types/jsonwebtoken @types/bcryptjs typescript
```

---

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Express   │────▶│  PostgreSQL│
│   (Vue 3)   │     │   Backend   │     │  (Prisma)   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                    │
       │  HttpOnly Cookie  │                    │
       │◀─────────────────│                    │
       │                  │                    │
       │         ┌────────┴────────┐           │
       │         │   Auth Flow     │           │
       │         │                 │           │
       │         │ 1. Login with  │           │
       │         │    email+pass  │           │
       │         │                 │           │
       │         │ 2. bcrypt.compare  ──────▶ User table
       │         │    password check           (hashed password)
       │         │                 │           │
       │         │ 3. Generate JWT  ◀────── ACCESS_TOKEN_SECRET
       │         │    access token             (env var)
       │         │                 │           │
       │         │ 4. Store refresh  ◀─────▶ RefreshToken table
       │         │    token in DB             (token hash, user_id, expires)
       │         │                 │           │
       │         │ 5. Set HttpOnly  ──────────▶ Cookie response
       │         │    cookie with access       (httpOnly, secure, sameSite=strict)
       │         │                 │           │
       │         │ 6. Subsequent   ──────────▶ Middleware verifies
       │         │    requests                   JWT from cookie
       │         │                 │           │
       │         │ 7. Token expired? ──────────▶ Check refresh token
       │         │    Yes → refresh              in DB, generate new access
       │         │                 │           │
       │         └─────────────────────────────┘
```

### Recommended Project Structure

```
src/
├── auth/
│   ├── routes/
│   │   ├── auth.routes.ts       # /api/v1/auth/* endpoints
│   │   ├── login.ts            # POST /login
│   │   ├── logout.ts           # POST /logout
│   │   ├── refresh.ts          # POST /refresh
│   │   ├── register-new-family.ts
│   │   ├── register-join-family.ts
│   │   └── family-invite.ts   # POST/DELETE /family/invite
│   ├── middleware/
│   │   ├── authenticate.ts    # Verify JWT from cookie
│   │   └── optional-auth.ts    # Attach user if token present
│   ├── services/
│   │   ├── token.service.ts    # JWT sign/verify, refresh logic
│   │   ├── password.service.ts # bcrypt hash/compare
│   │   └── invite.service.ts   # Invite code generation/validation
│   └── schemas/
│       ├── login.schema.ts     # Zod schemas
│       ├── register.schema.ts
│       └── invite.schema.ts
├── prisma/
│   ├── schema.prisma           # Database models
│   └── client.ts              # PrismaClient instance
└── app.ts                     # Express app setup
```

### Pattern 1: JWT Access Token in HttpOnly Cookie

**What:** Store JWT access token in HttpOnly cookie instead of localStorage

**When to use:** Every authenticated API request

**Example:**
```typescript
// Source: [VERIFIED: WebSearch - multiple 2025/2026 guides]
// Login endpoint
app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Verify password
  const user = await prisma.user.findUnique({ where: { email } });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  
  // Generate access token (15 min)
  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
  
  // Generate refresh token (7 days)
  const refreshToken = jwt.sign(
    { userId: user.id, tokenId: crypto.randomUUID() },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
  
  // Store refresh token hash in database
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: crypto.createHash('sha256').update(refreshToken).digest('hex'),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });
  
  // Set HttpOnly cookie for access token
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000  // 15 minutes
  });
  
  // Return refresh token in body (for storage) OR also in cookie
  // Per D-02: access token in cookie, refresh in database
  res.json({ success: true });
});
```

### Pattern 2: Token Refresh with Database Validation

**What:** Validate refresh token against database on each refresh, increment tokenVersion for revocation

**When to use:** When access token expires and client requests new one

**Example:**
```typescript
// Source: [VERIFIED: WebSearch - 2025/2026 JWT refresh guides]
// Refresh endpoint
app.post('/api/v1/auth/refresh', async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'No refresh token' });
  
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
    // Verify token exists in database and not revoked
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        userId: decoded.userId,
        tokenHash: crypto.createHash('sha256').update(token).digest('hex'),
        expiresAt: { gt: new Date() },
        revoked: false
      }
    });
    
    if (!storedToken) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    
    // Optional: Rotate refresh token (generate new, delete old)
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    
    // Set new access token cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });
    
    res.json({ success: true });
  } catch (error) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
});
```

### Pattern 3: Family Invite Code System

**What:** Custom invite codes with optional one-time use

**When to use:** FAM-02, FAM-03, FAM-04 requirements

**Example:**
```typescript
// Source: [CITED: design decision in 01-CONTEXT.md]
// Generate invite code
app.post('/api/v1/auth/family/invite', authenticate, async (req, res) => {
  const { code, oneTimeUse } = req.body;  // code is optional/custom
  
  const inviteCode = code || generateSecureCode(8);  // Default: generate
  
  // Check code uniqueness
  const existing = await prisma.familyInvite.findUnique({
    where: { code: inviteCode }
  });
  if (existing) return res.status(400).json({ error: 'Code already exists' });
  
  const invite = await prisma.familyInvite.create({
    data: {
      code: inviteCode,
      familyId: req.user.familyId,
      oneTimeUse: oneTimeUse || false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)  // 7 days
    }
  });
  
  res.json({ code: invite.code, oneTimeUse: invite.oneTimeUse });
});

// Join family with invite code
app.post('/api/v1/auth/register/join-family', async (req, res) => {
  const { email, password, inviteCode } = req.body;
  
  // Validate invite code
  const invite = await prisma.familyInvite.findUnique({
    where: { code: inviteCode }
  });
  
  if (!invite) return res.status(400).json({ error: 'Invalid invite code' });
  if (invite.expiresAt < new Date()) return res.status(400).json({ error: 'Invite code expired' });
  if (invite.usedAt) return res.status(400).json({ error: 'Invite code already used' });
  
  // Create user with family
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(password, 10),
      familyId: invite.familyId
    }
  });
  
  // Mark one-time code as used
  if (invite.oneTimeUse) {
    await prisma.familyInvite.update({
      where: { id: invite.id },
      data: { usedAt: new Date() }
    });
  }
  
  // Generate tokens...
  res.json({ success: true, user: { id: user.id, email: user.email } });
});
```

### Anti-Patterns to Avoid

- **Storing tokens in localStorage:** Vulnerable to XSS attacks. Always use HttpOnly cookies for access tokens.
- **Same secret for access and refresh tokens:** If one is compromised, the other remains vulnerable. Use separate secrets.
- **Not revoking refresh tokens:** Without server-side storage, you cannot log out users or handle theft.
- **Long-lived access tokens:** 15 minutes is standard. Longer = bigger attack window.
- **Storing refresh tokens in plaintext:** Hash them before storing in database.
- **Missing CSRF protection:** Even with SameSite=strict, critical operations should validate origin.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Password hashing | Custom salt + hash | bcryptjs 3.0.3 | bcrypt is proven secure, handles salting, cost factor tuning |
| JWT signing/verification | Custom JWT implementation | jsonwebtoken 9.0.3 | 18k stars, maintained by auth0, handles all algorithms |
| Input validation | Manual checks | zod 4.3.6 | TypeScript-first, integrates with Express middleware |
| Cookie signing | Custom HMAC | Express cookie-parser + httpOnly | Native Express support, XSS protection |
| Random code generation | Math.random() based | crypto.randomUUID() or custom charset | Cryptographically secure, collision-resistant |

**Key insight:** Authentication security depends on proven cryptographic primitives. Custom implementations almost always have subtle flaws. Use battle-tested libraries.

---

## Common Pitfalls

### Pitfall 1: JWT Token in localStorage
**What goes wrong:** XSS attacks can read localStorage and exfiltrate tokens
**Why it happens:** Developers copy tutorials using localStorage without understanding XSS implications
**How to avoid:** Use HttpOnly cookies only — never localStorage for auth tokens
**Warning signs:** Code uses `localStorage.setItem('token', ...)`

### Pitfall 2: Not Rotating Refresh Tokens
**What goes wrong:** Stolen refresh tokens remain valid indefinitely
**Why it happens:** Using same refresh token on every access token refresh
**How to avoid:** On each refresh, generate new refresh token, delete old one from database
**Warning signs:** Refresh endpoint returns same refresh token each time

### Pitfall 3: Using Same Secret for Both Tokens
**What goes wrong:** Compromising one exposes both
**Why it happens:** Convenience of single secret variable
**How to avoid:** Use separate `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` environment variables
**Warning signs:** Single JWT_SECRET used for both sign() calls

### Pitfall 4: Storing Refresh Tokens in Plaintext
**What goes wrong:** Database breach exposes all valid tokens
**Why it happens:** Treating refresh tokens like session IDs
**How to avoid:** Hash refresh tokens with SHA-256 before storing in database
**Warning signs:** Refresh token stored as-is in `token` column

### Pitfall 5: Missing Logout Invalidation
**What goes wrong:** Logout only clears client cookie, token remains valid server-side
**Why it happens:** Treating logout as client-side operation only
**How to avoid:** Delete refresh token from database on logout, implement tokenVersion invalidation
**Warning signs:** Logout endpoint has no database operations

---

## Code Examples

### Zod Validation Schema
```typescript
// Source: [VERIFIED: Context7 - /colinhacks/zod]
import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters')
  })
});

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    familyName: z.string().min(1, 'Family name required').optional(),
    inviteCode: z.string().optional()
  }).refine(
    data => (data.familyName && !data.inviteCode) || (!data.familyName && data.inviteCode) || (!data.familyName && !data.inviteCode),
    { message: 'Provide either familyName (new family) or inviteCode (join family)' }
  )
});
```

### Auth Middleware
```typescript
// Source: [VERIFIED: WebSearch - Express JWT middleware patterns]
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: { userId: string; familyId: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as { userId: string; familyId?: string };
    req.user = { userId: decoded.userId, familyId: decoded.familyId };
    next();
  } catch (error) {
    // Token expired - check if refresh token exists
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      // Let client know to refresh
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JWT in localStorage | HttpOnly cookies | 2020+ XSS awareness | Prevents token theft via XSS |
| Single long-lived JWT | Access + refresh tokens | 2019+ stateless auth evolution | Enables session revocation |
| Same refresh token | Token rotation | 2021+ token theft awareness | Limits damage from stolen tokens |
| Refresh token in body | Refresh token in database | 2021+ server-side validation | Enables logout, theft detection |
| SameSite=None (cookies) | SameSite=strict/lax | 2020+ CSRF awareness | Blocks cross-site requests |

**Deprecated/outdated:**
- **JWT without expiration claims:** Modern libraries enforce exp claim
- **localStorage for tokens:** Security community universally recommends against
- **Single secret for all JWTs:** Now considered insecure practice

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Using Prisma Client with PostgreSQL adapter | Standard Stack | Low - D-01 locked to Prisma |
| A2 | Express.js as HTTP framework | Architecture Patterns | Low - PROJECT.md specifies Express |
| A3 | cookie-parser middleware available | Code Examples | Low - Standard Express middleware |

---

## Open Questions

1. **Refresh token storage: hash vs store raw?**
   - What we know: Current consensus is to hash with SHA-256 before storing
   - What's unclear: Whether the added complexity is worth it for short-lived refresh tokens
   - Recommendation: Hash refresh tokens - minimal cost, significant security benefit

2. **Access token also in cookie vs in-memory?**
   - What we know: Context says HttpOnly cookie for access token (D-02)
   - What's unclear: Some architectures keep access token in JavaScript memory for flexibility
   - Recommendation: Follow D-02 - HttpOnly cookie for access token

3. **CSRF protection beyond SameSite?**
   - What we know: SameSite=strict blocks most CSRF
   - What's unclear: Whether explicit CSRF tokens needed for this SPA + API setup
   - Recommendation: Start with SameSite=strict only; add CSRF token if issues arise

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Runtime | ✓ | 20+ (project) | — |
| PostgreSQL | Database | ✓ (Docker) | 15+ | — |
| npm | Package manager | ✓ | 10+ | — |
| crypto (Node built-in) | Token generation | ✓ | — | — |

**Missing dependencies with no fallback:**
- None identified - all required tools available

**Missing dependencies with fallback:**
- None identified

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest + Supertest |
| Config file | `jest.config.js` (if existing) or `jest.config.ts` |
| Quick run command | `npm test -- --testPathPattern="auth" --passWithNoTests` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-01 | User can register with email and password | Integration | `npm test -- tests/auth/register.test.ts` | ❌ Create |
| AUTH-02 | User can log in with email and password | Integration | `npm test -- tests/auth/login.test.ts` | ❌ Create |
| AUTH-03 | Session persists across refresh | Integration | `npm test -- tests/auth/session.test.ts` | ❌ Create |
| AUTH-04 | User can log out and invalidate session | Integration | `npm test -- tests/auth/logout.test.ts` | ❌ Create |
| AUTH-05 | Token refresh works | Integration | `npm test -- tests/auth/refresh.test.ts` | ❌ Create |
| FAM-01 | Create new family during registration | Integration | `npm test -- tests/auth/register-new-family.test.ts` | ❌ Create |
| FAM-02 | Generate invite code for family | Integration | `npm test -- tests/auth/invite-generate.test.ts` | ❌ Create |
| FAM-03 | Join existing family with invite code | Integration | `npm test -- tests/auth/register-join-family.test.ts` | ❌ Create |
| FAM-04 | Invite code validation | Integration | `npm test -- tests/auth/invite-validation.test.ts` | ❌ Create |

### Sampling Rate
- **Per task commit:** `npm test -- --testPathPattern="auth" --passWithNoTests`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `tests/auth/register.test.ts` — covers AUTH-01
- [ ] `tests/auth/login.test.ts` — covers AUTH-02
- [ ] `tests/auth/session.test.ts` — covers AUTH-03
- [ ] `tests/auth/logout.test.ts` — covers AUTH-04
- [ ] `tests/auth/refresh.test.ts` — covers AUTH-05
- [ ] `tests/auth/register-new-family.test.ts` — covers FAM-01
- [ ] `tests/auth/invite-generate.test.ts` — covers FAM-02
- [ ] `tests/auth/register-join-family.test.ts` — covers FAM-03
- [ ] `tests/auth/invite-validation.test.ts` — covers FAM-04
- [ ] `tests/setup.ts` — test database setup, JWT helper
- [ ] `tests/fixtures/` — test users, families, invite codes

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | bcryptjs password hashing, JWT access tokens |
| V3 Session Management | Yes | HttpOnly cookies, server-side refresh token storage |
| V4 Access Control | Yes | Auth middleware validates token, familyId in JWT |
| V5 Input Validation | Yes | zod 4.3.6 schema validation |
| V6 Cryptography | Yes | jsonwebtoken for JWT, crypto for token hashes |

### Known Threat Patterns for JWT + Cookies

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS steals JWT from localStorage | Information Disclosure | Use HttpOnly cookies only |
| CSRF with cookies | Tampering | SameSite=strict cookie attribute |
| Token replay after logout | Repudiation | Delete refresh token from database |
| JWT algorithm confusion | Tampering | Explicitly specify `algorithms: ['HS256']` in verify |
| Refresh token theft | Information Disclosure | Hash stored tokens, implement rotation |

---

## Sources

### Primary (HIGH confidence)
- [VERIFIED: npm registry] - jsonwebtoken 9.0.3, bcryptjs 3.0.3, prisma 7.8.0, zod 4.3.6
- [VERIFIED: GitHub auth0/node-jsonwebtoken] - JWT signing/verification API
- [VERIFIED: npmjs bcryptjs docs] - Password hashing API
- [VERIFIED: Context7 /colinhacks/zod] - Zod validation patterns

### Secondary (MEDIUM confidence)
- [CITED: boxsoftware.net - JWT refresh token guide 2026] - Token rotation patterns
- [CITED: pkglog.com - JWT complete guide 2026] - Access/refresh separation
- [CITED: dev.to - Express cookie security] - HttpOnly, SameSite configuration

### Tertiary (LOW confidence)
- [WebSearch: express csrf protection] - Additional CSRF considerations (may need validation)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - verified via npm registry, libraries are current versions
- Architecture: HIGH - patterns confirmed across multiple 2025/2026 sources
- Pitfalls: HIGH - well-documented security issues from security community

**Research date:** 2026-04-29
**Valid until:** 2026-05-29 (30 days for stable auth patterns)

---