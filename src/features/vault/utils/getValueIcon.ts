import ModulesEnum from "../model/ModulesEnum";
import { MODULE_ICON } from "../model/ModuleIconsEnum";
import type ValuesType from "../model/ValuesType";

export function getValueIcon(value: Pick<ValuesType, "modules">): string {
  const modules = value.modules;
  const containsOnly = (...moduleNames: ModulesEnum[]) =>
    modules.length > 0 &&
    modules.every((m) => moduleNames.includes(m.module as ModulesEnum));

  if (modules.some((m) => m.module === ModulesEnum.WIFI)) {
    return MODULE_ICON[ModulesEnum.WIFI];
  }
  if (modules.some((m) => m.module === ModulesEnum.KEY)) {
    return MODULE_ICON[ModulesEnum.KEY];
  }
  if (modules.some((m) => m.module === ModulesEnum.TASK)) {
    return "checkbox-multiple-marked";
  }
  if (modules.some((m) => m.module === ModulesEnum.DIGITAL_CARD)) {
    return "credit-card-multiple";
  }
  if (containsOnly(ModulesEnum.PIN)) {
    return MODULE_ICON[ModulesEnum.PIN];
  }
  if (containsOnly(ModulesEnum.E_MAIL)) {
    return MODULE_ICON[ModulesEnum.E_MAIL];
  }
  if (containsOnly(ModulesEnum.USERNAME)) {
    return MODULE_ICON[ModulesEnum.USERNAME];
  }
  if (containsOnly(ModulesEnum.PHONE_NUMBER)) {
    return MODULE_ICON[ModulesEnum.PHONE_NUMBER];
  }
  if (
    modules.some((m) => m.module === ModulesEnum.TOTP) &&
    containsOnly(ModulesEnum.TOTP, ModulesEnum.RECOVERY_CODES)
  ) {
    return MODULE_ICON[ModulesEnum.TOTP];
  }
  if (modules.some((m) => m.module === ModulesEnum.EXPIRY)) {
    return MODULE_ICON[ModulesEnum.EXPIRY];
  }
  if (modules.some((m) => m.module === ModulesEnum.RECOVERY_CODES)) {
    return MODULE_ICON[ModulesEnum.RECOVERY_CODES];
  }
  if (modules.some((m) => m.module === ModulesEnum.CUSTOM_FIELD)) {
    return MODULE_ICON[ModulesEnum.CUSTOM_FIELD];
  }
  if (containsOnly(ModulesEnum.NOTE)) {
    return MODULE_ICON[ModulesEnum.NOTE];
  }

  return "lock";
}
