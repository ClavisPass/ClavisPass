import ModulesEnum from "../enums/ModulesEnum";
import FastAccessType from "../types/FastAccessType";
import EmailModuleType from "../types/modules/EmailModuleType";
import UsernameModuleType from "../types/modules/UsernameModuleType";
import WifiModuleType from "../types/modules/WifiModuleType";
import ModulesType from "../types/ModulesType";

const extractFastAccessObject = (modules: ModulesType, title: string) => {
  let username = "";
  let password = "";
  for (const module of modules) {
    if (module.module === ModulesEnum.USERNAME && username === "") {
      username = (module as UsernameModuleType).value;
    }
    if (module.module === ModulesEnum.E_MAIL && username === "") {
      username = (module as EmailModuleType).value;
    }
    if (module.module === ModulesEnum.PASSWORD && password === "") {
      password = (module as UsernameModuleType).value;
    }
    if (module.module === ModulesEnum.WIFI) {
      const wifiModule = module as WifiModuleType;
      if (username === "" || password === "") {
        username = wifiModule.wifiName;
        password = wifiModule.value;
      }
    }
    if (username !== "" && password !== "") {
      break;
    }
  }
  const fastAccessObject: FastAccessType = {
    title: title,
    username: username,
    password: password,
  };
  return fastAccessObject;
};

export default extractFastAccessObject;
