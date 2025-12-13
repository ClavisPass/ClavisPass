import { z } from "zod";

import ModulesEnum from "../ModulesEnum";
import { DIGITAL_CARD_TYPES } from "../DigitalCardType";

const regex = new RegExp(ModulesEnum.DIGITAL_CARD);

export const DigitalCardModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
  type: z.enum(DIGITAL_CARD_TYPES),
});

type DigitalCardModuleType = z.infer<typeof DigitalCardModuleTypeSchema>;

export default DigitalCardModuleType;
