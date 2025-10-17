import ModulesEnum from "../enums/ModulesEnum";
import ModulesType from "../types/ModulesType";

function predictNextModule(modules: ModulesType) {
  const lastModule = modules[modules.length - 1];
  if (!lastModule) {
    return null;
  }
  const moduleValue = lastModule.module;
  if (moduleValue === ModulesEnum.TASK) {
    return ModulesEnum.TASK;
  }
  if (moduleValue === ModulesEnum.USERNAME) {
    const secondLastModule = modules[modules.length - 2];
    const moduleValue = secondLastModule?.module;
    if (moduleValue === ModulesEnum.PASSWORD) {
      return ModulesEnum.URL;
    }
    return ModulesEnum.PASSWORD;
  }
  if (moduleValue === ModulesEnum.E_MAIL) {
    const secondLastModule = modules[modules.length - 2];
    const moduleValue = secondLastModule?.module;
    if (moduleValue === ModulesEnum.PASSWORD) {
      return ModulesEnum.URL;
    }
    return ModulesEnum.PASSWORD;
  }
  if (moduleValue === ModulesEnum.PASSWORD) {
    const eMailResult = modules.filter(
      (module) => module.module === ModulesEnum.E_MAIL
    );
    const usernameResult = modules.filter(
      (module) => module.module === ModulesEnum.USERNAME
    );
    if (eMailResult.length == 0 && usernameResult.length == 0) {
      return ModulesEnum.E_MAIL;
    }
    const urlResult = modules.filter(
      (module) => module.module === ModulesEnum.URL
    );
    if (urlResult.length == 0) {
      return ModulesEnum.URL;
    }
    const noteResult = modules.filter(
      (module) => module.module === ModulesEnum.NOTE
    );
    if (noteResult.length == 0) {
      return ModulesEnum.NOTE;
    }
  }
  if (moduleValue === ModulesEnum.URL) {
    const noteResult = modules.filter(
      (module) => module.module === ModulesEnum.NOTE
    );
    if (noteResult.length == 0) {
      return ModulesEnum.NOTE;
    }
  }
  if (moduleValue === ModulesEnum.KEY) {
    const urlResult = modules.filter(
      (module) => module.module === ModulesEnum.URL
    );
    if (urlResult.length == 0) {
      return ModulesEnum.URL;
    }
  }
  return null;
}
export default predictNextModule;
