import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Platform, View } from "react-native";
import ModulesType, { ModuleType } from "../types/ModulesType";

import ModulesEnum from "../enums/ModulesEnum";

import type { StackScreenProps } from "@react-navigation/stack";
import { IconButton, Button } from "react-native-paper";
import Header from "../components/Header";
import EditMetaInfMenu from "../components/menus/EditMetaInfMenu";
import ValuesType from "../types/ValuesType";
import getModuleData from "../utils/getModuleData";
import AddModuleModal from "../components/modals/AddModuleModal";
import { getDateTime } from "../utils/Timestamp";
import { TITLEBAR_HEIGHT, TitlebarHeight } from "../components/CustomTitlebar";
import { useData } from "../contexts/DataProvider";
import DataType from "../types/DataType";
import TitleModule from "../components/modules/TitleModule";
import AnimatedContainer from "../components/containers/AnimatedContainer";
import DraggableModulesListWeb from "../components/lists/draggableModulesList/DraggableModulesListWeb";
import DraggableModulesList from "../components/lists/draggableModulesList/DraggableModulesList";
import Constants from "expo-constants";
import FolderModal from "../components/modals/FolderModal";
import { useTheme } from "../contexts/ThemeProvider";
import { RootStackParamList } from "../../App";
import DiscardChangesModal from "../components/modals/DiscardChangesModal";
import DeleteModal from "../components/modals/DeleteModal";

const styles = StyleSheet.create({
  scrollView: {
    minWidth: 0,
  },
  scrollViewStyle: {
    overflow: "visible",
  },
});

type EditScreenProps = StackScreenProps<RootStackParamList, "Edit">;

const EditScreen: React.FC<EditScreenProps> = ({ route, navigation }) => {
  const { value: routeValue, changeFolder } = route.params!;
  const data = useData();
  const { globalStyles, theme } = useTheme();

  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState<ValuesType>({ ...routeValue });

  const [addModuleModalVisible, setAddModuleModalVisible] = useState(false);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [discardChangesVisible, setDiscardChangesVisible] = useState(false);
  const [discardChanges, setDiscardChanges] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [favIcon, setFavIcon] = useState("star-outline");

  const saveValue = () => {
    let newData = { ...data.data } as DataType;
    let valueToChange: any = newData?.values.find(
      (x: ValuesType) => x.id === routeValue.id
    );
    if (valueToChange) {
      valueToChange.title = value.title;
      valueToChange.fav = value.fav;
      valueToChange.folder = value.folder;
      valueToChange.modules = value.modules;
      valueToChange.lastUpdated = getDateTime();
    } else {
      if (newData) newData.values = [...newData.values, value];
    }
    data.setData(newData);
    goBack();
  };

  const goBack = () => {
    navigation.goBack();
  };

  const addModule = (module: ModulesEnum) => {
    const newElement = getModuleData(module);
    const newModules: ModulesType = [
      ...value.modules,
      newElement as ModuleType,
    ];
    changeModules(newModules);
    setDiscardChanges(true);
  };

  const changeModules = (modules: ModulesType) => {
    const newValue = { ...value };
    newValue.modules = modules;
    setValue(newValue);
    setAddModuleModalVisible(false);
  };

  const changeSelectedFolder = (folder: string) => {
    const newValue = { ...value };
    newValue.folder = folder;
    setValue(newValue);
    setFolderModalVisible(false);
    setDiscardChanges(true);
  };

  const changeFav = () => {
    const newValue = { ...value };
    newValue.fav = !value.fav;
    setValue(newValue);
    setDiscardChanges(true);
  };

  const deleteModule = (id: string) => {
    const newModules: ModulesType = [
      ...value.modules.filter((item: ModuleType) => item.id !== id),
    ];
    changeModules(newModules);
    setDiscardChanges(true);
  };

  const changeModule = (module: ModuleType) => {
    const index = value.modules.findIndex((val) => val.id === module.id);
    const newModules = [...value.modules];
    newModules[index] = module;
    changeModules(newModules);
    setDiscardChanges(true);
  };

  useEffect(() => {
    if (value.fav) {
      setFavIcon("star");
    } else {
      setFavIcon("star-outline");
    }
  }, [value]);

  return (
    <AnimatedContainer style={globalStyles.container} trigger={edit}>
      <TitlebarHeight />
      <Header
        onPress={() => {
          if (discardChanges) {
            setDiscardChangesVisible(true);
          } else {
            goBack();
          }
        }}
        leftNode={
          <TitleModule
            value={value}
            setValue={setValue}
            disabled={edit}
            discardChanges={() => {
              setDiscardChanges(true);
            }}
          />
        }
      >
        <IconButton
          icon="plus"
          iconColor={theme.colors?.primary}
          size={20}
          onPress={() => {
            setAddModuleModalVisible(true);
          }}
        />
        <IconButton
          mode={edit ? "contained-tonal" : undefined}
          icon="square-edit-outline"
          iconColor={theme.colors?.primary}
          size={20}
          animated={true}
          selected={edit}
          onPress={() => setEdit(!edit)}
        />
        <IconButton
          icon="dots-vertical"
          size={20}
          iconColor={theme.colors?.primary}
          onPress={(event) => {
            setShowMenu(true);
          }}
        />
      </Header>
      {Platform.OS === "web" ? (
        <DraggableModulesListWeb
          value={value}
          setValue={setValue}
          changeModules={changeModules}
          deleteModule={deleteModule}
          changeModule={changeModule}
          edit={edit}
        />
      ) : (
        <DraggableModulesList
          value={value}
          setValue={setValue}
          changeModules={changeModules}
          deleteModule={deleteModule}
          changeModule={changeModule}
          edit={edit}
        />
      )}
      <Button
        mode="contained"
        style={{ width: 200 }}
        disabled={!discardChanges}
        onPress={saveValue}
      >
        Save
      </Button>
      <AddModuleModal
        addModule={addModule}
        visible={addModuleModalVisible}
        setVisible={setAddModuleModalVisible}
      />
      <EditMetaInfMenu
        visible={showMenu}
        setVisible={setShowMenu}
        created={routeValue.created}
        lastUpdated={routeValue.lastUpdated}
        value={value}
        folderList={data?.data ? data.data.folder : []}
        setFolderList={changeFolder}
        favButton={
          <IconButton
            icon={favIcon}
            iconColor={theme.colors?.primary}
            size={20}
            onPress={() => changeFav()}
          />
        }
        setFolderModalVisible={setFolderModalVisible}
        positionY={Constants.statusBarHeight + TITLEBAR_HEIGHT + 60}
        goBack={goBack}
      />
      <FolderModal
        visible={folderModalVisible}
        setVisible={setFolderModalVisible}
        folder={data?.data ? data.data.folder : []}
        setFolder={changeFolder}
        setSelectedFolder={changeSelectedFolder}
      />
      <DiscardChangesModal
        visible={discardChangesVisible}
        setVisible={setDiscardChangesVisible}
        onDiscard={goBack}
      />
    </AnimatedContainer>
  );
};

export default EditScreen;
