import React, { useEffect, useState } from "react";
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
    <View>
      <DragList
        contentContainerStyle={styles.scrollView}
        style={styles.scrollViewStyle}
        data={props.modules}
        keyExtractor={keyExtractor}
        onReordered={onReordered}
        renderItem={renderItem}
      />
    </View>
  );
}

function EditScreen({ route, navigation }: Props) {
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState<ValuesType>({ ...route.params.item });

  const [addModuleModalVisible, setAddModuleModalVisible] = useState(false);

  const [favIcon, setFavIcon] = useState("star-outline");

  const addModule = (module: ModulesEnum) => {
    const newElement = getModuleData(module);
    const newModules: ModulesType = [...data.modules, newElement as ModuleType];
    changeModules(newModules);
  };

  const changeModules = (modules: ModulesType) => {
    const newData = { ...data };
    newData.modules = modules;
    setData(newData);
    setAddModuleModalVisible(false);
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
            created={route.params.item.created}
            lastUpdated={route.params.item.lastUpdated}
          />
        )}
      </Header>
      <DraggableList
        modules={data.modules}
        changeModules={changeModules}
        deleteModule={deleteModule}
        edit={edit}
      />

      <Button
        text={"Save"}
        onPress={() => {
          const dt = getDateTime();
          console.log("no format: " + dt);
          console.log(formatDateTime(dt));
        }}
      ></Button>
      <AddModuleModal
        addModule={addModule}
        visible={addModuleModalVisible}
        setVisible={setAddModuleModalVisible}
      />
    </View>
  );
}

export default EditScreen;
