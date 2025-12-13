import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.EXPIRY);

export const ExpiryModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
  warnBeforeMs: z.number().optional(),
});

type ExpiryModuleType = z.infer<typeof ExpiryModuleTypeSchema>;

export default ExpiryModuleType;