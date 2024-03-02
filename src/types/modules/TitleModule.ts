import { z } from "zod";

export const TitleModuleSchema = z.object({
  module: z.string(),
  value: z.string(),
});

type TitleModule = z.infer<typeof TitleModuleSchema>;

export default TitleModule;
