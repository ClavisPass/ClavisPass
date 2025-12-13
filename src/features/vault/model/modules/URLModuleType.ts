import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.URL);

export const URLModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
});

type URLModuleType = z.infer<typeof URLModuleTypeSchema>;

export default URLModuleType;
