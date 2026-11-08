import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.PASSKEY);

export const PasskeyModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  relyingPartyId: z.string().default(""),
  relyingPartyName: z.string().default(""),
  userName: z.string().default(""),
  userDisplayName: z.string().default(""),
  userHandle: z.string().default(""),
  credentialId: z.string().default(""),
  publicKey: z.string().default(""),
  privateKey: z.string().default(""),
  algorithm: z.string().default(""),
  transports: z.array(z.string()).default([]),
  backupEligible: z.boolean().default(false),
  backupState: z.boolean().default(false),
  signCount: z.number().int().min(0).max(0xffffffff).default(0),
  createdAt: z.string().optional(),
  lastUsedAt: z.string().optional(),
  source: z.string().optional(),
});

type PasskeyModuleType = z.infer<typeof PasskeyModuleTypeSchema>;

export default PasskeyModuleType;
