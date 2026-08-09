import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  InteractionManager,
  useWindowDimensions,
} from "react-native";
import ModulesType, { ModuleType } from "../features/vault/model/ModulesType";

import ModulesEnum from "../features/vault/model/ModulesEnum";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Chip, Icon, Text } from "react-native-paper";
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
import FocusAwareStatusBar from "../shared/components/FocusAwareStatusBar";
import Constants from "expo-constants";
import SquaredContainerButton from "../shared/components/buttons/SquaredContainerButton";
import DeleteModal from "../features/vault/components/modals/DeleteModal";
import Button from "../shared/components/buttons/Button";
import DeleteModuleModal from "../features/vault/components/modals/DeleteModuleModal";
import ClearModulesModal from "../features/vault/components/modals/ClearModulesModal";
import EditHistoryModal from "../features/vault/components/modals/EditHistoryModal";
import EntryTagsModal, {
  normalizeTags,
} from "../features/vault/components/modals/EntryTagsModal";

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
import ModulesList from "../features/vault/components/lists/ModulesList";
import { useVault } from "../app/providers/VaultProvider";
import { HomeStackParamList } from "../app/navigation/model/types";
import { logger } from "../infrastructure/logging/logger";
import { useEditHistory } from "../features/vault/utils/editHistory";
import AdaptiveMenu, {
  AdaptiveMenuItem,
} from "../shared/components/menus/AdaptiveMenu";
import AppTooltip from "../shared/components/tooltips/AppTooltip";
import PerfProfiler from "../shared/performance/PerfProfiler";
import AnimatedPressable from "../shared/components/AnimatedPressable";
import {
  DEFAULT_FOLDER_ICON,
  getFolderColor,
  getFolderIcon,
} from "../features/vault/utils/folderAppearance";
import {
  canExportVCard,
  exportVCard,
} from "../features/vault/utils/vcardExport";

type EditScreenProps = NativeStackScreenProps<HomeStackParamList, "Edit">;

