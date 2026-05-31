import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.CUSTOM_FIELD);

export const CustomFieldModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  title: z.string(),
  value: z.string(),
  inputType: z.enum(["text", "secret", "number"]).optional(),
});

type CustomFieldModuleType = z.infer<typeof CustomFieldModuleTypeSchema>;

export default CustomFieldModuleType;
