import { z } from "zod";

export const FastAccessTypeSchema = z.object({
  title: z.string(),
  username: z.string(),
  password: z.string(),
}).nullable();

type FastAccessType = z.infer<typeof FastAccessTypeSchema>;

export default FastAccessType;