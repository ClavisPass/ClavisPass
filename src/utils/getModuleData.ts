import ModulesEnum from "../enums/ModulesEnum";
import { ModuleType } from "../types/ModulesType";
import CustomFieldModuleType from "../types/modules/CustomFieldModuleType";
import DigitalCardModuleType from "../types/modules/DigitalCardModuleType";
import EmailModuleType from "../types/modules/EmailModuleType";
import KeyModuleType from "../types/modules/KeyModuleType";
import NoteModuleType from "../types/modules/NoteModuleType";
import PasswordModuleType from "../types/modules/PasswordModuleType";
import TitleModuleType from "../types/modules/TitleModuleType";
import URLModuleType from "../types/modules/URLModuleType";
import UsernameModuleType from "../types/modules/UsernameModuleType";
import WifiModuleType from "../types/modules/WifiModuleType";
import createUniqueID from "./createUniqueID";

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
}

export default getModuleData;
