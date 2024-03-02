import { z } from "zod";

export const KeyModuleSchema = z.object({
  module: z.string(),
  value: z.string(),
});

type KeyModule = z.infer<typeof KeyModuleSchema>;

export default KeyModule;
