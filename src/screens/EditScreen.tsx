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
import FolderSelectModal from "../features/vault/components/modals/FolderSelectModal";
import { useTheme } from "../app/providers/ThemeProvider";
import DiscardChangesModal from "../features/vault/components/modals/DiscardChangesModal";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import ContainerButton from "../shared/components/buttons/ContainerButton";
import SquaredContainerButton from "../shared/components/buttons/SquaredContainerButton";
import DeleteModal from "../features/vault/components/modals/DeleteModal";
import Button from "../shared/components/buttons/Button";
import DeleteModuleModal from "../features/vault/components/modals/DeleteModuleModal";
import EditHistoryModal from "../features/vault/components/modals/EditHistoryModal";

import useAppLifecycle from "../shared/hooks/useAppLifecycle";
import {
  openFastAccess,
  hideFastAccess,
  prepareFastAccess,
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
import { logger } from "../infrastructure/logging/logger";
import { useEditHistory } from "../features/vault/utils/editHistory";
import AdaptiveMenu, {
  AdaptiveMenuItem,
} from "../shared/components/menus/AdaptiveMenu";

type EditScreenProps = NativeStackScreenProps<HomeStackParamList, "Edit">;

const EditScreen: React.FC<EditScreenProps> = ({ route, navigation }) => {
  const {
    value: routeValue,
    favorite: routeFavorite,
    folder: routeFolder,
    searchstring: routeSearchstring,
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

  const {
    value,
    canUndo,
    canRedo,
    sessionLog,
    applyChange,
    replaceCurrent,
    undo,
    redo,
    reset,
  } = useEditHistory(routeValue);

  const [addModuleModalVisible, setAddModuleModalVisible] = useState(false);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [discardChangesVisible, setDiscardChangesVisible] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteModuleModalVisible, setDeleteModuleModalVisible] =
    useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [overflowMenuVisible, setOverflowMenuVisible] = useState(false);
  const [pendingModuleDeleteId, setPendingModuleDeleteId] = useState<
    string | null
  >(null);
  const allowNextBeforeRemoveRef = useRef(false);

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

  useEffect(() => {
    if (fastAccessBehavior !== "auto") return;
    if (Platform.OS === "web") return;
    if (!fastAccessObject?.username || !fastAccessObject?.password) return;

    prepareFastAccess().catch((error) => {
      logger.warn("[EditScreen] Failed to prepare fast access:", error);
    });
  }, [fastAccessBehavior, fastAccessObject]);

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
      if (allowNextBeforeRemoveRef.current) {
        allowNextBeforeRemoveRef.current = false;
        return;
      }

      if (!canUndo) return;
      e.preventDefault();
      setDiscardChangesVisible(true);
    });

    return unsubscribe;
  }, [canUndo, navigation]);

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

    replaceCurrent((prev) => {
      if (!prev.folder) return prev;

      const exists = folders.some((f) => f.id === prev.folder!.id);
      if (exists) return prev;

      return { ...prev, folder: null };
    });
  }, [replaceCurrent, vault.folders]);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isUndo =
        (event.ctrlKey || event.metaKey) &&
        !event.shiftKey &&
        event.key.toLowerCase() === "z";
      const isRedo =
        (event.ctrlKey || event.metaKey) &&
        (event.key.toLowerCase() === "y" ||
          (event.shiftKey && event.key.toLowerCase() === "z"));

      if (isUndo && canUndo) {
        event.preventDefault();
        undo();
        return;
      }

      if (isRedo && canRedo) {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canRedo, canUndo, redo, undo]);

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

  const saveValue = () => {
    const updated: ValuesType = {
      ...value,
      lastUpdated: getDateTime(),
    };

    vault.upsertEntry(updated);
    reset(updated);
    goBack();
  };

  const goBack = () => {
    setDiscardChangesVisible(false);
    allowNextBeforeRemoveRef.current = true;
    navigation.goBack();
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
    applyChange(
      (current) => ({
        ...current,
        modules,
      }),
      {
        action: "modules",
        label: t("common:editHistoryModulesUpdated"),
      }
    );
    setAddModuleModalVisible(false);
  };

  const changeMultipleEntries = (
    folder: FolderType | null,
    favorite?: boolean
  ) => {
    applyChange(
      (current) => ({
        ...current,
        folder,
        fav: favorite === undefined ? !current.fav : favorite,
      }),
      {
        action: "folder",
        label: t("common:editHistoryFolderFavoriteUpdated"),
      }
    );
    setFolderModalVisible(false);
  };

  const changeSelectedFolder = (folder: FolderType | null) => {
    applyChange(
      (current) => ({
        ...current,
        folder,
      }),
      {
        action: "folder",
        label: t("common:editHistoryFolderUpdated"),
      }
    );
    setFolderModalVisible(false);
  };

  const changeFav = (favorite?: boolean) => {
    applyChange(
      (current) => ({
        ...current,
        fav: favorite === undefined ? !current.fav : favorite,
      }),
      {
        action: "favorite",
        label: t("common:editHistoryFavoriteUpdated"),
      }
    );
  };

  const deleteModule = (id: string) => {
    const newModules: ModulesType = [
      ...value.modules.filter((item: ModuleType) => item.id !== id),
    ];
    changeModules(newModules);
  };

  const moduleHasMeaningfulContent = (input: unknown): boolean => {
    if (input === null || input === undefined) return false;
    if (typeof input === "string") return input.trim().length > 0;
    if (typeof input === "boolean") return input;
    if (typeof input === "number") return Number.isFinite(input) && input !== 0;

    if (Array.isArray(input)) {
      if (input.length === 0) return false;
      return input.some((item) => moduleHasMeaningfulContent(item));
    }

    if (typeof input === "object") {
      return Object.entries(input as Record<string, unknown>)
        .filter(([key]) => !["id", "module"].includes(key))
        .some(([, value]) => moduleHasMeaningfulContent(value));
    }

    return false;
  };

  const requestDeleteModule = (id: string) => {
    const moduleToDelete = value.modules.find((item) => item.id === id);

    if (!moduleToDelete || !moduleHasMeaningfulContent(moduleToDelete)) {
      deleteModule(id);
      return;
    }

    setPendingModuleDeleteId(id);
    setDeleteModuleModalVisible(true);
  };

  const confirmDeleteModule = () => {
    if (!pendingModuleDeleteId) return;

    deleteModule(pendingModuleDeleteId);
    setPendingModuleDeleteId(null);
    setDeleteModuleModalVisible(false);
  };

  const changeModule = (module: ModuleType) => {
    applyChange(
      (current) => {
        const index = current.modules.findIndex((val) => val.id === module.id);
        if (index === -1) return current;

        const newModules = [...current.modules];
        newModules[index] = module;

        return {
          ...current,
          modules: newModules,
        };
      },
      {
        action: "module",
        label: t("common:editHistoryModuleUpdated"),
        coalesceKey: `module:${module.id}`,
      }
    );
  };

  const changeTitle = (title: string) => {
    applyChange(
      (current) => ({
        ...current,
        title,
      }),
      {
        action: "title",
        label: t("common:editHistoryTitleUpdated"),
        coalesceKey: "title",
      }
    );
  };

  const reorderModules = (modules: ModulesType) => {
    applyChange(
      (current) => ({
        ...current,
        modules,
      }),
      {
        action: "modules",
        label: t("common:editHistoryModulesReordered"),
      }
    );
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

  const editOverflowItems = React.useMemo<AdaptiveMenuItem[]>(
    () => [
      {
        key: "history",
        icon: "history",
        label: t("common:editHistory"),
        onPress: () => setHistoryModalVisible(true),
      },
      {
        key: "delete",
        icon: "trash-can",
        label: t("common:delete"),
        onPress: () => setDeleteModalVisible(true),
        withDivider: false,
      },
    ],
    [sessionLog.length, t]
  );

  return (
    <AnimatedContainer style={globalStyles.container}>
      <StatusBar
        animated={true}
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent={true}
      />
      <Header
        onPress={() => {
          if (canUndo) {
            setDiscardChangesVisible(true);
          } else {
            goBack();
          }
        }}
        leftNode={
          <TitleModule
            value={value}
            changeTitle={changeTitle}
            initialTitle={routeSearchstring ?? null}
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
              disabled={!canUndo || value.title === ""}
              style={{
                boxShadow: theme.colors?.shadow,
              }}
            />
          </View>
        )}
        {width > 600 && (
          <SquaredContainerButton onPress={undo} disabled={!canUndo}>
            <Icon
              source="undo-variant"
              color={
                canUndo
                  ? theme.colors?.primary
                  : theme.colors.onSurfaceDisabled
              }
              size={20}
            />
          </SquaredContainerButton>
        )}
        {width > 600 && (
          <SquaredContainerButton onPress={redo} disabled={!canRedo}>
            <Icon
              source="redo-variant"
              color={
                canRedo
                  ? theme.colors?.primary
                  : theme.colors.onSurfaceDisabled
              }
              size={20}
            />
          </SquaredContainerButton>
        )}
        {!(width > 600) && (
          <SquaredContainerButton onPress={undo} disabled={!canUndo}>
            <Icon
              source="undo-variant"
              color={
                canUndo
                  ? theme.colors?.primary
                  : theme.colors.onSurfaceDisabled
              }
              size={20}
            />
          </SquaredContainerButton>
        )}
        {!(width > 600) && (
          <SquaredContainerButton onPress={redo} disabled={!canRedo}>
            <Icon
              source="redo-variant"
              color={
                canRedo
                  ? theme.colors?.primary
                  : theme.colors.onSurfaceDisabled
              }
              size={20}
            />
          </SquaredContainerButton>
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
        <SquaredContainerButton onPress={() => setOverflowMenuVisible(true)}>
          <Icon
            source="dots-vertical"
            size={20}
            color={theme.colors?.primary}
          />
        </SquaredContainerButton>
      </View>
      <AdaptiveMenu
        visible={overflowMenuVisible}
        setVisible={setOverflowMenuVisible}
        positionY={Constants.statusBarHeight + (width > 600 ? 92 : 86)}
        items={editOverflowItems}
      />
      {Platform.OS === "web" ? (
        <DraggableModulesListWeb
          value={value}
          changeModules={reorderModules}
          deleteModule={requestDeleteModule}
          changeModule={changeModule}
          addModule={addModule}
          fastAccess={fastAccessObject}
          navigation={navigation}
          showAddModuleModal={() => setAddModuleModalVisible(true)}
        />
      ) : (
        <DraggableModulesList
          value={value}
          changeModules={reorderModules}
          deleteModule={requestDeleteModule}
          changeModule={changeModule}
          addModule={addModule}
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
            disabled={!canUndo || value.title === ""}
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
      <FolderSelectModal
        visible={folderModalVisible}
        setVisible={setFolderModalVisible}
        folders={vault.folders ?? []}
        selectedFolder={value.folder}
        onSelectFolder={changeSelectedFolder}
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
      <DeleteModuleModal
        visible={deleteModuleModalVisible}
        setVisible={(visible) => {
          setDeleteModuleModalVisible(visible);
          if (!visible) setPendingModuleDeleteId(null);
        }}
        onDelete={confirmDeleteModule}
      />
      <EditHistoryModal
        visible={historyModalVisible}
        setVisible={setHistoryModalVisible}
        entries={sessionLog}
      />
    </AnimatedContainer>
  );
};

export default EditScreen;
