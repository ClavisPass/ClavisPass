import { z } from "zod";

export const NoteModuleSchema = z.object({
  module: z.string(),
  value: z.string(),
});

type NoteModule = z.infer<typeof NoteModuleSchema>;

export default NoteModule;
