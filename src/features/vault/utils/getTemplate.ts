import ModulesEnum from "../model/ModulesEnum";
import TemplateEnum from "../model/TemplateEnum";
import ValuesType from "../model/ValuesType";
import createUniqueID from "../../../shared/utils/createUniqueID";
import getModuleData from "./getModuleData";
import { getDateTime } from "../../../shared/utils/Timestamp";

function getModules(...modules: ModulesEnum[]) {
  return modules.map((module) => getModuleData(module));
}

function getTemplate(template: TemplateEnum) {
  const dateTime = getDateTime();
  let value: ValuesType = {
    id: createUniqueID(),
    title: "",
    modules: [],
    folder: null,
    fav: false,
    created: dateTime,
    lastUpdated: dateTime,
  };
  if (template == TemplateEnum.DIGITAL_CARD) {
    value.modules = getModules(ModulesEnum.DIGITAL_CARD);
    return value;
  }
  if (template == TemplateEnum.PASSWORD) {
    value.modules = getModules(
      ModulesEnum.USERNAME,
      ModulesEnum.E_MAIL,
      ModulesEnum.PASSWORD,
    );
    return value;
  }
  if (template == TemplateEnum.WIFI) {
    value.modules = getModules(ModulesEnum.WIFI);
    return value;
  }
  if (template == TemplateEnum.KEY) {
    value.modules = getModules(ModulesEnum.KEY);
    return value;
  }
  if (template == TemplateEnum.TASKLIST) {
    value.modules = getModules(ModulesEnum.TASK, ModulesEnum.TASK);
    return value;
  }
  if (template == TemplateEnum.NOTE) {
    value.modules = getModules(ModulesEnum.NOTE);
    return value;
  }
  if (template == TemplateEnum.TWO_FACTOR) {
    value.modules = getModules(ModulesEnum.TOTP, ModulesEnum.RECOVERY_CODES);
    return value;
  }
  if (template == TemplateEnum.IDENTITY) {
    value.modules = getModules(
      ModulesEnum.PERSON,
      ModulesEnum.ADDRESS,
      ModulesEnum.PHONE_NUMBER,
      ModulesEnum.E_MAIL,
      ModulesEnum.COMPANY,
    );
    return value;
  }
  if (template == TemplateEnum.DOCUMENT) {
    value.modules = getModules(
      ModulesEnum.DOCUMENT,
      ModulesEnum.EXPIRY,
      ModulesEnum.ATTACHMENT,
      ModulesEnum.NOTE,
    );
    return value;
  }
  if (template == TemplateEnum.CREDIT_CARD) {
    value.modules = getModules(
      ModulesEnum.CREDIT_CARD,
      ModulesEnum.EXPIRY,
      ModulesEnum.NOTE,
    );
    return value;
  }
  if (template == TemplateEnum.BANK_ACCOUNT) {
    value.modules = getModules(
      ModulesEnum.TITLE,
      ModulesEnum.URL,
      ModulesEnum.USERNAME,
      ModulesEnum.PASSWORD,
      ModulesEnum.NOTE,
    );
    return value;
  }
  return value;
}

export default getTemplate;
