import { z } from "zod";

export const UsernameModuleSchema = z.object({
  module: z.string(),
  value: z.string(),
});

type UsernameModule = z.infer<typeof UsernameModuleSchema>;

export default UsernameModule;
