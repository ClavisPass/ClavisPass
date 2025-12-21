import ModulesEnum from "../model/ModulesEnum";
import { ModuleType } from "../model/ModulesType";
import CustomFieldModuleType from "../model/modules/CustomFieldModuleType";
import DigitalCardModuleType from "../model/modules/DigitalCardModuleType";
import EmailModuleType from "../model/modules/EmailModuleType";
import ExpiryModuleType from "../model/modules/ExpiryModuleType";
import KeyModuleType from "../model/modules/KeyModuleType";
import NoteModuleType from "../model/modules/NoteModuleType";
import PasswordModuleType from "../model/modules/PasswordModuleType";
import PhoneNumberModuleType from "../model/modules/PhoneNumberModuleType";
import TaskModuleType from "../model/modules/TaskModuleType";
import TitleModuleType from "../model/modules/TitleModuleType";
import TotpModuleType from "../model/modules/TotpModuleType";
import URLModuleType from "../model/modules/URLModuleType";
import UsernameModuleType from "../model/modules/UsernameModuleType";
import WifiModuleType from "../model/modules/WifiModuleType";
import createUniqueID from "../../../shared/utils/createUniqueID";
import RecoveryCodesModuleType from "../model/modules/RecoveryCodesModuleType";

type AddableModules = Exclude<ModulesEnum, ModulesEnum.UNKNOWN>;

type ModuleFactory = (id: string) => ModuleType;

const MODULE_DEFAULTS = {
  [ModulesEnum.CUSTOM_FIELD]: (id: string): ModuleType =>
    ({
      id,
      module: ModulesEnum.CUSTOM_FIELD,
      title: "Custom",
      value: "",
    } satisfies CustomFieldModuleType),

  [ModulesEnum.E_MAIL]: (id: string): ModuleType =>
    ({
      id,
      module: ModulesEnum.E_MAIL,
      value: "",
    } satisfies EmailModuleType),

  [ModulesEnum.KEY]: (id: string): ModuleType =>
    ({
      id,
      module: ModulesEnum.KEY,
      value: "",
    } satisfies KeyModuleType),

  [ModulesEnum.NOTE]: (id: string): ModuleType =>
    ({
      id,
      module: ModulesEnum.NOTE,
      value: "",
    } satisfies NoteModuleType),

  [ModulesEnum.PASSWORD]: (id: string): ModuleType =>
    ({
      id,
      module: ModulesEnum.PASSWORD,
      value: "",
    } satisfies PasswordModuleType),

  [ModulesEnum.TITLE]: (id: string): ModuleType =>
    ({
      id,
      module: ModulesEnum.TITLE,
      value: "",
    } satisfies TitleModuleType),

  [ModulesEnum.URL]: (id: string): ModuleType =>
    ({
      id,
      module: ModulesEnum.URL,
      value: "",
    } satisfies URLModuleType),

  [ModulesEnum.USERNAME]: (id: string): ModuleType =>
    ({
      id,
      module: ModulesEnum.USERNAME,
      value: "",
    } satisfies UsernameModuleType),

  [ModulesEnum.WIFI]: (id: string): ModuleType =>
    ({
      id,
      module: ModulesEnum.WIFI,
      value: "",
      wifiName: "",
      wifiType: "WPA",
    } satisfies WifiModuleType),

  [ModulesEnum.DIGITAL_CARD]: (id: string): ModuleType =>
    ({
      id,
      module: ModulesEnum.DIGITAL_CARD,
      value: "",
      type: "QR-Code",
    } satisfies DigitalCardModuleType),

  [ModulesEnum.TASK]: (id: string): ModuleType =>
    ({
      id,
      module: ModulesEnum.TASK,
      value: "",
      completed: false,
    } satisfies TaskModuleType),

  [ModulesEnum.PHONE_NUMBER]: (id: string): ModuleType =>
    ({
      id,
      module: ModulesEnum.PHONE_NUMBER,
      value: "",
    } satisfies PhoneNumberModuleType),

  [ModulesEnum.TOTP]: (id: string): ModuleType =>
    ({
      id,
      module: ModulesEnum.TOTP,
      value: "",
    } satisfies TotpModuleType),

  [ModulesEnum.EXPIRY]: (id: string): ModuleType =>
    ({
      id,
      module: ModulesEnum.EXPIRY,
      value: "",
    } satisfies ExpiryModuleType),

  [ModulesEnum.RECOVERY_CODES]: (id: string): ModuleType =>
    ({
      id,
      module: ModulesEnum.RECOVERY_CODES,
      codes: [],
    } satisfies RecoveryCodesModuleType),
} satisfies Record<AddableModules, ModuleFactory>;

function getModuleData(module: ModulesEnum): ModuleType {
  const id = createUniqueID();

  const factory = MODULE_DEFAULTS[module as AddableModules];
  if (factory) return factory(id);

  return {
    id,
    module: ModulesEnum.UNKNOWN,
    value: "",
  } as ModuleType;
}

export default getModuleData;
