import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.NOTE);

export const NoteModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
});

type NoteModuleType = z.infer<typeof NoteModuleTypeSchema>;

export default NoteModuleType;
