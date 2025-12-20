// RecoveryCodesModuleType.ts
import { z } from "zod";
import ModulesEnum from "../ModulesEnum";

const regex = new RegExp(ModulesEnum.RECOVERY_CODES);

export const RecoveryCodeSchema = z.object({
  code: z.string().min(1),
  used: z.boolean().default(false),
});

export const RecoveryCodesModuleTypeSchema = z
  .object({
    id: z.string(),
    module: z.string().regex(regex),
    codes: z.array(RecoveryCodeSchema).default([]),
  })
  .passthrough();

type RecoveryCodesModuleType = z.infer<typeof RecoveryCodesModuleTypeSchema>;
export default RecoveryCodesModuleType;
