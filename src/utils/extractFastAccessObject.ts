import ModulesEnum from "../enums/ModulesEnum";
import FastAccessType from "../types/FastAccessType";
import EmailModuleType from "../types/modules/EmailModuleType";
import UsernameModuleType from "../types/modules/UsernameModuleType";
import WifiModuleType from "../types/modules/WifiModuleType";
import ModulesType from "../types/ModulesType";

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
