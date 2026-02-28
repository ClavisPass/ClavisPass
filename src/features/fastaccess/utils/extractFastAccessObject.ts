import ModulesEnum from "../../vault/model/ModulesEnum";
import FastAccessType from "../model/FastAccessType";
import EmailModuleType from "../../vault/model/modules/EmailModuleType";
import UsernameModuleType from "../../vault/model/modules/UsernameModuleType";
import WifiModuleType from "../../vault/model/modules/WifiModuleType";
import PasswordModuleType from "../../vault/model/modules/PasswordModuleType";
import ModulesType from "../../vault/model/ModulesType";

const extractFastAccessObject = (modules: ModulesType, title: string) => {
  let username = "";
  let usernameId = "";
  let password = "";
  let passwordId = "";

  for (const module of modules) {
    if (module.module === ModulesEnum.USERNAME && !username) {
      const m = module as UsernameModuleType;
      username = m.value;
      usernameId = m.id;
      continue;
    }

    if (module.module === ModulesEnum.E_MAIL && !username) {
      const m = module as EmailModuleType;
      username = m.value;
      usernameId = m.id;
      continue;
    }

    if (module.module === ModulesEnum.PASSWORD && !password) {
      const m = module as PasswordModuleType; // <- wichtig
      password = m.value;
      passwordId = m.id;
      continue;
    }

    if (module.module === ModulesEnum.WIFI) {
      const m = module as WifiModuleType;
      // nur auffüllen, wenn noch was fehlt
      if (!username) {
        username = m.wifiName;
        usernameId = m.id;
      }
      if (!password) {
        password = m.value;
        passwordId = m.id;
      }
    }

    if (username && password) break;
  }

  if (!username || !password) return null;

  const fastAccessObject: FastAccessType = {
    title,
    username,
    usernameId,
    password,
    passwordId,
  };

  return fastAccessObject;
};

export default extractFastAccessObject;