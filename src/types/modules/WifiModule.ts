import { z } from "zod";

export const WifiModuleSchema = z.object({
  module: z.string(),
  value: z.string(),
  wifiName: z.string(),
  wifiType: z.string(),
});

type WifiModule = z.infer<typeof WifiModuleSchema>;

export default WifiModule;
