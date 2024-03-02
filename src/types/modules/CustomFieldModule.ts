import { z } from "zod";

export const CustomFieldModuleSchema = z.object({
  module: z.string(),
  value: z.string(),
});

type CustomFieldModule = z.infer<typeof CustomFieldModuleSchema>;

export default CustomFieldModule;
