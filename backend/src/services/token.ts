import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';

import { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-insecure-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'changeme-refresh-secret';
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

export interface AccessTokenPayload {
  userId: string;
  familyId: string | null;
  email: string;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
}

export function createAccessToken(userId: string, familyId: string | null, email: string): string {
  const payload: AccessTokenPayload = { userId, familyId, email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRY } as SignOptions);
}

export function createRefreshToken(userId: string): { token: string; tokenHash: string; expiresAt: Date } {
  const tokenId = crypto.randomUUID();
  const payload: RefreshTokenPayload = { userId, tokenId };
  const token = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRY } as SignOptions);
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  return { token, tokenHash, expiresAt };
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
}

export async function storeRefreshToken(
  userId: string,
  tokenHash: string,
  expiresAt: Date
): Promise<void> {
  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });
}

export async function findRefreshToken(tokenHash: string): Promise<{ id: string; userId: string; revoked: boolean } | null> {
  const token = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    select: { id: true, userId: true, revoked: true },
  });
  return token;
}

export async function revokeRefreshToken(tokenHash: string): Promise<void> {
  await prisma.refreshToken.update({
    where: { tokenHash },
    data: { revoked: true },
  });
}

export async function deleteRefreshToken(tokenHash: string): Promise<void> {
  await prisma.refreshToken.delete({
    where: { tokenHash },
  }).catch(() => {
    // Ignore if not found
  });
}