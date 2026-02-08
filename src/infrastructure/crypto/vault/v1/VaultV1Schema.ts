import { z } from "zod";

export const VaultV1Schema = z.object({
  v: z.literal(1),
  kdf: z.object({
    alg: z.literal("argon2id"),
    opslimit: z.number().int().positive(),
    memlimit: z.number().int().positive(),
    salt_b64: z.string().min(1),
    keylen: z.number().int().positive(),
  }),
  aead: z.object({
    alg: z.literal("xchacha20poly1305-ietf"),
    nonce_b64: z.string().min(1),
    aad_b64: z.string().min(1),
  }),
  ct_b64: z.string().min(1),
});

export type VaultV1 = z.infer<typeof VaultV1Schema>;
