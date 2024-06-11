import React, { ReactNode, useEffect } from "react";
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
import { IconButton, Menu, Modal } from "react-native-paper";
import DragList, { DragListRenderItemInfo } from "react-native-draglist";
import Header from "../components/Header";
import globalStyles from "../ui/globalStyles";
import theme from "../ui/theme";
import Button from "../components/Button";
import EditMetaInfMenu from "../components/EditMetaInfMenu";
import ValuesType, { ValuesListType } from "../types/ValuesType";
import getModule from "../utils/getModule";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  scrollView: {
    width: Dimensions.get("window").width,
    flexGrow: 1,
  },
});

type RootStackParamList = {
  params: {
    item: ValuesType;
  };
};

type Props = StackScreenProps<RootStackParamList>;

type DraggableListProps = {
  modules: ModulesType;
  changeModules: (data: ModulesType) => void;
  deleteModule: (id: string) => void;
  edit: boolean;
};

function DraggableList(props: DraggableListProps) {
  function keyExtractor(str: ModuleType) {
    return str.id;
  }

  function renderItem(info: DragListRenderItemInfo<ModuleType>) {
    const { item, onDragStart, onDragEnd, isActive } = info;

    return (
      <>
        {getModule(
          item,
          props.edit,
          onDragStart,
          onDragEnd,
          props.deleteModule
        )}
      </>
    );
  }

  async function onReordered(fromIndex: number, toIndex: number) {
    const copy = [...props.modules]; // Don't modify react data in-place
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]); // Now insert at the new pos
    props.changeModules(copy);
  }

  return (
    <DragList
      style={styles.scrollView}
      data={props.modules}
      keyExtractor={keyExtractor}
      onReordered={onReordered}
      renderItem={renderItem}
    />
  );
}

function EditScreen({ route, navigation }: Props) {
  const [edit, setEdit] = React.useState(false);
  const [data, setData] = React.useState<ValuesType>({ ...route.params.item });

  const [visible, setVisible] = React.useState(false);

  const [favIcon, setFavIcon] = React.useState("star-outline");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  const changeModules = (modules: ModulesType) => {
    const newData = { ...data };
    newData.modules = modules;
    setData(newData);
  };

  const changeFav = () => {
    const newData = { ...data };
    newData.fav = !data.fav;
    setData(newData);
  };

  const deleteModule = (id: string) => {
    const newModules: ModulesType = [
      ...data.modules.filter((item: ModuleType) => item.id !== id),
    ];
    changeModules(newModules);
  };

  useEffect(() => {
    if (data.fav) {
      setFavIcon("star");
    } else {
      setFavIcon("star-outline");
    }
  }, [data]);

  return (
    <View style={globalStyles.container}>
      <Header
        title={"Edit"}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <IconButton
          icon={favIcon}
          iconColor={theme.colors.primary}
          size={20}
          onPress={() => changeFav()}
        />
        <IconButton
          icon="square-edit-outline"
          iconColor={theme.colors.primary}
          size={20}
          selected={true}
          onPress={() => setEdit(!edit)}
        />
        <EditMetaInfMenu
          created={route.params.item.created}
          lastUpdated={route.params.item.lastUpdated}
        />
      </Header>
      <View style={styles.container}>
        {edit ? (
          <IconButton
            icon="plus"
            mode={"outlined"}
            size={30}
            onPress={showModal}
          />
        ) : null}
        <DraggableList
          modules={data.modules}
          changeModules={changeModules}
          deleteModule={deleteModule}
          edit={edit}
        />
      </View>
      <Button text={"Save"} onPress={() => console.log("test")}></Button>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <Menu.Item leadingIcon="account" onPress={() => {}} title="Username" />
        <Menu.Item leadingIcon="email" onPress={() => {}} title="E-Mail" />
        <Menu.Item
          leadingIcon="form-textbox-password"
          onPress={() => {}}
          title="Password"
        />
        <Menu.Item leadingIcon="web" onPress={() => {}} title="URL" />
        <Menu.Item leadingIcon="wifi" onPress={() => {}} title="Wifi" />
        <Menu.Item leadingIcon="key-variant" onPress={() => {}} title="Key" />
        <Menu.Item
          leadingIcon="pencil-box"
          onPress={() => {}}
          title="Custom Field"
        />
        <Menu.Item leadingIcon="note" onPress={() => {}} title="Note" />
      </Modal>
    </View>
  );
}

export default EditScreen;
