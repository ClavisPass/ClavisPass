import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.PIN);

export const PinModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
});

type PinModuleType = z.infer<typeof PinModuleTypeSchema>;

export default PinModuleType;
