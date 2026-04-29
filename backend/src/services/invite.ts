import crypto from 'crypto';
import { prisma } from '../lib/prisma';

const INVITE_CODE_LENGTH = 8;
const INVITE_EXPIRY_DAYS = 7;

export interface ValidateInviteResult {
  valid: boolean;
  familyId?: string;
  error?: string;
}

export function generateInviteCode(length: number = INVITE_CODE_LENGTH): string {
  return crypto.randomBytes(length).toString('hex').slice(0, length).toUpperCase();
}

export async function validateInviteCode(code: string): Promise<ValidateInviteResult> {
  const invite = await prisma.familyInvite.findUnique({
    where: { code: code.toUpperCase() },
    include: { family: true },
  });

  if (!invite) {
    return { valid: false, error: 'Invalid invite code' };
  }

  if (invite.expiresAt && invite.expiresAt < new Date()) {
    return { valid: false, error: 'Invite code has expired' };
  }

  if (invite.usedAt) {
    return { valid: false, error: 'Invite code has already been used' };
  }

  if (invite.oneTimeUse && invite.usedAt) {
    return { valid: false, error: 'One-time invite code has been used' };
  }

  return { valid: true, familyId: invite.familyId };
}

export async function createInviteCode(
  familyId: string,
  customCode?: string,
  oneTimeUse: boolean = false
): Promise<string> {
  const code = customCode?.toUpperCase() || generateInviteCode();
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  await prisma.familyInvite.create({
    data: {
      code,
      familyId,
      oneTimeUse,
      expiresAt,
    },
  });

  return code;
}

export async function deleteInviteCode(code: string): Promise<boolean> {
  try {
    await prisma.familyInvite.delete({
      where: { code: code.toUpperCase() },
    });
    return true;
  } catch {
    return false;
  }
}