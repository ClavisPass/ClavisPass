import ModulesEnum from "../model/ModulesEnum";
import TemplateEnum from "../model/TemplateEnum";
import ValuesType from "../model/ValuesType";
import createUniqueID from "../../../shared/utils/createUniqueID";
import getModuleData from "./getModuleData";
import { getDateTime } from "../../../shared/utils/Timestamp";

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
  if (template == TemplateEnum.PASSWORD) {
    const username = getModuleData(ModulesEnum.USERNAME);
    const email = getModuleData(ModulesEnum.E_MAIL);
    const password = getModuleData(ModulesEnum.PASSWORD);
    if (username && email && password) {
      value.modules = [username, email, password];
    }
    return value;
  }
  if (template == TemplateEnum.WIFI) {
    const wifi = getModuleData(ModulesEnum.WIFI);
    if (wifi) {
      value.modules = [wifi];
    }
    return value;
  }
  if (template == TemplateEnum.KEY) {
    const key = getModuleData(ModulesEnum.KEY);
    if (key) {
      value.modules = [key];
    }
    return value;
  }
  if (template == TemplateEnum.TASKLIST) {
    const task1 = getModuleData(ModulesEnum.TASK);
    const task2 = getModuleData(ModulesEnum.TASK);
    if (task1 && task2) {
      value.modules = [task1, task2];
    }
    return value;
  }
}

export default getTemplate;
