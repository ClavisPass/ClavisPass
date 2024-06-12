import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import ModulesType, { ModuleType } from "../types/ModulesType";

import ModulesEnum from "../enums/ModulesEnum";

import type { StackScreenProps } from "@react-navigation/stack";
import { IconButton, Menu, Modal } from "react-native-paper";
import DragList, { DragListRenderItemInfo } from "react-native-draglist";
import Header from "../components/Header";
import globalStyles from "../ui/globalStyles";
import theme from "../ui/theme";
import Button from "../components/Button";
import EditMetaInfMenu from "../components/EditMetaInfMenu";
import ValuesType from "../types/ValuesType";
import getModule from "../utils/getModule";
import getModuleData from "../utils/getModuleData";
import { ScrollView } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  scrollView: {
    width: Dimensions.get("window").width,
  },
  scrollViewStyle: {
    overflow: "visible",
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
      contentContainerStyle={styles.scrollView}
      style={styles.scrollViewStyle}
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

  const addModule = (module: ModulesEnum) => {
    const newElement = getModuleData(module);
    const newModules: ModulesType = [...data.modules, newElement as ModuleType];
    changeModules(newModules);
  };

  const changeModules = (modules: ModulesType) => {
    const newData = { ...data };
    newData.modules = modules;
    setData(newData);
    setVisible(false);
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
      {edit ? (
        <View style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <IconButton
            icon="plus"
            mode={"outlined"}
            size={30}
            onPress={showModal}
          />
        </View>
      ) : null}
      <ScrollView style={styles.container}>
        <DraggableList
          modules={data.modules}
          changeModules={changeModules}
          deleteModule={deleteModule}
          edit={edit}
        />
      </ScrollView>
      <Button text={"Save"} onPress={() => console.log("test")}></Button>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <Menu.Item
          leadingIcon="account"
          onPress={() => {
            addModule(ModulesEnum.USERNAME);
          }}
          title="Username"
        />
        <Menu.Item
          leadingIcon="email"
          onPress={() => {
            addModule(ModulesEnum.E_MAIL);
          }}
          title="E-Mail"
        />
        <Menu.Item
          leadingIcon="form-textbox-password"
          onPress={() => {
            addModule(ModulesEnum.PASSWORD);
          }}
          title="Password"
        />
        <Menu.Item
          leadingIcon="web"
          onPress={() => {
            addModule(ModulesEnum.URL);
          }}
          title="URL"
        />
        <Menu.Item
          leadingIcon="wifi"
          onPress={() => {
            addModule(ModulesEnum.WIFI);
          }}
          title="Wifi"
        />
        <Menu.Item
          leadingIcon="key-variant"
          onPress={() => {
            addModule(ModulesEnum.KEY);
          }}
          title="Key"
        />
        <Menu.Item
          leadingIcon="pencil-box"
          onPress={() => {
            addModule(ModulesEnum.CUSTOM_FIELD);
          }}
          title="Custom Field"
        />
        <Menu.Item
          leadingIcon="note"
          onPress={() => {
            addModule(ModulesEnum.NOTE);
          }}
          title="Note"
        />
      </Modal>
    </View>
  );
}

export default EditScreen;
