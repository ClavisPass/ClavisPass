import { z } from "zod";

import ModulesEnum from "../../enums/ModulesEnum";

const regex = new RegExp(ModulesEnum.WIFI);

export const WifiModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
  wifiName: z.string(),
  wifiType: z.string(),
});

type WifiModuleType = z.infer<typeof WifiModuleTypeSchema>;

export default WifiModuleType;
