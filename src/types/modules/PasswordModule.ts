import { z } from "zod";

export const PasswordModuleSchema = z.object({
  module: z.string(),
  value: z.string(),
});

type PasswordModule = z.infer<typeof PasswordModuleSchema>;

export default PasswordModule;
