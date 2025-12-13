import { z } from "zod";

export const FolderSchema = z.object({
  id: z.string(),
  name: z.string(),
});

type FolderType = z.infer<typeof FolderSchema>;

export default FolderType;
