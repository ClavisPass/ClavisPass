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
import DigitalCardModuleType from "../types/modules/DigitalCardModuleType";
import DigitalCardModule from "../components/modules/DigitalCardModule";
import TaskModule from "../components/modules/TaskModule";
import TaskModuleType from "../types/modules/TaskModuleType";
import { StackNavigationProp } from "@react-navigation/stack/lib/typescript/src/types";
import { RootStackParamList } from "../stacks/Stack";
import UnknownModule from "../components/modules/UnknownModule";
import createUniqueID from "./createUniqueID";
import PhoneNumberModuleType from "../types/modules/PhoneNumberModuleType";
import PhoneNumberModule from "../components/modules/PhoneNumberModule";
import TotpModule from "../components/modules/TotpModule";
import TotpModuleType from "../types/modules/TotpModuleType";
import ExpiryModuleType from "../types/modules/ExpiryModuleType";
import ExpiryModule from "../components/modules/ExpiryModule";

function getModule(
  module: ModuleType,
  onDragStart: () => void,
  deleteModule: (id: string) => void,
  changeModule: (module: ModuleType) => void,
  fastAccess: FastAccessType | null,
  navigation: StackNavigationProp<RootStackParamList, "Edit", undefined>,
  title: string
): ReactNode {
  if (module.module === ModulesEnum.CUSTOM_FIELD) {
    const moduleObject = module as CustomFieldModuleType;
    return (
      <CustomFieldModule
        id={moduleObject.id}
        module={moduleObject.module}
        title={moduleObject.title}
        value={moduleObject.value}
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
        onDragStart={onDragStart}
        deleteModule={deleteModule}
        changeModule={changeModule}
        fastAccess={fastAccess}
      />
    );
  }
  if (module.module === ModulesEnum.DIGITAL_CARD) {
    const moduleObject = module as DigitalCardModuleType;
    return (
      <DigitalCardModule
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        type={moduleObject.type}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
        changeModule={changeModule}
        fastAccess={fastAccess}
        navigation={navigation}
        title={title}
      />
    );
  }
  if (module.module === ModulesEnum.TASK) {
    const moduleObject = module as TaskModuleType;
    return (
      <TaskModule
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        completed={moduleObject.completed}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
        changeModule={changeModule}
        fastAccess={fastAccess}
      />
    );
  }
  if (module.module === ModulesEnum.PHONE_NUMBER) {
    const moduleObject = module as PhoneNumberModuleType;
    return (
      <PhoneNumberModule
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
        changeModule={changeModule}
        fastAccess={fastAccess}
      />
    );
  }
  if (module.module === ModulesEnum.TOTP) {
    const moduleObject = module as TotpModuleType;
    return (
      <TotpModule
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
        changeModule={changeModule}
        fastAccess={fastAccess}
        navigation={navigation}
      />
    );
  }
  if (module.module === ModulesEnum.EXPIRY) {
    const moduleObject = module as ExpiryModuleType;
    return (
      <ExpiryModule
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        warnBeforeMs={moduleObject.warnBeforeMs}
        onDragStart={onDragStart}
        deleteModule={deleteModule}
        changeModule={changeModule}
        fastAccess={fastAccess}
      />
    );
  }
  return (
    <UnknownModule
      module={module}
      id={module.id ? module.id : createUniqueID()}
      onDragStart={onDragStart}
      deleteModule={deleteModule}
      changeModule={changeModule}
      fastAccess={fastAccess}
    />
  );
}

export default getModule;
