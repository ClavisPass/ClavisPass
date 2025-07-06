import { z } from "zod";

export const FastAccessTypeSchema = z.object({
  title: z.string(),
  username: z.string(),
  usernameId: z.string(),
  password: z.string(),
  passwordId: z.string(),
}).nullable();

type FastAccessType = z.infer<typeof FastAccessTypeSchema>;

export default FastAccessType;