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
import FastAccessType from "../types/FastAccessType";

function getModule(
  module: ModuleType,
  edit: boolean,
  onDragStart: () => void,
  deleteModule: (id: string) => void,
  changeModule: (module: ModuleType) => void,
  fastAccess: FastAccessType | null
): ReactNode {
  if (module.module === ModulesEnum.CUSTOM_FIELD) {
    const moduleObject = module as CustomFieldModuleType;
    return (
      <CustomFieldModule
        id={moduleObject.id}
        module={moduleObject.module}
        title={moduleObject.title}
        value={moduleObject.value}
        edit={edit}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
        changeModule={changeModule}
        fastAccess={fastAccess}
      />
    );
  }
  if (module.module === ModulesEnum.E_MAIL) {
    const moduleObject = module as EmailModuleType;
    return (
      <EmailModule
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        edit={edit}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
        changeModule={changeModule}
        fastAccess={fastAccess}
      />
    );
  }
  if (module.module === ModulesEnum.KEY) {
    const moduleObject = module as KeyModuleType;
    return (
      <KeyModule
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        edit={edit}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
        changeModule={changeModule}
        fastAccess={fastAccess}
      />
    );
  }
  if (module.module === ModulesEnum.NOTE) {
    const moduleObject = module as NoteModuleType;
    return (
      <NoteModule
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        edit={edit}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
        changeModule={changeModule}
        fastAccess={fastAccess}
      />
    );
  }
  if (module.module === ModulesEnum.PASSWORD) {
    const moduleObject = module as PasswordModuleType;
    return (
      <PasswordModule
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        edit={edit}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
        changeModule={changeModule}
        fastAccess={fastAccess}
      />
    );
  }
  if (module.module === ModulesEnum.URL) {
    const moduleObject = module as URLModuleType;
    return (
      <URLModule
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        edit={edit}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
        changeModule={changeModule}
        fastAccess={fastAccess}
      />
    );
  }
  if (module.module === ModulesEnum.USERNAME) {
    const moduleObject = module as UsernameModuleType;
    return (
      <UsernameModule
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        edit={edit}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
        changeModule={changeModule}
        fastAccess={fastAccess}
      />
    );
  }
  if (module.module === ModulesEnum.WIFI) {
    const moduleObject = module as WifiModuleType;
    return (
      <WifiModule
        id={moduleObject.id}
        module={moduleObject.module}
        wifiName={moduleObject.wifiName}
        wifiType={moduleObject.wifiType}
        value={moduleObject.value}
        edit={edit}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
        changeModule={changeModule}
        fastAccess={fastAccess}
      />
    );
  }
  return <></>;
}

export default getModule;
