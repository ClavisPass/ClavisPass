import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.USERNAME);

export const UsernameModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
});

type UsernameModuleType = z.infer<typeof UsernameModuleTypeSchema>;

export default UsernameModuleType;
