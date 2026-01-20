import { ReactNode } from "react";
import ModulesEnum from "../model/ModulesEnum";
import { ModuleType } from "../model/ModulesType";

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

import UnknownModule from "../components/modules/UnknownModule";
import createUniqueID from "../../../shared/utils/createUniqueID";

import PhoneNumberModuleType from "../model/modules/PhoneNumberModuleType";
import PhoneNumberModule from "../components/modules/PhoneNumberModule";

import TotpModule from "../components/modules/TotpModule";
import TotpModuleType from "../model/modules/TotpModuleType";

import ExpiryModuleType from "../model/modules/ExpiryModuleType";
import ExpiryModule from "../components/modules/ExpiryModule";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import RecoveryCodesModule from "../components/modules/RecoveryCodesModule";
import RecoveryCodesModuleType from "../model/modules/RecoveryCodesModuleType";
import { HomeStackParamList } from "../../../app/navigation/model/types";

type RenderableModules = Exclude<
  ModulesEnum,
  ModulesEnum.UNKNOWN | ModulesEnum.TITLE
>;

type GetModuleArgs = {
  onDragStart: () => void;
  deleteModule: (id: string) => void;
  changeModule: (module: ModuleType) => void;
  fastAccess: FastAccessType | null;
  navigation: NativeStackNavigationProp<HomeStackParamList, "Edit", undefined>;
  title: string;
};

type Renderer = (module: ModuleType, args: GetModuleArgs) => ReactNode;