const VerticalReorderIcon = ({
  color,
  size = 18,
}: {
  color?: string;
  size?: number;
}) => (
  <View
    style={{
      width: size,
      height: size,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View style={{ height: size / 2, marginBottom: -2 }}>
      <Icon source="chevron-up" size={size * 0.72} color={color} />
    </View>
    <View style={{ height: size / 2, marginTop: -2 }}>
      <Icon source="chevron-down" size={size * 0.72} color={color} />
    </View>
  </View>
);

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
  const [clearModulesModalVisible, setClearModulesModalVisible] =
    useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [tagsModalVisible, setTagsModalVisible] = useState(false);
  const [overflowMenuVisible, setOverflowMenuVisible] = useState(false);
  const [overflowMenuAnchor, setOverflowMenuAnchor] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [pendingModuleDeleteId, setPendingModuleDeleteId] = useState<
    string | null
  >(null);
  const allowNextBeforeRemoveRef = useRef(false);

  const [favIcon, setFavIcon] = useState("star-outline");

  const didValidateFolderRef = useRef(false);
  const actionChipScrollRef = useRef<ScrollView>(null);
  const actionChipOffsetRef = useRef(0);
  const actionChipTargetOffsetRef = useRef(0);
  const actionChipAnimationFrameRef = useRef<number | null>(null);
  const actionChipContentWidthRef = useRef(0);
  const actionChipViewportWidthRef = useRef(0);
  const moreChipRef = useRef<View>(null);

  const [fastAccessObject, setFastAccessObject] =
    useState<FastAccessType | null>(
      extractFastAccessObject(value.modules, value.title),
    );

  const getMaxActionChipOffset = React.useCallback(
    () =>
      Math.max(
        0,
        actionChipContentWidthRef.current - actionChipViewportWidthRef.current,
      ),
    [],
  );

  const animateActionChipScroll = React.useCallback(() => {
    const current = actionChipOffsetRef.current;
    const target = Math.min(
      actionChipTargetOffsetRef.current,
      getMaxActionChipOffset(),
    );
    const distance = target - current;

    if (Math.abs(distance) < 0.5) {
      actionChipOffsetRef.current = target;
      actionChipTargetOffsetRef.current = target;
      actionChipAnimationFrameRef.current = null;
      actionChipScrollRef.current?.scrollTo({ animated: false, x: target });
      return;
    }

    const next = current + distance * 0.28;
    actionChipOffsetRef.current = next;
    actionChipScrollRef.current?.scrollTo({ animated: false, x: next });
    actionChipAnimationFrameRef.current = window.requestAnimationFrame(
      animateActionChipScroll,
    );
  }, [getMaxActionChipOffset]);

  const startSmoothActionChipScroll = React.useCallback(
    (targetOffset: number) => {
      actionChipTargetOffsetRef.current = Math.min(
        Math.max(0, targetOffset),
        getMaxActionChipOffset(),
      );

      if (actionChipAnimationFrameRef.current === null) {
        actionChipAnimationFrameRef.current = window.requestAnimationFrame(
          animateActionChipScroll,
        );
      }
    },
    [animateActionChipScroll, getMaxActionChipOffset],
  );

  const handleActionChipScroll = React.useCallback((event: any) => {
    const offset = event?.nativeEvent?.contentOffset?.x ?? 0;
    actionChipOffsetRef.current = offset;
    if (actionChipAnimationFrameRef.current === null) {
      actionChipTargetOffsetRef.current = offset;
    }
  }, []);

  const handleActionChipWheel = React.useCallback(
    (event: any) => {
      if (Platform.OS !== "web") return;

      const nativeEvent = event?.nativeEvent ?? event;
      const deltaX = nativeEvent?.deltaX ?? 0;
      const deltaY = nativeEvent?.deltaY ?? 0;
      const rawDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
      const deltaMode = nativeEvent?.deltaMode ?? 0;
      const delta =
        deltaMode === 1
          ? rawDelta * 16
          : deltaMode === 2
            ? rawDelta * actionChipViewportWidthRef.current
            : rawDelta;
      if (!delta) return;

      nativeEvent?.preventDefault?.();
      startSmoothActionChipScroll(actionChipTargetOffsetRef.current + delta);
    },
    [startSmoothActionChipScroll],
  );

  const actionChipWheelProps =
    Platform.OS === "web" ? ({ onWheel: handleActionChipWheel } as any) : {};

  useEffect(
    () => () => {
      if (
        Platform.OS === "web" &&
        actionChipAnimationFrameRef.current !== null
      ) {
        window.cancelAnimationFrame(actionChipAnimationFrameRef.current);
      }
    },
    [],
  );

  useFocusEffect(
    React.useCallback(() => {
      let task = InteractionManager.runAfterInteractions(() => {
        setHeaderSpacing(260);
        setHeaderWhite(false);
      });
      return () => task?.cancel?.();
    }, []),
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
      fastAccessObject.password,
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
      },
    );
    setAddModuleModalVisible(false);
  };

  const changeMultipleEntries = (
    folder: FolderType | null,
    favorite?: boolean,
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
      },
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
      },
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
      },
    );
  };

  const changePin = () => {
    applyChange(
      (current) => ({
        ...current,
        pinnedAt: current.pinnedAt ? null : new Date().toISOString(),
      }),
      {
        action: "pin",
        label: t("common:editHistoryPinUpdated"),
      },
    );
  };

  const changeTags = (tags: string[]) => {
    const nextTags = normalizeTags(tags);

    applyChange(
      (current) => ({
        ...current,
        tags: nextTags.length > 0 ? nextTags : undefined,
      }),
      {
        action: "tags",
        label: t("common:editHistoryTagsUpdated"),
      },
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
      },
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
      },
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
      },
    );
  };

  const clearModules = () => {
    applyChange(
      (current) => ({
        ...current,
        modules: [] as ModulesType,
      }),
      {
        action: "modules",
        label: t("common:editHistoryModulesCleared"),
      },
    );
    setClearModulesModalVisible(false);
  };

  const openModuleReorderScreen = () => {
    if (value.modules.length < 2) return;

    navigation.navigate("ModuleReorder", {
      modules: [...value.modules] as ModulesType,
      onApply: reorderModules,
    });
  };

  const taskModuleCount = value.modules.filter(
    (module) => module.module === ModulesEnum.TASK,
  ).length;

  const tagSuggestions = React.useMemo(
    () =>
      normalizeTags([
        ...vault.entries.flatMap((entry) => entry.tags ?? []),
        ...(value.tags ?? []),
      ]).sort((a, b) => a.localeCompare(b)),
    [value.tags, vault.entries],
  );

  const sortCompletedTasksDown = () => {
    if (taskModuleCount <= 1) return;

    const sortTaskBlock = (modules: ModulesType): ModulesType =>
      [
        ...modules.filter(
          (module) => !("completed" in module) || !module.completed,
        ),
        ...modules.filter(
          (module) => "completed" in module && module.completed,
        ),
      ] as ModulesType;

    const newModules: ModuleType[] = [];
    let taskBlock: ModuleType[] = [];

    value.modules.forEach((module) => {
      if (module.module === ModulesEnum.TASK) {
        taskBlock.push(module);
        return;
      }

      if (taskBlock.length > 0) {
        newModules.push(...sortTaskBlock(taskBlock as ModulesType));
        taskBlock = [];
      }
      newModules.push(module);
    });

    if (taskBlock.length > 0) {
      newModules.push(...sortTaskBlock(taskBlock as ModulesType));
    }

    const changed = newModules.some(
      (module, index) => module.id !== value.modules[index].id,
    );
    if (changed) {
      reorderModules(newModules as ModulesType);
    }
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
      ...(taskModuleCount > 1
        ? [
            {
              key: "sortCompletedTasksDown",
              icon: "sort-descending",
              label: t("common:sortCompletedTasksDown"),
              onPress: sortCompletedTasksDown,
            },
          ]
        : []),
      {
        key: "pin",
        icon: value.pinnedAt ? "pin-off" : "pin",
        label: value.pinnedAt ? t("common:removePin") : t("common:addPin"),
        onPress: changePin,
      },
      {
        key: "history",
        icon: "history",
        label: t("common:editHistory"),
        onPress: () => setHistoryModalVisible(true),
      },
      ...(canExportVCard(value)
        ? [
            {
              key: "exportVCard",
              icon: "card-account-details-outline",
              label: t("common:exportVCard"),
              onPress: () => {
                void exportVCard(value);
              },
            },
          ]
        : []),
      ...(value.modules.length > 0
        ? [
            {
              key: "clearModules",
              icon: "delete-sweep",
              label: t("common:clearModules"),
              onPress: () => setClearModulesModalVisible(true),
            },
          ]
        : []),
      {
        key: "delete",
        icon: "trash-can",
        label: t("common:delete"),
        onPress: () => setDeleteModalVisible(true),
        withDivider: false,
      },
    ],
    [
      sessionLog.length,
      sortCompletedTasksDown,
      t,
      taskModuleCount,
      value,
      value.modules.length,
      value.pinnedAt,
    ],
  );

  const actionChipStyle = {
    height: 30,
    borderRadius: 12,
  };

  const actionChipTextStyle = {
    fontSize: 12,
    lineHeight: 16,
  };
  const editSectionSpacing = 4;

  const openOverflowMenu = () => {
    if (Platform.OS !== "web") {
      setOverflowMenuVisible(true);
      return;
    }

    moreChipRef.current?.measureInWindow?.((x, y, _chipWidth, chipHeight) => {
      setOverflowMenuAnchor({ x, y: y + chipHeight });
      setOverflowMenuVisible(true);
    });
  };

  const renderEditActionChips = () => (
    <ScrollView
      ref={actionChipScrollRef}
      {...actionChipWheelProps}
      horizontal
      showsHorizontalScrollIndicator={false}
      onLayout={(event) => {
        actionChipViewportWidthRef.current = event.nativeEvent.layout.width;
      }}
      onContentSizeChange={(contentWidth) => {
        actionChipContentWidthRef.current = contentWidth;
      }}
      onScroll={handleActionChipScroll}
      scrollEventThrottle={16}
      contentContainerStyle={{
        alignItems: "center",
        flexDirection: "row",
        flexGrow: 1,
        gap: editSectionSpacing,
        justifyContent: "flex-start",
        paddingHorizontal: 8,
        paddingTop: editSectionSpacing,
        paddingBottom: editSectionSpacing,
      }}
      style={{ flexGrow: 0, width: "100%" }}
    >
      <Chip
        compact
        icon="plus"
        onPress={() => {
          Keyboard.dismiss();
          setAddModuleModalVisible(true);
        }}
        style={actionChipStyle}
        textStyle={actionChipTextStyle}
      >
        {t("common:addModule")}
      </Chip>
      <Chip
        compact
        icon={({ color, size }) => (
          <VerticalReorderIcon color={color} size={size} />
        )}
        disabled={value.modules.length < 2}
        onPress={openModuleReorderScreen}
        style={actionChipStyle}
        textStyle={actionChipTextStyle}
      >
        {t("home:reorderChip")}
      </Chip>
      <Chip
        compact
        icon={(value.tags?.length ?? 0) > 0 ? "tag" : "tag-outline"}
        onPress={() => setTagsModalVisible(true)}
        style={actionChipStyle}
        textStyle={actionChipTextStyle}
      >
        {t("common:tags")}
      </Chip>
      <View ref={moreChipRef} collapsable={false}>
        <Chip
          compact
          icon="dots-horizontal"
          onPress={openOverflowMenu}
          style={actionChipStyle}
          textStyle={actionChipTextStyle}
        >
          {t("common:more")}
        </Chip>
      </View>
    </ScrollView>
  );

  const renderControlDivider = () => (
    <View
      style={{
        width: StyleSheet.hairlineWidth,
        height: 24,
        alignSelf: "center",
        backgroundColor: darkmode
          ? theme.colors.outlineVariant
          : "rgba(0, 0, 0, 0.12)",
      }}
    />
  );

  const renderControlSegment = ({
    children,
    disabled,
    flexGrow,
    justifyContent = "center",
    onPress,
    roundedEnd,
    roundedStart,
    tooltip,
  }: {
    children: React.ReactNode;
    disabled?: boolean;
    flexGrow?: number;
    justifyContent?: "center" | "flex-start";
    onPress: () => void;
    roundedEnd?: boolean;
    roundedStart?: boolean;
    tooltip: string;
  }) => {
    const pressable = (
        <AnimatedPressable
          disabled={disabled}
          style={{
            flex: 1,
            height: "100%",
            padding: 6,
            display: "flex",
            justifyContent,
            alignItems: "center",
            backgroundColor: "transparent",
            borderTopLeftRadius: roundedStart ? 8 : 0,
            borderBottomLeftRadius: roundedStart ? 8 : 0,
            borderTopRightRadius: roundedEnd ? 8 : 0,
            borderBottomRightRadius: roundedEnd ? 8 : 0,
            overflow: "hidden",
          }}
          onPress={onPress}
        >
          {children}
        </AnimatedPressable>
    );

    return (
      <View
        style={{
          width: flexGrow ? undefined : 40,
          flexBasis: flexGrow ? 100 : undefined,
          flexGrow: flexGrow ?? 0,
          flexShrink: flexGrow ? 1 : 0,
          overflow: "hidden",
          justifyContent: "center",
          alignSelf: "stretch",
        }}
      >
        {Platform.OS === "web" ? (
          <AppTooltip title={tooltip}>{pressable}</AppTooltip>
        ) : (
          pressable
        )}
      </View>
    );
  };

  const renderEditControlGroup = () => (
    <View
      style={{
        height: 40,
        flexBasis: 220,
        flexGrow: 5,
        flexShrink: 1,
        flexDirection: "row",
        alignItems: "stretch",
        borderRadius: 12,
        paddingHorizontal: editSectionSpacing,
        margin: 0,
        overflow: "hidden",
        backgroundColor: theme.colors.background,
        boxShadow: theme.colors.shadow,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: darkmode ? theme.colors.outlineVariant : "white",
      }}
    >
      {renderControlSegment({
        disabled: !canUndo,
        onPress: undo,
        roundedStart: true,
        tooltip: t("common:undo"),
        children: (
          <Icon
            source="undo-variant"
            color={
              canUndo ? theme.colors.primary : theme.colors.onSurfaceDisabled
            }
            size={20}
          />
        ),
      })}
      {renderControlDivider()}
      {renderControlSegment({
        disabled: !canRedo,
        onPress: redo,
        tooltip: t("common:redo"),
        children: (
          <Icon
            source="redo-variant"
            color={
              canRedo ? theme.colors.primary : theme.colors.onSurfaceDisabled
            }
            size={20}
          />
        ),
      })}
      {renderControlDivider()}
      {renderControlSegment({
        onPress: () => changeFav(!value.fav),
        tooltip: value.fav
          ? t("common:removeFavorite")
          : t("common:addFavorite"),
        children: (
          <Icon source={favIcon} color={theme.colors.primary} size={20} />
        ),
      })}
      {renderControlDivider()}
      {renderControlSegment({
        flexGrow: 5,
        justifyContent: "center",
        onPress: () => {
          setFolderModalVisible(true);
        },
        roundedEnd: true,
        tooltip: t("common:moveToFolder"),
        children: (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              minWidth: 0,
              width: "100%",
            }}
          >
            <Icon
              source={
                value.folder ? getFolderIcon(value.folder) : DEFAULT_FOLDER_ICON
              }
              size={20}
              color={
                value.folder
                  ? (getFolderColor(value.folder) ?? theme.colors.primary)
                  : theme.colors.primary
              }
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ userSelect: "none", flexShrink: 1 }}
            >
              {value.folder === null ||
              value.folder.name === "" ||
              value.folder === undefined
                ? t("common:none")
                : value.folder.name}
            </Text>
          </View>
        ),
      })}
    </View>
  );

  return (
    <AnimatedContainer style={globalStyles.container}>
      <FocusAwareStatusBar
        animated={true}
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent={true}
      />
      <Header
        marginBottom={0}
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
      />
      {renderEditActionChips()}
      <View
        style={{
          width: "100%",
          paddingHorizontal: 8,
          paddingTop: 0,
          paddingBottom: editSectionSpacing,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: editSectionSpacing,
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
        {renderEditControlGroup()}
        {fastAccessObject === null ||
        fastAccessObject.username === "" ||
        fastAccessObject.password === "" ? null : (
          <AppTooltip title={t("common:fastAccess")}>
            <SquaredContainerButton onPress={openFastAccessFeature}>
              <Icon
                source={"tooltip-account"}
                color={theme.colors.primary}
                size={20}
              />
            </SquaredContainerButton>
          </AppTooltip>
        )}
      </View>
      <AdaptiveMenu
        visible={overflowMenuVisible}
        setVisible={setOverflowMenuVisible}
        positionY={
          overflowMenuAnchor?.y ??
          Constants.statusBarHeight + (width > 600 ? 126 : 120)
        }
        positionX={overflowMenuAnchor?.x}
        items={editOverflowItems}
      />
      <PerfProfiler id="EditScreen.ModulesList">
        <ModulesList
          value={value}
          deleteModule={requestDeleteModule}
          changeModule={changeModule}
          addModule={addModule}
          fastAccess={fastAccessObject}
          navigation={navigation}
        />
      </PerfProfiler>
      {!(width > 600) && (
        <View
          style={{
            paddingHorizontal: 8,
            paddingTop: 0,
            paddingBottom: editSectionSpacing,
            width: "100%",
          }}
        >
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
      <ClearModulesModal
        visible={clearModulesModalVisible}
        setVisible={setClearModulesModalVisible}
        onClear={clearModules}
      />
      <EditHistoryModal
        visible={historyModalVisible}
        setVisible={setHistoryModalVisible}
        entries={sessionLog}
      />
      <EntryTagsModal
        visible={tagsModalVisible}
        setVisible={setTagsModalVisible}
        tags={value.tags ?? []}
        suggestions={tagSuggestions}
        onChangeTags={changeTags}
      />
    </AnimatedContainer>
  );
};

export default EditScreen;
