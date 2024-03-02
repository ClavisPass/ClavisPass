import { z } from "zod";

export const URLModuleSchema = z.object({
  module: z.string(),
  value: z.string(),
});

type URLModule = z.infer<typeof URLModuleSchema>;

export default URLModule;
