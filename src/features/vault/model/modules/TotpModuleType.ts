import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.PASSWORD);

export const TotpModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
});

type TotpModuleType = z.infer<typeof TotpModuleTypeSchema>;

export default TotpModuleType;
