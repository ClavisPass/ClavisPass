import React, { ReactNode } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
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
import { Button, IconButton, Menu, Modal, Text } from "react-native-paper";
import DragList, { DragListRenderItemInfo } from "react-native-draglist";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  scrollView: {
    width: Dimensions.get("window").width,
    flex: 1,
  },
});

type RootStackParamList = {
  params: {
    modules: ModulesType;
    fav: boolean;
    created: string;
    lastUpdated: string;
    folder: string;
  };
};

type Props = StackScreenProps<RootStackParamList>;

type DraggableListProps = {
  data: ModulesType;
  setData: (data: ModulesType) => void;
  edit: boolean;
};

function DraggableList(props: DraggableListProps) {
  function keyExtractor(str: ModuleType) {
    return str.id;
  }

  function renderItem(info: DragListRenderItemInfo<ModuleType>) {
    const { item, onDragStart, onDragEnd, isActive } = info;

    return <>{getModule(item, props.edit, onDragStart, onDragEnd)}</>;
  }

  async function onReordered(fromIndex: number, toIndex: number) {
    const copy = [...props.data]; // Don't modify react data in-place
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]); // Now insert at the new pos
    props.setData(copy);
  }

  return (
    <DragList
      style={styles.scrollView}
      data={props.data}
      keyExtractor={keyExtractor}
      onReordered={onReordered}
      renderItem={renderItem}
    />
  );
}

function EditScreen({ route }: Props) {
  const [edit, setEdit] = React.useState(false);
  const [data, setData] = React.useState([...route.params.modules]);

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  return (
    <>
      <View style={styles.container}>
        <IconButton
          icon="square-edit-outline"
          size={20}
          onPress={() => setEdit(!edit)}
        />
        {edit ? <IconButton icon="plus" size={20} onPress={showModal} /> : null}
        <DraggableList data={data} setData={setData} edit={edit} />
      </View>
      <View>
        <Text>created: {route.params.created}</Text>
        <Text>last updated: {route.params.lastUpdated}</Text>
      </View>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <Menu.Item leadingIcon="account" onPress={() => {}} title="Username" />
        <Menu.Item leadingIcon="email" onPress={() => {}} title="E-Mail" />
        <Menu.Item leadingIcon="form-textbox-password" onPress={() => {}} title="Password" />
        <Menu.Item leadingIcon="web" onPress={() => {}} title="URL" />
        <Menu.Item leadingIcon="wifi" onPress={() => {}} title="Wifi" />
        <Menu.Item leadingIcon="key-variant" onPress={() => {}} title="Key" />
        <Menu.Item leadingIcon="pencil-box" onPress={() => {}} title="Custom Field" />
        <Menu.Item leadingIcon="note" onPress={() => {}} title="Note" />
      </Modal>
    </>
  );
}

function getModule(
  module: ModuleType,
  edit: boolean,
  onDragStart: () => void,
  onDragEnd: () => void
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
        onDragEnd={onDragEnd}
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
        onDragEnd={onDragEnd}
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
        onDragEnd={onDragEnd}
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
        onDragEnd={onDragEnd}
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
        onDragEnd={onDragEnd}
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
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
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
        onDragEnd={onDragEnd}
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
        onDragEnd={onDragEnd}
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
        onDragEnd={onDragEnd}
      />
    );
  }
  return <></>;
}

export default EditScreen;
