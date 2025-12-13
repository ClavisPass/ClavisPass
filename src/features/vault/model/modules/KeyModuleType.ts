import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.KEY);

export const KeyModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
});

type KeyModuleType = z.infer<typeof KeyModuleTypeSchema>;

export default KeyModuleType;
