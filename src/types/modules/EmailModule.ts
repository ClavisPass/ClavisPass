import { z } from "zod";

export const EmnailModuleSchema = z.object({
  module: z.string(),
  value: z.string(),
});

type EmailModule = z.infer<typeof EmnailModuleSchema>;

export default EmailModule;
