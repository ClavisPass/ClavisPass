import ModulesEnum from "../model/ModulesEnum";
import ModulesType from "../model/ModulesType";

function predictNextModule(modules: ModulesType) {
  const lastModule = modules[modules.length - 1];
  if (!lastModule) {
    return null;
  }
  const hasModule = (module: ModulesEnum) =>
    modules.some((item) => item.module === module);
  const moduleValue = lastModule.module;
  if (moduleValue === ModulesEnum.TASK) {
    return ModulesEnum.TASK;
  }
  if (moduleValue === ModulesEnum.TOTP) {
    return ModulesEnum.RECOVERY_CODES;
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
  if (moduleValue === ModulesEnum.PERSON) {
    if (!hasModule(ModulesEnum.ADDRESS)) {
      return ModulesEnum.ADDRESS;
    }
  }
  if (moduleValue === ModulesEnum.ADDRESS) {
    if (!hasModule(ModulesEnum.PHONE_NUMBER)) {
      return ModulesEnum.PHONE_NUMBER;
    }
  }
  if (moduleValue === ModulesEnum.PHONE_NUMBER) {
    if (!hasModule(ModulesEnum.E_MAIL)) {
      return ModulesEnum.E_MAIL;
    }
  }
  if (moduleValue === ModulesEnum.COMPANY) {
    if (!hasModule(ModulesEnum.ADDRESS)) {
      return ModulesEnum.ADDRESS;
    }
  }
  if (moduleValue === ModulesEnum.DOCUMENT) {
    if (!hasModule(ModulesEnum.EXPIRY)) {
      return ModulesEnum.EXPIRY;
    }
    if (!hasModule(ModulesEnum.ATTACHMENT)) {
      return ModulesEnum.ATTACHMENT;
    }
  }
  if (moduleValue === ModulesEnum.EXPIRY) {
    if (hasModule(ModulesEnum.DOCUMENT) && !hasModule(ModulesEnum.ATTACHMENT)) {
      return ModulesEnum.ATTACHMENT;
    }
  }
  if (moduleValue === ModulesEnum.CREDIT_CARD) {
    if (!hasModule(ModulesEnum.EXPIRY)) {
      return ModulesEnum.EXPIRY;
    }
  }
  if (moduleValue === ModulesEnum.ATTACHMENT) {
    if (!hasModule(ModulesEnum.NOTE)) {
      return ModulesEnum.NOTE;
    }
  }
  if (moduleValue === ModulesEnum.RECOVERY_CODES) {
    if (!hasModule(ModulesEnum.NOTE)) {
      return ModulesEnum.NOTE;
    }
  }
  if (moduleValue === ModulesEnum.WIFI) {
    if (!hasModule(ModulesEnum.NOTE)) {
      return ModulesEnum.NOTE;
    }
  }
  if (moduleValue === ModulesEnum.DIGITAL_CARD) {
    if (!hasModule(ModulesEnum.EXPIRY)) {
      return ModulesEnum.EXPIRY;
    }
  }
  return null;
}
export default predictNextModule;
