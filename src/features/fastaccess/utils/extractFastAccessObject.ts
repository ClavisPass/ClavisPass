import ModulesEnum from "../../vault/model/ModulesEnum";
import FastAccessType from "../model/FastAccessType";
import EmailModuleType from "../../vault/model/modules/EmailModuleType";
import UsernameModuleType from "../../vault/model/modules/UsernameModuleType";
import WifiModuleType from "../../vault/model/modules/WifiModuleType";
import ModulesType from "../../vault/model/ModulesType";

const extractFastAccessObject = (modules: ModulesType, title: string) => {
  let username = "";
  let usernameId = "";
  let password = "";
  let passwordId = "";
  for (const module of modules) {
    if (module.module === ModulesEnum.USERNAME && username === "") {
      username = (module as UsernameModuleType).value;
      usernameId = (module as UsernameModuleType).id;
    }
    if (module.module === ModulesEnum.E_MAIL && username === "") {
      username = (module as EmailModuleType).value;
      usernameId = (module as EmailModuleType).id;
    }
    if (module.module === ModulesEnum.PASSWORD && password === "") {
      password = (module as UsernameModuleType).value;
      passwordId = (module as UsernameModuleType).id;
    }
    if (module.module === ModulesEnum.WIFI) {
      const wifiModule = module as WifiModuleType;
      if (username === "" || password === "") {
        username = wifiModule.wifiName;
        usernameId = wifiModule.id;
        password = wifiModule.value;
        passwordId = wifiModule.id;
      }
    }
    if (username !== "" && password !== "") {
      break;
    }
  }
  if (username === "" || password === "") {
    return null;
  }
  const fastAccessObject: FastAccessType = {
    title: title,
    username: username,
    usernameId: usernameId,
    password: password,
    passwordId: passwordId,
  };
  return fastAccessObject;
};

export default extractFastAccessObject;
