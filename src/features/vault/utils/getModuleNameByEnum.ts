import ModulesEnum from "../model/ModulesEnum";

function assertNever(x: never): never {
  throw new Error(`Unhandled ModulesEnum: ${String(x)}`);
}

const getModuleNameByEnum = (moduleEnum: ModulesEnum, t: any): string => {
  switch (moduleEnum) {
    case ModulesEnum.CUSTOM_FIELD:
      return t("modules:customField");
    case ModulesEnum.E_MAIL:
      return t("modules:email");
    case ModulesEnum.KEY:
      return t("modules:key");
    case ModulesEnum.NOTE:
      return t("modules:note");
    case ModulesEnum.PASSWORD:
      return t("modules:password");
    case ModulesEnum.TITLE:
      return t("modules:title");
    case ModulesEnum.URL:
      return t("modules:url");
    case ModulesEnum.USERNAME:
      return t("modules:username");
    case ModulesEnum.WIFI:
      return t("modules:wifi");
    case ModulesEnum.DIGITAL_CARD:
      return t("modules:digitalCard");
    case ModulesEnum.TASK:
      return t("modules:task");
    case ModulesEnum.PHONE_NUMBER:
      return t("modules:phoneNumber");
    case ModulesEnum.TOTP:
      return t("modules:totp");
    case ModulesEnum.EXPIRY:
      return t("modules:expiry");
    case ModulesEnum.RECOVERY_CODES:
      return t("modules:recoveryCodes");
    case ModulesEnum.UNKNOWN:
      return t("modules:unknown");
  }
  return assertNever(moduleEnum);
};

export default getModuleNameByEnum;