const MODULE_RENDERERS = {
  [ModulesEnum.CUSTOM_FIELD]: (module, args) => {
    const m = module as CustomFieldModuleType;
    return (
      <CustomFieldModule
        id={m.id}
        module={m.module}
        title={m.title}
        value={m.value}
        onDragStart={args.onDragStart}
        deleteModule={args.deleteModule}
        changeModule={args.changeModule}
        fastAccess={args.fastAccess}
      />
    );
  },

  [ModulesEnum.E_MAIL]: (module, args) => {
    const m = module as EmailModuleType;
    return (
      <EmailModule
        id={m.id}
        module={m.module}
        value={m.value}
        onDragStart={args.onDragStart}
        deleteModule={args.deleteModule}
        changeModule={args.changeModule}
        fastAccess={args.fastAccess}
      />
    );
  },

  [ModulesEnum.KEY]: (module, args) => {
    const m = module as KeyModuleType;
    return (
      <KeyModule
        id={m.id}
        module={m.module}
        value={m.value}
        onDragStart={args.onDragStart}
        deleteModule={args.deleteModule}
        changeModule={args.changeModule}
        fastAccess={args.fastAccess}
      />
    );
  },

  [ModulesEnum.NOTE]: (module, args) => {
    const m = module as NoteModuleType;
    return (
      <NoteModule
        id={m.id}
        module={m.module}
        value={m.value}
        onDragStart={args.onDragStart}
        deleteModule={args.deleteModule}
        changeModule={args.changeModule}
        fastAccess={args.fastAccess}
      />
    );
  },

  [ModulesEnum.PASSWORD]: (module, args) => {
    const m = module as PasswordModuleType;
    return (
      <PasswordModule
        id={m.id}
        module={m.module}
        value={m.value}
        onDragStart={args.onDragStart}
        deleteModule={args.deleteModule}
        changeModule={args.changeModule}
        fastAccess={args.fastAccess}
      />
    );
  },

  [ModulesEnum.URL]: (module, args) => {
    const m = module as URLModuleType;
    return (
      <URLModule
        id={m.id}
        module={m.module}
        value={m.value}
        onDragStart={args.onDragStart}
        deleteModule={args.deleteModule}
        changeModule={args.changeModule}
        fastAccess={args.fastAccess}
      />
    );
  },

  [ModulesEnum.USERNAME]: (module, args) => {
    const m = module as UsernameModuleType;
    return (
      <UsernameModule
        id={m.id}
        module={m.module}
        value={m.value}
        onDragStart={args.onDragStart}
        deleteModule={args.deleteModule}
        changeModule={args.changeModule}
        fastAccess={args.fastAccess}
      />
    );
  },

  [ModulesEnum.WIFI]: (module, args) => {
    const m = module as WifiModuleType;
    return (
      <WifiModule
        id={m.id}
        module={m.module}
        wifiName={m.wifiName}
        wifiType={m.wifiType}
        value={m.value}
        onDragStart={args.onDragStart}
        deleteModule={args.deleteModule}
        changeModule={args.changeModule}
        fastAccess={args.fastAccess}
      />
    );
  },

  [ModulesEnum.DIGITAL_CARD]: (module, args) => {
    const m = module as DigitalCardModuleType;
    return (
      <DigitalCardModule
        id={m.id}
        module={m.module}
        value={m.value}
        type={m.type}
        onDragStart={args.onDragStart}
        deleteModule={args.deleteModule}
        changeModule={args.changeModule}
        fastAccess={args.fastAccess}
        navigation={args.navigation}
        title={args.title}
      />
    );
  },

  [ModulesEnum.TASK]: (module, args) => {
    const m = module as TaskModuleType;
    return (
      <TaskModule
        id={m.id}
        module={m.module}
        value={m.value}
        completed={m.completed}
        onDragStart={args.onDragStart}
        deleteModule={args.deleteModule}
        changeModule={args.changeModule}
        fastAccess={args.fastAccess}
      />
    );
  },

  [ModulesEnum.PHONE_NUMBER]: (module, args) => {
    const m = module as PhoneNumberModuleType;
    return (
      <PhoneNumberModule
        id={m.id}
        module={m.module}
        value={m.value}
        onDragStart={args.onDragStart}
        deleteModule={args.deleteModule}
        changeModule={args.changeModule}
        fastAccess={args.fastAccess}
      />
    );
  },

  [ModulesEnum.TOTP]: (module, args) => {
    const m = module as TotpModuleType;
    return (
      <TotpModule
        id={m.id}
        module={m.module}
        value={m.value}
        onDragStart={args.onDragStart}
        deleteModule={args.deleteModule}
        changeModule={args.changeModule}
        fastAccess={args.fastAccess}
        navigation={args.navigation}
      />
    );
  },

  [ModulesEnum.EXPIRY]: (module, args) => {
    const m = module as ExpiryModuleType;
    return (
      <ExpiryModule
        id={m.id}
        module={m.module}
        value={m.value}
        warnBeforeMs={m.warnBeforeMs}
        onDragStart={args.onDragStart}
        deleteModule={args.deleteModule}
        changeModule={args.changeModule}
        fastAccess={args.fastAccess}
      />
    );
  },

  [ModulesEnum.RECOVERY_CODES]: (module, args) => {
    const m = module as RecoveryCodesModuleType;
    return (
      <RecoveryCodesModule
        id={m.id}
        module={m.module}
        warnBeforeMs={m.warnBeforeMs}
        onDragStart={args.onDragStart}
        deleteModule={args.deleteModule}
        changeModule={args.changeModule}
        fastAccess={args.fastAccess}
        codes={m.codes}
      />
    );
  },
} satisfies Record<RenderableModules, Renderer>;

function getModule(
  module: ModuleType,
  onDragStart: () => void,
  deleteModule: (id: string) => void,
  changeModule: (module: ModuleType) => void,
  fastAccess: FastAccessType | null,
  navigation: NativeStackNavigationProp<HomeStackParamList, "Edit", undefined>,
  title: string
): ReactNode {
  const args: GetModuleArgs = {
    onDragStart,
    deleteModule,
    changeModule,
    fastAccess,
    navigation,
    title,
  };

  const kind = (module as any).module as ModulesEnum;

  const renderer = (MODULE_RENDERERS as Partial<Record<ModulesEnum, Renderer>>)[
    kind
  ];

  if (renderer) return renderer(module, args);
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
