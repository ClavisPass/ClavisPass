import ModulesEnum from "./ModulesEnum";

export type IconName = string;

export const MODULE_ICON = {
  [ModulesEnum.ADDRESS]: "map-marker-outline",
  [ModulesEnum.ATTACHMENT]: "paperclip",
  [ModulesEnum.COMPANY]: "office-building-outline",
  [ModulesEnum.CREDIT_CARD]: "credit-card-chip-outline",
  [ModulesEnum.CUSTOM_FIELD]: "card-text-outline",
  [ModulesEnum.DOCUMENT]: "card-account-details-outline",
  [ModulesEnum.E_MAIL]: "email-outline",
  [ModulesEnum.KEY]: "key-variant",
  [ModulesEnum.NOTE]: "note-outline",
  [ModulesEnum.PASSWORD]: "form-textbox-password",
  [ModulesEnum.PERSON]: "account-details-outline",
  [ModulesEnum.PIN]: "dialpad",
  [ModulesEnum.URL]: "web",
  [ModulesEnum.USERNAME]: "account-outline",
  [ModulesEnum.WIFI]: "wifi",
  [ModulesEnum.DIGITAL_CARD]: "credit-card-outline",
  [ModulesEnum.TASK]: "checkbox-outline",
  [ModulesEnum.PHONE_NUMBER]: "phone-outline",
  [ModulesEnum.TOTP]: "two-factor-authentication",
  [ModulesEnum.EXPIRY]: "calendar-outline",
  [ModulesEnum.RECOVERY_CODES]: "list-status",
  [ModulesEnum.TITLE]: "format-title",
  [ModulesEnum.UNKNOWN]: "help-circle-outline",
} satisfies Record<ModulesEnum, IconName>;
