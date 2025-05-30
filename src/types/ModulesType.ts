import { z } from "zod";
import { CustomFieldModuleTypeSchema } from "./modules/CustomFieldModuleType";
import { EmnailModuleTypeSchema } from "./modules/EmailModuleType";
import { KeyModuleTypeSchema } from "./modules/KeyModuleType";
import { NoteModuleTypeSchema } from "./modules/NoteModuleType";
import { PasswordModuleTypeSchema } from "./modules/PasswordModuleType";
import { TitleModuleTypeSchema } from "./modules/TitleModuleType";
import { URLModuleTypeSchema } from "./modules/URLModuleType";
import { UsernameModuleTypeSchema } from "./modules/UsernameModuleType";
import { WifiModuleTypeSchema } from "./modules/WifiModuleType";

export const ModuleTypeSchema = CustomFieldModuleTypeSchema.or(
  EmnailModuleTypeSchema
)
  .or(KeyModuleTypeSchema)
  .or(NoteModuleTypeSchema)
  .or(PasswordModuleTypeSchema)
  .or(TitleModuleTypeSchema)
  .or(URLModuleTypeSchema)
  .or(UsernameModuleTypeSchema)
  .or(WifiModuleTypeSchema);

export type ModuleType = z.infer<typeof ModuleTypeSchema>;

export const ModulesTypeSchema = z.array(ModuleTypeSchema);

type ModulesType = z.infer<typeof ModulesTypeSchema>;

export default ModulesType;
