import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.TITLE);

export const TitleModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
});

type TitleModuleType = z.infer<typeof TitleModuleTypeSchema>;

export default TitleModuleType;
