import { ReactNode } from "react";
import { ModuleType } from "../types/ModulesType";
import ModulesEnum from "../enums/ModulesEnum";
import CustomFieldModuleType from "../types/modules/CustomFieldModuleType";
import CustomFieldModule from "../components/modules/CustomFieldModule";
import EmailModuleType from "../types/modules/EmailModuleType";
import EmailModule from "../components/modules/EmailModule";
import KeyModuleType from "../types/modules/KeyModuleType";
import KeyModule from "../components/modules/KeyModule";
import NoteModuleType from "../types/modules/NoteModuleType";
import NoteModule from "../components/modules/NoteModule";
import PasswordModuleType from "../types/modules/PasswordModuleType";
import PasswordModule from "../components/modules/PasswordModule";
import URLModuleType from "../types/modules/URLModuleType";
import URLModule from "../components/modules/URLModule";
import UsernameModuleType from "../types/modules/UsernameModuleType";
import UsernameModule from "../components/modules/UsernameModule";
import WifiModuleType from "../types/modules/WifiModuleType";
import WifiModule from "../components/modules/WifiModule";

function getModule(
  module: ModuleType,
  edit: boolean,
  onDragStart: () => void,
  deleteModule: (id: string) => void
): ReactNode {
  if (module.module === ModulesEnum.CUSTOM_FIELD) {
    let moduleObject = module as CustomFieldModuleType;
    return (
      <CustomFieldModule
        key={moduleObject.id}
        id={moduleObject.id}
        module={moduleObject.module}
        title={moduleObject.title}
        value={moduleObject.value}
        edit={edit}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
      />
    );
  }
  if (module.module === ModulesEnum.E_MAIL) {
    let moduleObject = module as EmailModuleType;
    return (
      <EmailModule
        key={moduleObject.id}
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        edit={edit}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
      />
    );
  }
  if (module.module === ModulesEnum.KEY) {
    let moduleObject = module as KeyModuleType;
    return (
      <KeyModule
        key={moduleObject.id}
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        edit={edit}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
      />
    );
  }
  if (module.module === ModulesEnum.NOTE) {
    let moduleObject = module as NoteModuleType;
    return (
      <NoteModule
        key={moduleObject.id}
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        edit={edit}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
      />
    );
  }
  if (module.module === ModulesEnum.PASSWORD) {
    let moduleObject = module as PasswordModuleType;
    return (
      <PasswordModule
        key={moduleObject.id}
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        edit={edit}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
      />
    );
  }
  if (module.module === ModulesEnum.URL) {
    let moduleObject = module as URLModuleType;
    return (
      <URLModule
        key={moduleObject.id}
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        edit={edit}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
      />
    );
  }
  if (module.module === ModulesEnum.USERNAME) {
    let moduleObject = module as UsernameModuleType;
    return (
      <UsernameModule
        key={moduleObject.id}
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        edit={edit}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
      />
    );
  }
  if (module.module === ModulesEnum.WIFI) {
    let moduleObject = module as WifiModuleType;
    return (
      <WifiModule
        key={moduleObject.id}
        id={moduleObject.id}
        module={moduleObject.module}
        wifiName={moduleObject.wifiName}
        wifiType={moduleObject.wifiType}
        value={moduleObject.value}
        edit={edit}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
      />
    );
  }
  return <></>;
}

export default getModule;
