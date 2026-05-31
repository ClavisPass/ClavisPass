import ModulesEnum from "../model/ModulesEnum";
import type ValuesType from "../model/ValuesType";

export function getValueIcon(value: Pick<ValuesType, "modules">): string {
  const modules = value.modules;

  if (modules.some((m) => m.module === ModulesEnum.WIFI)) {
    return "wifi";
  }
  if (modules.some((m) => m.module === ModulesEnum.KEY)) {
    return "key-variant";
  }
  if (modules.some((m) => m.module === ModulesEnum.TASK)) {
    return "checkbox-multiple-marked";
  }
  if (modules.some((m) => m.module === ModulesEnum.DIGITAL_CARD)) {
    return "credit-card-multiple";
  }
  if (
    modules.length > 0 &&
    modules.every((m) => m.module === ModulesEnum.NOTE)
  ) {
    return "note";
  }

  return "lock";
}
