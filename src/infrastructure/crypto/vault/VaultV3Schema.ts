import { z } from "zod";
import { VaultV2Schema } from "./v2/VaultV2Schema";

const RecoverySlotSchema = z
  .object({
    nonce_b64: z.string().min(1),
    wrapped_key_b64: z.string().min(1),
  })
  .strict();

export const VaultV3Schema = VaultV2Schema.extend({
  v: z.literal(3),
  recovery: RecoverySlotSchema,
}).strict();

export type VaultV3 = z.infer<typeof VaultV3Schema>;
export type RecoverySlot = z.infer<typeof RecoverySlotSchema>;
