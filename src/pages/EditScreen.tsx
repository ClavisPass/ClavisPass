import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  View,
  Animated,
  InteractionManager,
  useWindowDimensions,
} from "react-native";
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
import FolderType from "../types/FolderType";
import MetaInformationModule from "../components/modules/MetaInformationModule";
import { useTranslation } from "react-i18next";
import { useSetting } from "../contexts/SettingsProvider";

type EditScreenProps = StackScreenProps<RootStackParamList, "Edit">;

const EditScreen: React.FC<EditScreenProps> = ({ route, navigation }) => {
  const {
    value: routeValue,
    favorite: routeFavorite,
    folder: routeFolder,
  } = route.params!;
  const data = useData();
  const {
    globalStyles,
    theme,
    headerWhite,
    setHeaderWhite,
    darkmode,
    setHeaderSpacing,
  } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const { value: fastAccessBehavior } = useSetting("FAST_ACCESS");

  const [value, setValue] = useState<ValuesType>({ ...routeValue });

  const [addModuleModalVisible, setAddModuleModalVisible] = useState(false);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [discardChangesVisible, setDiscardChangesVisible] = useState(false);
  const discardChangesRef = useRef(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [favIcon, setFavIcon] = useState("star-outline");

  const didValidateFolderRef = useRef(false);

  const [fastAccessObject, setFastAccessObject] =
    useState<FastAccessType | null>(
      extractFastAccessObject(value.modules, value.title)
    );

  useFocusEffect(
    React.useCallback(() => {
      let task = InteractionManager.runAfterInteractions(() => {
        setHeaderSpacing(220);
        setHeaderWhite(false);
      });
      return () => task?.cancel?.();
    }, [])
  );

  useEffect(() => {
    const fastAccess = extractFastAccessObject(value.modules, value.title);
    setFastAccessObject(fastAccess);
  }, [value.modules, value.title, value]);

  useAppLifecycle({
    onBackground: async () => {
      if (fastAccessBehavior === "auto") {
        showFastAccess();
      }
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

  useEffect(() => {
    if (routeFavorite !== undefined && routeFavorite === true) {
      if (routeFolder !== undefined && routeFolder !== null) {
        changeMultipleEntries(routeFolder, routeFavorite);
      } else {
        changeFav(routeFavorite);
      }
    } else {
      if (routeFolder !== undefined && routeFolder !== null) {
        changeSelectedFolder(routeFolder);
      }
    }
  }, [routeFavorite, routeFolder]);

  useEffect(() => {
    if (didValidateFolderRef.current) return;

    const folders = data.data?.folder;
    if (!folders) return;

    didValidateFolderRef.current = true;

    setValue((prev) => {
      if (!prev.folder) return prev;

      const exists = folders.some((f) => f.id === prev.folder!.id);
      if (exists) return prev;

      return { ...prev, folder: null };
    });
  }, [data.data?.folder]);

  const showFastAccess = () => {
    if (
      fastAccessObject === null ||
      fastAccessObject.username === "" ||
      fastAccessObject.password === ""
    )
      return;
    openFastAccess(
      fastAccessObject.title,
      fastAccessObject.username,
      fastAccessObject.password
    );
  };

  const openFastAccessFeature = async () => {
    if (Platform.OS === "web") {
      if (
        fastAccessObject === null ||
        fastAccessObject.username === "" ||
        fastAccessObject.password === ""
      )
        return;
      const tauri = require("@tauri-apps/api/webviewWindow");
      const win = await tauri.WebviewWindow.getByLabel("main");
      if (!win) {
        return;
      }
      win.minimize();
    }
    showFastAccess();
  };

  const folderExists = (folder: FolderType | null | undefined) => {
    if (!folder) return true;
    const folders = data.data?.folder ?? [];
    return folders.some((f) => f.id === folder.id);
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

  const changeMultipleEntries = (
    folder: FolderType | null,
    favorite?: boolean
  ) => {
    const newValue = { ...value };
    newValue.folder = folder;
    newValue.fav = favorite === undefined ? !value.fav : favorite;
    setValue(newValue);
    setFolderModalVisible(false);
    discardChangesRef.current = true;
  };

  const changeSelectedFolder = (folder: FolderType | null) => {
    const newValue = { ...value };
    newValue.folder = folder;
    setValue(newValue);
    setFolderModalVisible(false);
    discardChangesRef.current = true;
  };

  const changeFav = (favorite?: boolean) => {
    const newValue = { ...value };
    newValue.fav = favorite === undefined ? !value.fav : favorite;
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
    setDeleteModalVisible(false);
    data.setShowSave(true);
    goBack();
  };

  useEffect(() => {
    if (value.fav) {
      setFavIcon("star");
    } else {
      setFavIcon("star-outline");
    }
  }, [value, value.fav]);

  return (
    <AnimatedContainer style={globalStyles.container}>
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
        {width > 600 && (
          <View style={{}}>
            <Button
              icon="content-save"
              onPress={saveValue}
              disabled={!discardChangesRef.current || value.title === ""}
              style={{
                boxShadow: theme.colors?.shadow,
              }}
            />
          </View>
        )}
        <SquaredContainerButton onPress={() => changeFav(!value.fav)}>
          <Icon source={favIcon} color={theme.colors?.primary} size={20} />
        </SquaredContainerButton>
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
            <Text style={{ userSelect: "none" }}>
              {value.folder === null ||
              value.folder.name === "" ||
              value.folder === undefined
                ? t("common:none")
                : value.folder.name}
            </Text>
          </View>
        </ContainerButton>
        {fastAccessObject === null ||
        fastAccessObject.username === "" ||
        fastAccessObject.password === "" ? null : (
          <SquaredContainerButton onPress={openFastAccessFeature}>
            <Icon
              source={"tooltip-account"}
              color={theme.colors.primary}
              size={20}
            />
          </SquaredContainerButton>
        )}
        <SquaredContainerButton onPress={() => setDeleteModalVisible(true)}>
          <Icon
            source="trash-can-outline"
            size={20}
            color={theme.colors?.error}
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
          addModule={addModule}
          setDiscardoChanges={() => (discardChangesRef.current = true)}
          fastAccess={fastAccessObject}
          navigation={navigation}
          showAddModuleModal={() => setAddModuleModalVisible(true)}
        />
      ) : (
        <DraggableModulesList
          value={value}
          setValue={setValue}
          changeModules={changeModules}
          deleteModule={deleteModule}
          changeModule={changeModule}
          addModule={addModule}
          setDiscardoChanges={() => (discardChangesRef.current = true)}
          fastAccess={fastAccessObject}
          navigation={navigation}
          showAddModuleModal={() => setAddModuleModalVisible(true)}
        />
      )}
      {!(width > 600) && (
        <View style={{ padding: 8, width: "100%" }}>
          <Button
            icon="content-save"
            onPress={saveValue}
            disabled={!discardChangesRef.current || value.title === ""}
            style={{
              boxShadow: theme.colors?.shadow,
            }}
          />
        </View>
      )}
      <MetaInformationModule
        lastUpdated={value.lastUpdated}
        created={value.created}
      />
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
