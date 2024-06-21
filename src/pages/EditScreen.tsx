import React, { ReactNode, useEffect, useState } from "react";
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
import EditMetaInfMenu from "../components/menus/EditMetaInfMenu";
import ValuesType from "../types/ValuesType";
import getModule from "../utils/getModule";
import getModuleData from "../utils/getModuleData";
import { ScrollView } from "react-native-gesture-handler";
import AddModuleModal from "../components/modals/AddModuleModal";
import { formatDateTime, getDateTime } from "../utils/Timestamp";
import { TitlebarHeight } from "../components/CustomTitlebar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useData } from "../contexts/DataProvider";
import DataType from "../types/DataType";

const styles = StyleSheet.create({
  scrollView: {
    minWidth: 0,
  },
  scrollViewStyle: {
    overflow: "visible",
  },
});

type RootStackParamList = {
  params: {
    value: ValuesType;
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
    <View style={{ flex: 1 }}>
      <ScrollView style={{ width: Dimensions.get("window").width, flex: 1 }}>
        <DragList
          contentContainerStyle={styles.scrollView}
          style={styles.scrollViewStyle}
          data={props.modules}
          keyExtractor={keyExtractor}
          onReordered={onReordered}
          renderItem={renderItem}
        />
      </ScrollView>
    </View>
  );
}

//<ScrollView style={{ width: Dimensions.get("window").width }}>

function EditScreen({ route, navigation }: Props) {
  const data = useData();

  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState<ValuesType>({ ...route.params.value });

  const [addModuleModalVisible, setAddModuleModalVisible] = useState(false);

  const [favIcon, setFavIcon] = useState("star-outline");

  const saveValue = () => {
    let newData = { ...data.data } as DataType;
    let valueToChange: any = newData?.values.find(
      (x: ValuesType) => x.id === route.params.value.id
    );
    valueToChange.fav = value.fav;
    valueToChange.folder = value.folder;
    valueToChange.modules = value.modules;
    valueToChange.lastUpdated = getDateTime();
    data.setData(newData);
  };

  const addModule = (module: ModulesEnum) => {
    const newElement = getModuleData(module);
    const newModules: ModulesType = [
      ...value.modules,
      newElement as ModuleType,
    ];
    changeModules(newModules);
  };

  const changeModules = (modules: ModulesType) => {
    const newValue = { ...value };
    newValue.modules = modules;
    setValue(newValue);
    setAddModuleModalVisible(false);
  };

  const changeFav = () => {
    const newValue = { ...value };
    newValue.fav = !value.fav;
    setValue(newValue);
  };

  const deleteModule = (id: string) => {
    const newModules: ModulesType = [
      ...value.modules.filter((item: ModuleType) => item.id !== id),
    ];
    changeModules(newModules);
  };

  useEffect(() => {
    if (value.fav) {
      setFavIcon("star");
    } else {
      setFavIcon("star-outline");
    }
  }, [value]);

  const [title, setTitle] = useState("Edit");

  useEffect(() => {
    if (edit) {
      setTitle("Changing Modules..");
    } else {
      setTitle("Edit");
    }
  }, [edit]);

  return (
    <View style={globalStyles.container}>
      <TitlebarHeight />
      <Header
        title={title}
        onPress={() => {
          navigation.goBack();
        }}
      >
        {edit ? (
          <IconButton
            icon="plus"
            iconColor={theme.colors.primary}
            size={20}
            onPress={() => {
              setAddModuleModalVisible(true);
            }}
          />
        ) : (
          <IconButton
            icon={favIcon}
            iconColor={theme.colors.primary}
            size={20}
            onPress={() => changeFav()}
          />
        )}

        <IconButton
          icon="square-edit-outline"
          iconColor={theme.colors.primary}
          size={20}
          selected={true}
          onPress={() => setEdit(!edit)}
        />
        {edit ? (
          <IconButton
            icon="delete"
            iconColor={theme.colors.error}
            size={20}
            selected={true}
            onPress={() => console.log("test")}
          />
        ) : (
          <EditMetaInfMenu
            created={route.params.value.created}
            lastUpdated={route.params.value.lastUpdated}
            folder={route.params.value.folder}
          />
        )}
      </Header>
      <DraggableList
        modules={value.modules}
        changeModules={changeModules}
        deleteModule={deleteModule}
        edit={edit}
      />

      <Button text={"Save"} onPress={saveValue} />
      <AddModuleModal
        addModule={addModule}
        visible={addModuleModalVisible}
        setVisible={setAddModuleModalVisible}
      />
    </View>
  );
}

export default EditScreen;
