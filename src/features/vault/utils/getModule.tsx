import { ReactNode } from "react";
import { ModuleType } from "../model/ModulesType";
import ModulesEnum from "../model/ModulesEnum";
import CustomFieldModuleType from "../model/modules/CustomFieldModuleType";
import CustomFieldModule from "../components/modules/CustomFieldModule";
import EmailModuleType from "../model/modules/EmailModuleType";
import EmailModule from "../components/modules/EmailModule";
import KeyModuleType from "../model/modules/KeyModuleType";
import KeyModule from "../components/modules/KeyModule";
import NoteModuleType from "../model/modules/NoteModuleType";
import NoteModule from "../components/modules/NoteModule";
import PasswordModuleType from "../model/modules/PasswordModuleType";
import PasswordModule from "../components/modules/PasswordModule";
import URLModuleType from "../model/modules/URLModuleType";
import URLModule from "../components/modules/URLModule";
import UsernameModuleType from "../model/modules/UsernameModuleType";
import UsernameModule from "../components/modules/UsernameModule";
import WifiModuleType from "../model/modules/WifiModuleType";
import WifiModule from "../components/modules/WifiModule";
import FastAccessType from "../../fastaccess/model/FastAccessType";
import DigitalCardModuleType from "../model/modules/DigitalCardModuleType";
import DigitalCardModule from "../components/modules/DigitalCardModule";
import TaskModule from "../components/modules/TaskModule";
import TaskModuleType from "../model/modules/TaskModuleType";
import { StackNavigationProp } from "@react-navigation/stack/lib/typescript/src/types";
import { RootStackParamList } from "../../../app/navigation/stacks/Stack";
import UnknownModule from "../components/modules/UnknownModule";
import createUniqueID from "../../../shared/utils/createUniqueID";
import PhoneNumberModuleType from "../model/modules/PhoneNumberModuleType";
import PhoneNumberModule from "../components/modules/PhoneNumberModule";
import TotpModule from "../components/modules/TotpModule";
import TotpModuleType from "../model/modules/TotpModuleType";
import ExpiryModuleType from "../model/modules/ExpiryModuleType";
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
