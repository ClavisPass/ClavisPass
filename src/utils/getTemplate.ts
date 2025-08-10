import ModulesEnum from "../enums/ModulesEnum";
import TemplateEnum from "../enums/TemplateEnum";
import ValuesType from "../types/ValuesType";
import createUniqueID from "./createUniqueID";
import getModuleData from "./getModuleData";
import { getDateTime } from "./Timestamp";

function getTemplate(template: TemplateEnum) {
  const dateTime = getDateTime();
  let value: ValuesType = {
    id: createUniqueID(),
    title: "",
    modules: [],
    folder: "",
    fav: false,
    created: dateTime,
    lastUpdated: dateTime,
  };
  if (template == TemplateEnum.BLANK) {
    return value;
  }
  if (template == TemplateEnum.DIGITAL_CARD) {
    const digitalCard = getModuleData(ModulesEnum.DIGITAL_CARD);
    if (digitalCard) {
      value.modules = [digitalCard];
    }
    return value;
  }
  const note = getModuleData(ModulesEnum.NOTE);
  if (template == TemplateEnum.PASSWORD) {
    const username = getModuleData(ModulesEnum.USERNAME);
    const email = getModuleData(ModulesEnum.E_MAIL);
    const password = getModuleData(ModulesEnum.PASSWORD);
    if (username && email && password && note) {
      value.modules = [username, email, password, note];
    }
    return value;
  }
  if (template == TemplateEnum.WIFI) {
    const wifi = getModuleData(ModulesEnum.WIFI);
    if (wifi && note) {
      value.modules = [wifi, note];
    }
    return value;
  }
  if (template == TemplateEnum.KEY) {
    const key = getModuleData(ModulesEnum.KEY);
    if (key && note) {
      value.modules = [key, note];
    }
    return value;
  }
}

export default getTemplate;
