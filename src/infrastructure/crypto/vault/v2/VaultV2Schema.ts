import { z } from "zod";

export const VaultV2Schema = z.object({
  v: z.literal(2),
  kdf: z.object({
    alg: z.literal("argon2id"),
    opslimit: z.number().int().positive(),
    memlimit: z.number().int().positive(),
    salt_b64: z.string().min(1),
    keylen: z.number().int().positive(),
  }),
  keywrap: z.object({
    alg: z.literal("xchacha20poly1305-ietf"),
    nonce_b64: z.string().min(1),
    aad_b64: z.string().min(1),
    wrapped_key_b64: z.string().min(1),
  }),
  aead: z.object({
    alg: z.literal("xchacha20poly1305-ietf"),
    nonce_b64: z.string().min(1),
    aad_b64: z.string().min(1),
  }),
  ct_b64: z.string().min(1),
});

export type VaultV2 = z.infer<typeof VaultV2Schema>;
