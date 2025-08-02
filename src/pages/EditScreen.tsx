import React, { useEffect, useRef, useState } from "react";
import { Platform, View, Animated } from "react-native";
import ModulesType, { ModuleType } from "../types/ModulesType";

import ModulesEnum from "../enums/ModulesEnum";

import type { StackScreenProps } from "@react-navigation/stack";
import { Icon, Text } from "react-native-paper";
import Header from "../components/Header";
import ValuesType from "../types/ValuesType";
import getModuleData from "../utils/getModuleData";
import AddModuleModal from "../components/modals/AddModuleModal";
import { getDateTime } from "../utils/Timestamp";
import { useData } from "../contexts/DataProvider";
import DataType from "../types/DataType";
import TitleModule from "../components/modules/TitleModule";
import AnimatedContainer from "../components/container/AnimatedContainer";
import DraggableModulesListWeb from "../components/lists/draggableModulesList/DraggableModulesListWeb";
import DraggableModulesList from "../components/lists/draggableModulesList/DraggableModulesList";
import FolderModal from "../components/modals/FolderModal";
import { useTheme } from "../contexts/ThemeProvider";
import DiscardChangesModal from "../components/modals/DiscardChangesModal";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import ContainerButton from "../components/buttons/ContainerButton";
import SquaredContainerButton from "../components/buttons/SquaredContainerButton";
import DeleteModal from "../components/modals/DeleteModal";
import Button from "../components/buttons/Button";
import { RootStackParamList } from "../stacks/Stack";

import useAppLifecycle from "../hooks/useAppLifecycle";
import { openFastAccess, hideFastAccess } from "../utils/FastAccess";
import extractFastAccessObject from "../utils/extractFastAccessObject";
import FastAccessType from "../types/FastAccessType";

type EditScreenProps = StackScreenProps<RootStackParamList, "Edit">;

const EditScreen: React.FC<EditScreenProps> = ({ route, navigation }) => {
  const { value: routeValue } = route.params!;
  const data = useData();
  const {
    globalStyles,
    theme,
    headerWhite,
    setHeaderWhite,
    darkmode,
    setHeaderSpacing,
  } = useTheme();

  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState<ValuesType>({ ...routeValue });

  const [addModuleModalVisible, setAddModuleModalVisible] = useState(false);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [discardChangesVisible, setDiscardChangesVisible] = useState(false);
  const discardChangesRef = useRef(false);
  const [showMenu, setShowMenu] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [favIcon, setFavIcon] = useState("star-outline");

  const [fastAccessObject, setFastAccessObject] =
    useState<FastAccessType | null>(
      extractFastAccessObject(value.modules, value.title)
    );

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(220);
      setHeaderWhite(false);
    }, [])
  );

  useEffect(() => {
    const fastAccess = extractFastAccessObject(value.modules, value.title);
    setFastAccessObject(fastAccess);
  }, [value.modules, value.title, value]);

  useAppLifecycle({
    onBackground: () => {
      showFastAccess();
    },
    onForeground: () => {
      hideFastAccess();
    },
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!discardChangesRef.current) return;
      e.preventDefault();
      setDiscardChangesVisible(true);
    });

    return unsubscribe;
  }, [navigation]);

  const showFastAccess = () => {
    if (
      fastAccessObject === null ||
      (fastAccessObject.username === "" && fastAccessObject.password === "")
    )
      return;
    openFastAccess(
      fastAccessObject.title,
      fastAccessObject.username,
      fastAccessObject.password
    );
  };

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
    discardChangesRef.current = false;
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
    discardChangesRef.current = true;
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
    discardChangesRef.current = true;
  };

  const changeFav = () => {
    const newValue = { ...value };
    newValue.fav = !value.fav;
    setValue(newValue);
    discardChangesRef.current = true;
  };

  const deleteModule = (id: string) => {
    const newModules: ModulesType = [
      ...value.modules.filter((item: ModuleType) => item.id !== id),
    ];
    changeModules(newModules);
    discardChangesRef.current = true;
  };

  const changeModule = (module: ModuleType) => {
    const index = value.modules.findIndex((val) => val.id === module.id);
    const newModules = [...value.modules];
    newModules[index] = module;
    changeModules(newModules);
    discardChangesRef.current = true;
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
    data.setShowSave(true);
    goBack();
  };

  useEffect(() => {
    if (value.fav) {
      setFavIcon("star");
    } else {
      setFavIcon("star-outline");
    }
  }, [value]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!edit) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [edit]);

  return (
    <AnimatedContainer style={globalStyles.container} trigger={edit}>
      <StatusBar
        animated={true}
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent={true}
      />
      <Header
        onPress={() => {
          if (discardChangesRef.current) {
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
              discardChangesRef.current = true;
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
        <SquaredContainerButton onPress={showFastAccess}>
          <Icon
            source={"tooltip-account"}
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
          setDiscardoChanges={() => (discardChangesRef.current = true)}
          showAddModuleModal={() => {
            setAddModuleModalVisible(true);
          }}
          fastAccess={fastAccessObject}
        />
      ) : (
        <DraggableModulesList
          value={value}
          setValue={setValue}
          changeModules={changeModules}
          deleteModule={deleteModule}
          changeModule={changeModule}
          edit={edit}
          setDiscardoChanges={() => (discardChangesRef.current = true)}
          showAddModuleModal={() => {
            setAddModuleModalVisible(true);
          }}
          fastAccess={fastAccessObject}
        />
      )}
      <Animated.View
        style={{
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
              disabled={!discardChangesRef.current || value.title === ""}
              style={{
                flexGrow: 5,
                width: "50%",
                boxShadow: theme.colors?.shadow,
              }}
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
