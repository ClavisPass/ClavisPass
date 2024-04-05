import React, { ReactNode } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import ModulesType, { ModuleType } from "../types/ModulesType";
import CustomFieldModule from "../components/modules/CustomFieldModule";

import ModulesEnum from "../enums/ModulesEnum";
import CustomFieldModuleType from "../types/modules/CustomFieldModuleType";

import type { StackScreenProps } from "@react-navigation/stack";
import EmailModuleType from "../types/modules/EmailModuleType";
import EmailModule from "../components/modules/EmailModule";
import KeyModuleType from "../types/modules/KeyModuleType";
import NoteModuleType from "../types/modules/NoteModuleType";
import PasswordModuleType from "../types/modules/PasswordModuleType";
import TitleModuleType from "../types/modules/TitleModuleType";
import URLModuleType from "../types/modules/URLModuleType";
import UsernameModuleType from "../types/modules/UsernameModuleType";
import WifiModuleType from "../types/modules/WifiModuleType";
import KeyModule from "../components/modules/KeyModule";
import NoteModule from "../components/modules/NoteModule";
import PasswordModule from "../components/modules/PasswordModule";
import TitleModule from "../components/modules/TitleModule";
import URLModule from "../components/modules/URLModule";
import UsernameModule from "../components/modules/UsernameModule";
import WifiModule from "../components/modules/WifiModule";
import { Button, IconButton } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    width: "100%",
    flex: 1,
  },
});

type RootStackParamList = {
  params: { modules: ModulesType };
};

type Props = StackScreenProps<RootStackParamList>;

function EditScreen({ route }: Props) {
  const [edit, setEdit] = React.useState(false);
  return (
    <View style={styles.container}>
      <IconButton
        icon="square-edit-outline"
        size={20}
        onPress={() => setEdit(!edit)}
      />
      <ScrollView style={styles.scrollView}>
        {route.params.modules.map((module) => getModule(module, edit))}
      </ScrollView>
    </View>
  );
}

function getModule(module: ModuleType, edit: boolean): ReactNode {
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
      />
    );
  }
  if (module.module === ModulesEnum.TITLE) {
    let moduleObject = module as TitleModuleType;
    return (
      <TitleModule
        key={moduleObject.id}
        id={moduleObject.id}
        module={moduleObject.module}
        value={moduleObject.value}
        edit={edit}
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
      />
    );
  }
  return <></>;
}

export default EditScreen;
