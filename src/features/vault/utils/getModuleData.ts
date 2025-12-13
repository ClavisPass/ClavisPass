import ModulesEnum from "../model/ModulesEnum";
import { ModuleType } from "../model/ModulesType";
import CustomFieldModuleType from "../model/modules/CustomFieldModuleType";
import DigitalCardModuleType from "../model/modules/DigitalCardModuleType";
import EmailModuleType from "../model/modules/EmailModuleType";
import ExpiryModuleType from "../model/modules/ExpiryModuleType";
import KeyModuleType from "../model/modules/KeyModuleType";
import NoteModuleType from "../model/modules/NoteModuleType";
import PasswordModuleType from "../model/modules/PasswordModuleType";
import PhoneNumberModuleType from "../model/modules/PhoneNumberModuleType";
import TaskModuleType from "../model/modules/TaskModuleType";
import TitleModuleType from "../model/modules/TitleModuleType";
import TotpModuleType from "../model/modules/TotpModuleType";
import URLModuleType from "../model/modules/URLModuleType";
import UsernameModuleType from "../model/modules/UsernameModuleType";
import WifiModuleType from "../model/modules/WifiModuleType";
import createUniqueID from "../../../shared/utils/createUniqueID";

function getModuleData(module: ModulesEnum) {
  const id = createUniqueID();
  if (module === ModulesEnum.CUSTOM_FIELD) {
    const moduleData: CustomFieldModuleType = {
      id: id,
      module: module,
      title: "Custom",
      value: "",
    };
    return moduleData as ModuleType;
  }
  if (module === ModulesEnum.E_MAIL) {
    const moduleData: EmailModuleType = {
      id: id,
      module: module,
      value: "",
    };
    return moduleData as ModuleType;
  }
  if (module === ModulesEnum.KEY) {
    const moduleData: KeyModuleType = {
      id: id,
      module: module,
      value: "",
    };
    return moduleData as ModuleType;
  }
  if (module === ModulesEnum.NOTE) {
    const moduleData: NoteModuleType = {
      id: id,
      module: module,
      value: "",
    };
    return moduleData as ModuleType;
  }
  if (module === ModulesEnum.PASSWORD) {
    const moduleData: PasswordModuleType = {
      id: id,
      module: module,
      value: "",
    };
    return moduleData as ModuleType;
  }
  if (module === ModulesEnum.TITLE) {
    const moduleData: TitleModuleType = {
      id: id,
      module: module,
      value: "",
    };
    return moduleData as ModuleType;
  }
  if (module === ModulesEnum.URL) {
    const moduleData: URLModuleType = {
      id: id,
      module: module,
      value: "",
    };
    return moduleData as ModuleType;
  }
  if (module === ModulesEnum.USERNAME) {
    const moduleData: UsernameModuleType = {
      id: id,
      module: module,
      value: "",
    };
    return moduleData as ModuleType;
  }
  if (module === ModulesEnum.WIFI) {
    const moduleData: WifiModuleType = {
      id: id,
      module: module,
      value: "",
      wifiName: "",
      wifiType: "WPA",
    };
    return moduleData as ModuleType;
  }
  if (module === ModulesEnum.DIGITAL_CARD) {
    const moduleData: DigitalCardModuleType = {
      id: id,
      module: module,
      value: "",
      type: "QR-Code",
    };
    return moduleData as ModuleType;
  }
  if (module === ModulesEnum.TASK) {
    const moduleData: TaskModuleType = {
      id: id,
      module: module,
      value: "",
      completed: false,
    };
    return moduleData as ModuleType;
  }
  if (module === ModulesEnum.PHONE_NUMBER) {
    const moduleData: PhoneNumberModuleType = {
      id: id,
      module: module,
      value: "",
    };
    return moduleData as ModuleType;
  }
  if (module === ModulesEnum.TOTP) {
    const moduleData: TotpModuleType = {
      id: id,
      module: module,
      value: "",
    };
    return moduleData as ModuleType;
  }
  if (module === ModulesEnum.EXPIRY) {
    const moduleData: ExpiryModuleType = {
      id: id,
      module: module,
      value: "",
    };
    return moduleData as ModuleType;
  }
}

export default getModuleData;
