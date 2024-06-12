import { z } from "zod";

import ModulesEnum from "../../enums/ModulesEnum";
import WifiTypeEnum from "../../enums/WifiTypeEnum";

const regex = new RegExp(ModulesEnum.WIFI);

export const WifiModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
  wifiName: z.string(),
  wifiType: z.enum(["WEP", "WPA", "blank"]),
});

type WifiModuleType = z.infer<typeof WifiModuleTypeSchema>;

export default WifiModuleType;
