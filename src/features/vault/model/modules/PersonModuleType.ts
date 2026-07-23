import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.PERSON);

export const PersonModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  displayName: z.string().optional(),
  username: z.string().optional(),
  title: z.string().optional(),
});

type PersonModuleType = z.infer<typeof PersonModuleTypeSchema>;

export default PersonModuleType;
