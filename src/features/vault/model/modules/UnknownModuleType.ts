import { z } from "zod";

export const UnknownModuleTypeSchema = z
  .object({
    id: z.string(),
    module: z.string().min(1),
  })
  .passthrough();

type UnknownModuleType = z.infer<typeof UnknownModuleTypeSchema>;

export default UnknownModuleType;