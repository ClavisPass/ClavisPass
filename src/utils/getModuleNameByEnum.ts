import ModulesEnum from "../enums/ModulesEnum";

const getModuleNameByEnum = (moduleEnum: ModulesEnum): string => {
  switch (moduleEnum) {
    case ModulesEnum.CUSTOM_FIELD:
      return "Custom Field";
    case ModulesEnum.E_MAIL:
      return "E-Mail";
    case ModulesEnum.KEY:
      return "Key";
    case ModulesEnum.NOTE:
      return "Note";
    case ModulesEnum.PASSWORD:
      return "Password";
    case ModulesEnum.TITLE:
      return "Title";
    case ModulesEnum.URL:
      return "URL";
    case ModulesEnum.USERNAME:
      return "Username";
    case ModulesEnum.WIFI:
      return "WiFi";
    case ModulesEnum.DIGITAL_CARD:
      return "Digital Card";
    case ModulesEnum.TASK:
      return "Task";
    case ModulesEnum.PHONE_NUMBER:
      return "Phone Number";
    case ModulesEnum.TOTP:
      return "TOTP";
    case ModulesEnum.EXPIRY:
      return "Expiry";
    case ModulesEnum.UNKNOWN:
      return "Unknown";
    default:
      return "Unknown";
  }
};

export default getModuleNameByEnum;
