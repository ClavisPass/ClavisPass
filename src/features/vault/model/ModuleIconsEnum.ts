import ModulesEnum from "./ModulesEnum";

export type IconName = string;

export const MODULE_ICON = {
  [ModulesEnum.ADDRESS]: "map-marker",
  [ModulesEnum.ATTACHMENT]: "paperclip",
  [ModulesEnum.COMPANY]: "office-building",
  [ModulesEnum.CREDIT_CARD]: "credit-card-chip",
  [ModulesEnum.CUSTOM_FIELD]: "card-text",
  [ModulesEnum.DOCUMENT]: "card-account-details",
  [ModulesEnum.E_MAIL]: "email",
  [ModulesEnum.KEY]: "key-variant",
  [ModulesEnum.NOTE]: "note",
  [ModulesEnum.PASSWORD]: "form-textbox-password",
  [ModulesEnum.PERSON]: "account-details",
  [ModulesEnum.PIN]: "dialpad",
  [ModulesEnum.URL]: "web",
  [ModulesEnum.USERNAME]: "account",
  [ModulesEnum.WIFI]: "wifi",
  [ModulesEnum.DIGITAL_CARD]: "credit-card",
  [ModulesEnum.TASK]: "checkbox-marked",
  [ModulesEnum.PHONE_NUMBER]: "phone",
  [ModulesEnum.TOTP]: "two-factor-authentication",
  [ModulesEnum.EXPIRY]: "calendar",
  [ModulesEnum.RECOVERY_CODES]: "list-status",
  [ModulesEnum.TITLE]: "format-title",
  [ModulesEnum.UNKNOWN]: "help-circle",
} satisfies Record<ModulesEnum, IconName>;
