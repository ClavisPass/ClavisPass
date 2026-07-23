import { z } from "zod";

import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.DOCUMENT);

export const DocumentModuleTypeSchema = z.object({
  id: z.string(),
  module: z.string().regex(regex),
  documentType: z.string().optional(),
  number: z.string().optional(),
  issuer: z.string().optional(),
});

type DocumentModuleType = z.infer<typeof DocumentModuleTypeSchema>;

export default DocumentModuleType;
