import { z } from "zod";

export const CryptoTypeSchema = z.object({
    ciphertext: z.string(),
    salt: z.string(),
    iv: z.string(),
  });
  
  type CryptoType = z.infer<typeof CryptoTypeSchema>;
  
  export default CryptoType;