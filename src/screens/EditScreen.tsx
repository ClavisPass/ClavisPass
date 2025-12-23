import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  View,
  InteractionManager,
  useWindowDimensions,
} from "react-native";
import ModulesType, { ModuleType } from "../features/vault/model/ModulesType";

import ModulesEnum from "../features/vault/model/ModulesEnum";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Icon, Text } from "react-native-paper";
import Header from "../shared/components/Header";
import ValuesType from "../features/vault/model/ValuesType";
import getModuleData from "../features/vault/utils/getModuleData";
import AddModuleModal from "../features/vault/components/modals/AddModuleModal";
import { getDateTime } from "../shared/utils/Timestamp";
import TitleModule from "../features/vault/components/modules/TitleModule";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import FolderModal from "../features/vault/components/modals/FolderModal";
import { useTheme } from "../app/providers/ThemeProvider";
import DiscardChangesModal from "../features/vault/components/modals/DiscardChangesModal";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import ContainerButton from "../shared/components/buttons/ContainerButton";
import SquaredContainerButton from "../shared/components/buttons/SquaredContainerButton";
import DeleteModal from "../features/vault/components/modals/DeleteModal";
import Button from "../shared/components/buttons/Button";

import useAppLifecycle from "../shared/hooks/useAppLifecycle";
import {
  openFastAccess,
  hideFastAccess,
} from "../features/fastaccess/utils/FastAccess";
import extractFastAccessObject from "../features/fastaccess/utils/extractFastAccessObject";
import FastAccessType from "../features/fastaccess/model/FastAccessType";
import FolderType from "../features/vault/model/FolderType";
import MetaInformationModule from "../features/vault/components/modules/MetaInformationModule";
import { useTranslation } from "react-i18next";
import { useSetting } from "../app/providers/SettingsProvider";
import DraggableModulesListWeb from "../features/vault/components/lists/DraggableModulesListWeb";
import DraggableModulesList from "../features/vault/components/lists/DraggableModulesList";
import { useVault } from "../app/providers/VaultProvider";
import { HomeStackParamList } from "../app/navigation/model/types";

type EditScreenProps = NativeStackScreenProps<HomeStackParamList, "Edit">;

const EditScreen: React.FC<EditScreenProps> = ({ route, navigation }) => {
  const {
    value: routeValue,
    favorite: routeFavorite,
    folder: routeFolder,
  } = route.params!;
  const vault = useVault();

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

    const folders = vault.folders;
    if (!folders) return;

    didValidateFolderRef.current = true;

    setValue((prev) => {
      if (!prev.folder) return prev;

      const exists = folders.some((f) => f.id === prev.folder!.id);
      if (exists) return prev;

      return { ...prev, folder: null };
    });
  }, [vault.folders]);

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
    const folders = vault.folders ?? [];
    return folders.some((f) => f.id === folder.id);
  };

  const saveValue = () => {
    const updated: ValuesType = {
      ...value,
      lastUpdated: getDateTime(),
    };

    vault.upsertEntry(updated);
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
    vault.deleteEntry(id);
    setDeleteModalVisible(false);
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
        folder={vault.folders ?? []}
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
