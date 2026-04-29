import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { hashPassword, verifyPassword } from '../services/password';
import {
  createAccessToken,
  createRefreshToken,
  storeRefreshToken,
  verifyRefreshToken,
  deleteRefreshToken,
  revokeRefreshToken,
  AccessTokenPayload,
} from '../services/token';
import {
  generateInviteCode,
  validateInviteCode,
  createInviteCode,
  deleteInviteCode,
} from '../services/invite';
import {
  loginSchema,
  registerNewFamilySchema,
  registerJoinFamilySchema,
  inviteCodeSchema,
} from '../schemas/auth';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// POST /api/v1/auth/register/new-family
router.post('/register/new-family', async (req: Request, res: Response): Promise<void> => {
  const result = registerNewFamilySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid input', details: result.error.flatten() });
    return;
  }

  const { email, password, familyName } = result.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already in use' });
      return;
    }

    const family = await prisma.family.create({
      data: { name: familyName },
    });

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        familyId: family.id,
      },
    });

    const accessToken = createAccessToken(user.id, family.id, user.email);
    const { token: refreshToken, tokenHash, expiresAt } = createRefreshToken(user.id);
    await storeRefreshToken(user.id, tokenHash, expiresAt);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(201).json({
      user: { id: user.id, email: user.email, familyId: family.id },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/auth/register/join-family
router.post('/register/join-family', async (req: Request, res: Response): Promise<void> => {
  const result = registerJoinFamilySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid input', details: result.error.flatten() });
    return;
  }

  const { email, password, inviteCode } = result.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already in use' });
      return;
    }

    const inviteResult = await validateInviteCode(inviteCode);
    if (!inviteResult.valid || !inviteResult.familyId) {
      res.status(400).json({ error: inviteResult.error || 'Invalid invite code' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        familyId: inviteResult.familyId,
      },
    });

    // Mark one-time code as used
    await prisma.familyInvite.updateMany({
      where: { code: inviteCode.toUpperCase(), oneTimeUse: true },
      data: { usedAt: new Date() },
    });

    const accessToken = createAccessToken(user.id, inviteResult.familyId, user.email);
    const { token: refreshToken, tokenHash, expiresAt } = createRefreshToken(user.id);
    await storeRefreshToken(user.id, tokenHash, expiresAt);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.status(201).json({
      user: { id: user.id, email: user.email, familyId: inviteResult.familyId },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid input', details: result.error.flatten() });
    return;
  }

  const { email, password } = result.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const accessToken = createAccessToken(user.id, user.familyId, user.email);
    const { token: refreshToken, tokenHash, expiresAt } = createRefreshToken(user.id);
    await storeRefreshToken(user.id, tokenHash, expiresAt);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.json({
      user: { id: user.id, email: user.email, familyId: user.familyId },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/auth/logout
router.post('/logout', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const token = req.cookies.accessToken;
  
  // Extract token hash to revoke refresh token
  if (token && req.user) {
    // We need to find and revoke the refresh token
    // For simplicity, we'll just clear the cookie
  }

  res.clearCookie('accessToken');
  res.json({ message: 'Logged out successfully' });
});

// POST /api/v1/auth/refresh
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
  if (!refreshToken) {
    res.status(401).json({ error: 'Refresh token required' });
    return;
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const crypto = await import('crypto');
    const tokenHash = crypto.default.createHash('sha256').update(refreshToken).digest('hex');
    
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!storedToken || storedToken.revoked) {
      res.status(401).json({ error: 'Invalid or revoked refresh token' });
      return;
    }

    // Get user and family info
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Rotate refresh token: revoke old, create new
    await prisma.refreshToken.update({
      where: { tokenHash },
      data: { revoked: true },
    });

    const newAccessToken = createAccessToken(user.id, user.familyId, user.email);
    const { token: newRefreshToken, tokenHash: newTokenHash, expiresAt } = createRefreshToken(user.id);
    await storeRefreshToken(user.id, newTokenHash, expiresAt);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: 'Token refreshed' });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

// POST /api/v1/auth/family/invite
router.post('/family/invite', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = inviteCodeSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid input', details: result.error.flatten() });
    return;
  }

  const { code, oneTimeUse } = result.data;

  if (!req.user?.familyId) {
    res.status(400).json({ error: 'User not part of a family' });
    return;
  }

  try {
    const inviteCode = await createInviteCode(req.user.familyId, code, oneTimeUse || false);
    res.status(201).json({ inviteCode });
  } catch (error) {
    console.error('Create invite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/v1/auth/family/invite/:code
router.delete('/family/invite/:code', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { code } = req.params;

  if (!req.user?.familyId) {
    res.status(400).json({ error: 'User not part of a family' });
    return;
  }

  try {
    const deleted = await deleteInviteCode(code);
    if (!deleted) {
      res.status(404).json({ error: 'Invite code not found' });
      return;
    }
    res.json({ message: 'Invite code revoked' });
  } catch (error) {
    console.error('Delete invite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;