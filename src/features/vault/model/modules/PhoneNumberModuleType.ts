import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.PHONE_NUMBER);

export const PhoneNumberModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
});

type PhoneNumberModuleType = z.infer<typeof PhoneNumberModuleTypeSchema>;

export default PhoneNumberModuleType;
