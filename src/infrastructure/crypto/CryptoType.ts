import { z } from "zod";

export const CryptoTypeSchema = z.object({
  lastUpdated: z.string().datetime(),
  ciphertext: z.string(),
  salt: z.string(),
  iv: z.string(),
});

type CryptoType = z.infer<typeof CryptoTypeSchema>;

export default CryptoType;
