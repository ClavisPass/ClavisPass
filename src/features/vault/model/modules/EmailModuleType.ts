import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.E_MAIL);

export const EmnailModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
});

type EmailModuleType = z.infer<typeof EmnailModuleTypeSchema>;

export default EmailModuleType;
