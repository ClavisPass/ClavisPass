import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Platform, View, Animated, Keyboard } from "react-native";
import ModulesType, { ModuleType } from "../types/ModulesType";

import ModulesEnum from "../enums/ModulesEnum";

import type { StackScreenProps } from "@react-navigation/stack";
import { Icon, IconButton, Text } from "react-native-paper";
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
import AnimatedContainer from "../components/container/AnimatedContainer";
import DraggableModulesListWeb from "../components/lists/draggableModulesList/DraggableModulesListWeb";
import DraggableModulesList from "../components/lists/draggableModulesList/DraggableModulesList";
import Constants from "expo-constants";
import FolderModal from "../components/modals/FolderModal";
import { useTheme } from "../contexts/ThemeProvider";
import { RootStackParamList } from "../../App";
import DiscardChangesModal from "../components/modals/DiscardChangesModal";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import ContainerButton from "../components/buttons/ContainerButton";
import SquaredContainerButton from "../components/buttons/SquaredContainerButton";
import DeleteModal from "../components/modals/DeleteModal";
import Button from "../components/buttons/Button";

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
  const { value: routeValue } = route.params!;
  const data = useData();
  const { globalStyles, theme, headerWhite, setHeaderWhite, darkmode } =
    useTheme();

  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState<ValuesType>({ ...routeValue });

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [addModuleModalVisible, setAddModuleModalVisible] = useState(false);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [discardChangesVisible, setDiscardChangesVisible] = useState(false);
  const [discardChanges, setDiscardChanges] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [favIcon, setFavIcon] = useState("star-outline");

  useFocusEffect(
    React.useCallback(() => {
      setHeaderWhite(false);
    }, [])
  );

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
    data.setShowSave(true);
    goBack();
  };

  const goBack = () => {
    setDiscardChangesVisible(false);
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

  const deleteValue = (id: string) => {
    let newData = { ...data.data } as DataType;
    let valueToChange: any = newData?.values?.filter(
      (item: ValuesType) => item.id !== id
    );
    if (newData) {
      newData.values = valueToChange;
      data.setData(newData);
    }
    goBack();
  };

  useEffect(() => {
    if (value.fav) {
      setFavIcon("star");
    } else {
      setFavIcon("star-outline");
    }
  }, [value]);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!edit) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 56,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [edit]);

  return (
    <AnimatedContainer style={globalStyles.container} trigger={edit}>
      <TitlebarHeight />
      <StatusBar
        animated={true}
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent={true}
      />
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
      ></Header>
      <View
        style={{
          width: "100%",
          padding: 8,
          paddingTop: 0,
          display: "flex",
          flexDirection: "row",
          gap: 8,
        }}
      >
        <ContainerButton
          backgroundColor={edit ? theme.colors?.secondaryContainer : undefined}
          onPress={() => {
            setEdit(!edit);
          }}
        >
          <Icon
            source="square-edit-outline"
            color={theme.colors?.primary}
            size={20}
          />
        </ContainerButton>
        <ContainerButton
          flexGrow={5}
          onPress={() => {
            setFolderModalVisible(true);
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Icon source="folder" size={20} color={theme.colors?.primary} />
            <Text>{value.folder === "" ? "None" : value.folder}</Text>
          </View>
        </ContainerButton>
        <SquaredContainerButton
          onPress={() => {
            setShowMenu(true);
          }}
        >
          <Icon
            source={"clipboard-text-clock-outline"}
            color={theme.colors?.primary}
            size={20}
          />
        </SquaredContainerButton>
      </View>
      {Platform.OS === "web" ? (
        <DraggableModulesListWeb
          value={value}
          setValue={setValue}
          changeModules={changeModules}
          deleteModule={deleteModule}
          changeModule={changeModule}
          edit={edit}
          setDiscardoChanges={() => setDiscardChanges(true)}
          showAddModuleModal={() => {
            setAddModuleModalVisible(true);
          }}
        />
      ) : (
        <DraggableModulesList
          value={value}
          setValue={setValue}
          changeModules={changeModules}
          deleteModule={deleteModule}
          changeModule={changeModule}
          edit={edit}
          setDiscardoChanges={() => setDiscardChanges(true)}
          showAddModuleModal={() => {
            setAddModuleModalVisible(true);
          }}
        />
      )}
      <Animated.View
        style={{
          height: slideAnim,
          opacity: fadeAnim,
          width: "100%",
          padding: 8,
          display: "flex",
          flexDirection: "row",
          gap: 8,
        }}
      >
        {!edit && (
          <>
            <ContainerButton onPress={changeFav}>
              <Icon source={favIcon} color={theme.colors?.primary} size={20} />
            </ContainerButton>
            <Button
              icon="content-save"
              onPress={saveValue}
              disabled={!discardChanges || value.title === ""}
              style={{ flexGrow: 5, width: "50%", boxShadow: theme.colors?.shadow }}
            />
            <ContainerButton
              onPress={() => setDeleteModalVisible(true)}
              backgroundColor={theme.colors?.error}
            >
              <Icon source="trash-can-outline" size={20} color={"white"} />
            </ContainerButton>
          </>
        )}
      </Animated.View>

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
        positionY={Constants.statusBarHeight + TITLEBAR_HEIGHT + 104}
      />
      <FolderModal
        visible={folderModalVisible}
        setVisible={setFolderModalVisible}
        folder={data?.data ? data.data.folder : []}
        setSelectedFolder={changeSelectedFolder}
      />
      <DiscardChangesModal
        visible={discardChangesVisible}
        setVisible={setDiscardChangesVisible}
        onDiscard={goBack}
      />
      <DeleteModal
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        onDelete={() => {
          deleteValue(value.id);
        }}
      />
    </AnimatedContainer>
  );
};

export default EditScreen;
