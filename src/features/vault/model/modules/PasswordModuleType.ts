import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.PASSWORD);

export const PasswordModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
});

type PasswordModuleType = z.infer<typeof PasswordModuleTypeSchema>;

export default PasswordModuleType;
