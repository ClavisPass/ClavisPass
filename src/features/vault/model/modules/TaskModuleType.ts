import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.TASK);

export const TaskModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  value: z.string(),
  completed: z.boolean(),
});

type TaskModuleType = z.infer<typeof TaskModuleTypeSchema>;

export default TaskModuleType;
