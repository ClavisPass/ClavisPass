import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.COMPANY);

export const CompanyModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  name: z.string().optional(),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
});

type CompanyModuleType = z.infer<typeof CompanyModuleTypeSchema>;

export default CompanyModuleType;
