import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerNewFamilySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  familyName: z.string().min(1),
});

export const registerJoinFamilySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  inviteCode: z.string().min(8),
});

export const inviteCodeSchema = z.object({
  code: z.string().min(8).optional(),
  oneTimeUse: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterNewFamilyInput = z.infer<typeof registerNewFamilySchema>;
export type RegisterJoinFamilyInput = z.infer<typeof registerJoinFamilySchema>;
export type InviteCodeInput = z.infer<typeof inviteCodeSchema>;