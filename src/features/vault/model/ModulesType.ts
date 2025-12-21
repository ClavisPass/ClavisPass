import { z } from "zod";
import ModulesEnum from "../model/ModulesEnum";

import { CustomFieldModuleTypeSchema } from "./modules/CustomFieldModuleType";
import { EmnailModuleTypeSchema } from "./modules/EmailModuleType";
import { KeyModuleTypeSchema } from "./modules/KeyModuleType";
import { NoteModuleTypeSchema } from "./modules/NoteModuleType";
import { PasswordModuleTypeSchema } from "./modules/PasswordModuleType";
import { TitleModuleTypeSchema } from "./modules/TitleModuleType";
import { URLModuleTypeSchema } from "./modules/URLModuleType";
import { UsernameModuleTypeSchema } from "./modules/UsernameModuleType";
import { WifiModuleTypeSchema } from "./modules/WifiModuleType";
import { TaskModuleTypeSchema } from "./modules/TaskModuleType";
import { DigitalCardModuleTypeSchema } from "./modules/DigitalCardModuleType";
import { UnknownModuleTypeSchema } from "./modules/UnknownModuleType";
import { PhoneNumberModuleTypeSchema } from "./modules/PhoneNumberModuleType";
import { TotpModuleTypeSchema } from "./modules/TotpModuleType";
import { ExpiryModuleTypeSchema } from "./modules/ExpiryModuleType";
import { RecoveryCodesModuleTypeSchema } from "./modules/RecoveryCodesModuleType";

const MODULE_SCHEMA_BY_ENUM = {
  [ModulesEnum.CUSTOM_FIELD]: CustomFieldModuleTypeSchema,
  [ModulesEnum.E_MAIL]: EmnailModuleTypeSchema,
  [ModulesEnum.KEY]: KeyModuleTypeSchema,
  [ModulesEnum.NOTE]: NoteModuleTypeSchema,
  [ModulesEnum.PASSWORD]: PasswordModuleTypeSchema,
  [ModulesEnum.TITLE]: TitleModuleTypeSchema,
  [ModulesEnum.URL]: URLModuleTypeSchema,
  [ModulesEnum.USERNAME]: UsernameModuleTypeSchema,
  [ModulesEnum.WIFI]: WifiModuleTypeSchema,
  [ModulesEnum.DIGITAL_CARD]: DigitalCardModuleTypeSchema,
  [ModulesEnum.TASK]: TaskModuleTypeSchema,
  [ModulesEnum.PHONE_NUMBER]: PhoneNumberModuleTypeSchema,
  [ModulesEnum.TOTP]: TotpModuleTypeSchema,
  [ModulesEnum.EXPIRY]: ExpiryModuleTypeSchema,
  [ModulesEnum.RECOVERY_CODES]: RecoveryCodesModuleTypeSchema,
  [ModulesEnum.UNKNOWN]: UnknownModuleTypeSchema,
} satisfies Record<ModulesEnum, z.ZodTypeAny>;

const MODULE_SCHEMAS = Object.values(MODULE_SCHEMA_BY_ENUM) as unknown as [
  z.ZodTypeAny,
  z.ZodTypeAny,
  ...z.ZodTypeAny[],
];

export const ModuleTypeSchema = z.union(MODULE_SCHEMAS);

export type ModuleType = z.infer<typeof ModuleTypeSchema>;

export const ModulesTypeSchema = z.array(ModuleTypeSchema);
type ModulesType = z.infer<typeof ModulesTypeSchema>;

export default ModulesType;
