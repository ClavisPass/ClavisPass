import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.NOTE);

export const NoteModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
  displayMode: z.enum(["compact", "normal", "large"]).optional(),
  variant: z.enum(["plain", "markdown", "snippet"]).optional(),
  language: z.enum(["text", "json", "yaml", "env", "shell"]).optional(),
  showLineNumbers: z.boolean().optional(),
  wrapLines: z.boolean().optional(),
});

type NoteModuleType = z.infer<typeof NoteModuleTypeSchema>;

export default NoteModuleType;
