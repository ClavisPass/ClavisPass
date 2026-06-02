import { z } from "zod";

export const FolderSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

type FolderType = z.infer<typeof FolderSchema>;

export default FolderType;
