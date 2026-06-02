import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Divider, Icon, Text, TextInput } from "react-native-paper";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import FolderType from "../../model/FolderType";
import createUniqueID from "../../../../shared/utils/createUniqueID";
import { useTranslation } from "react-i18next";
import DraggableFolderListWeb from "../lists/DraggableFolderListWeb";
import DraggableFolderList from "../lists/DraggableFolderList";
import Modal from "../../../../shared/components/modals/Modal";
import { useVault } from "../../../../app/providers/VaultProvider";
import {
  DEFAULT_FOLDER_ICON,
  FOLDER_COLOR_OPTIONS,
  FOLDER_ICON_OPTIONS,
} from "../../utils/folderAppearance";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  folder: FolderType[];
  setSelectedFolder?: (folder: FolderType | null) => void;
};

function FolderModal(props: Props) {
  const vault = useVault();
  const { theme, darkmode } = useTheme();
  const { t } = useTranslation();
  const { height } = useWindowDimensions();

  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderIcon, setNewFolderIcon] = useState<string | undefined>();
  const [newFolderColor, setNewFolderColor] = useState<string | undefined>();
  const [appearanceTarget, setAppearanceTarget] = useState<
    | { kind: "new" }
    | { kind: "existing"; folder: FolderType }
    | null
  >(null);
  const availableModalHeight = Math.max(
    320,
    height - (Platform.OS === "web" ? 48 : 80)
  );
  const modalHeight = Math.min(height > 760 ? 560 : 460, availableModalHeight);

  const normalizedQuery = searchQuery.trim();
  const hasExactMatch = useMemo(() => {
    return props.folder.some((item) => item.name === normalizedQuery);
  }, [props.folder, normalizedQuery]);
  const addButtonDisabled =
    normalizedQuery === "" || normalizedQuery === "Favorite" || hasExactMatch;
  const draggableDisabled = normalizedQuery !== "";

  const hideModal = () => props.setVisible(false);

  useEffect(() => {
    if (!props.visible) return;

    setNewFolderIcon(undefined);
    setNewFolderColor(undefined);
    setAppearanceTarget(null);
  }, [props.visible]);

  const applyFolders = (nextFolders: FolderType[]) => {
    vault.update((draft) => {
      draft.folder = nextFolders;
    });
  };

  const deleteFolder = (folder: FolderType) => {
    const newFolder: FolderType[] = props.folder.filter(
      (item: FolderType) => item.id !== folder.id
    );
    applyFolders(newFolder);
  };

  const addFolder = () => {
    const name = searchQuery.trim();
    if (!name) return;

    const next = [
      ...props.folder,
      {
        id: createUniqueID(),
        name,
        ...(newFolderIcon ? { icon: newFolderIcon } : {}),
        ...(newFolderColor ? { color: newFolderColor } : {}),
      },
    ];
    applyFolders(next);
    setSearchQuery("");
    setNewFolderIcon(undefined);
    setNewFolderColor(undefined);
  };

  const updateFolder = (folder: FolderType) => {
    vault.update((draft) => {
      draft.folder = props.folder.map((item) =>
        item.id === folder.id ? folder : item
      );
      draft.values = (draft.values ?? []).map((entry) =>
        entry.folder?.id === folder.id ? { ...entry, folder } : entry
      );
    });
  };

  const appearanceIcon =
    appearanceTarget?.kind === "existing"
      ? appearanceTarget.folder.icon
      : newFolderIcon;
  const appearanceColor =
    appearanceTarget?.kind === "existing"
      ? appearanceTarget.folder.color
      : newFolderColor;

  const updateAppearance = (next: {
    icon?: string | undefined;
    color?: string | undefined;
  }) => {
    if (!appearanceTarget) return;

    if (appearanceTarget.kind === "new") {
      setNewFolderIcon(next.icon);
      setNewFolderColor(next.color);
      return;
    }

    const folder = {
      ...appearanceTarget.folder,
      icon: next.icon,
      color: next.color,
    };
    setAppearanceTarget({ kind: "existing", folder });
    updateFolder(folder);
  };

  const persistFolderOrder = useCallback(
    (nextFolders: FolderType[]) => {
      vault.update((draft) => {
        draft.folder = nextFolders;
      });
    },
    [vault]
  );

  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View
        style={{
          padding: 18,
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
          flexDirection: "column",
          height: modalHeight,
          width: 380,
          gap: 12,
          borderRadius: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.outlineVariant,
          backgroundColor: theme.colors.elevation.level2,
          boxShadow: theme.colors.shadow,
        }}
      >
        <View
          style={{
            alignSelf: "stretch",
            gap: 4,
            paddingBottom: 2,
          }}
        >
          <Text variant="titleLarge" style={{ userSelect: "none" }}>
            {t("common:addFolder")}
          </Text>
          <Text variant="bodyMedium" style={{ userSelect: "none", opacity: 0.72 }}>
            {t("common:manageFoldersDescription")}
          </Text>
        </View>

        <View
          style={{
            alignSelf: "stretch",
            paddingHorizontal: 8,
            paddingVertical: 8,
            borderRadius: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.outlineVariant,
            backgroundColor: theme.colors.background,
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "transparent",
              opacity: draggableDisabled ? 0.98 : 1,
              borderRadius: 12,
              paddingHorizontal: 0,
              minHeight: 36,
              gap: 8,
            }}
          >
            <AnimatedPressable
              borderless={false}
              onPress={() => setAppearanceTarget({ kind: "new" })}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                source={newFolderIcon ?? DEFAULT_FOLDER_ICON}
                size={20}
                color={newFolderColor ?? theme.colors.primary}
              />
            </AnimatedPressable>

            <View style={{ flex: 1, minWidth: 0 }}>
              <TextInput
                placeholder={t("common:addFolder")}
                style={{
                  borderRadius: 10,
                  borderBottomWidth: 0,
                  backgroundColor: "transparent",
                  paddingHorizontal: 0,
                  margin: 0,
                  height: 36,
                }}
                value={searchQuery}
                mode="outlined"
                onChangeText={(text) => setSearchQuery(text)}
                autoCapitalize="sentences"
                returnKeyType="done"
                onSubmitEditing={addFolder}
                outlineColor="transparent"
                activeOutlineColor="transparent"
                contentStyle={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                  minHeight: 32,
                }}
              />
            </View>

            <Pressable
              disabled={addButtonDisabled}
              onPress={addFolder}
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: addButtonDisabled
                  ? theme.colors.surfaceDisabled
                  : theme.colors.primary,
                opacity: addButtonDisabled ? 0.7 : 1,
              }}
            >
              <Icon
                source="plus"
                size={20}
                color={
                  addButtonDisabled ? theme.colors.onSurfaceDisabled : theme.colors.onPrimary
                }
              />
            </Pressable>
          </View>

        </View>

        <View
          style={{
            alignSelf: "stretch",
            flex: 1,
            borderRadius: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.outlineVariant,
            backgroundColor: theme.colors.background,
            paddingHorizontal: 8,
            paddingTop: 8,
            paddingBottom: 4,
            overflow: "hidden",
          }}
        >
          {Platform.OS === "web" ? (
            <DraggableFolderListWeb
              folder={props.folder}
              setSelectedFolder={props.setSelectedFolder}
              deleteFolder={deleteFolder}
              openAppearance={(folder) =>
                setAppearanceTarget({ kind: "existing", folder })
              }
              draggableDisabled={draggableDisabled}
              persistFolderOrder={persistFolderOrder}
            />
          ) : (
            <DraggableFolderList
              folder={props.folder}
              setSelectedFolder={props.setSelectedFolder}
              deleteFolder={deleteFolder}
              openAppearance={(folder) =>
                setAppearanceTarget({ kind: "existing", folder })
              }
              draggableDisabled={draggableDisabled}
              persistFolderOrder={persistFolderOrder}
            />
          )}
        </View>
      </View>
      <Modal
        visible={appearanceTarget !== null}
        onDismiss={() => setAppearanceTarget(null)}
      >
        <View
          style={{
            width: 340,
            padding: 16,
            borderRadius: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.outlineVariant,
            backgroundColor: theme.colors.elevation.level2,
            boxShadow: theme.colors.shadow,
            gap: 14,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.colors.secondaryContainer,
              }}
            >
              <Icon
                source={appearanceIcon ?? DEFAULT_FOLDER_ICON}
                size={22}
                color={appearanceColor ?? theme.colors.primary}
              />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text variant="titleMedium" style={{ userSelect: "none" }}>
                {appearanceTarget?.kind === "existing"
                  ? appearanceTarget.folder.name
                  : searchQuery.trim() || t("common:addFolder")}
              </Text>
            </View>
          </View>

          <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />

          <ScrollView style={{ maxHeight: 148 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {FOLDER_ICON_OPTIONS.map((icon) => {
                const selected =
                  (appearanceIcon ?? DEFAULT_FOLDER_ICON) === icon;
                return (
                  <AnimatedPressable
                    key={icon}
                    borderless={false}
                    onPress={() =>
                      updateAppearance({
                        icon: icon === DEFAULT_FOLDER_ICON ? undefined : icon,
                        color: appearanceColor,
                      })
                    }
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: selected
                        ? theme.colors.secondaryContainer
                        : "transparent",
                    }}
                  >
                    <Icon
                      source={icon}
                      size={20}
                      color={
                        selected
                          ? theme.colors.primary
                          : theme.colors.onSurfaceVariant
                      }
                    />
                  </AnimatedPressable>
                );
              })}
            </View>
          </ScrollView>

          <Divider style={{ backgroundColor: theme.colors.outlineVariant }} />

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <AnimatedPressable
              borderless={false}
              onPress={() =>
                updateAppearance({ icon: appearanceIcon, color: undefined })
              }
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: theme.colors.outlineVariant,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.colors.background,
              }}
            >
              <Icon
                source="minus"
                size={16}
                color={
                  appearanceColor
                    ? theme.colors.onSurfaceVariant
                    : theme.colors.primary
                }
              />
            </AnimatedPressable>
            {FOLDER_COLOR_OPTIONS.map((color) => (
              <AnimatedPressable
                key={color}
                borderless={false}
                onPress={() => updateAppearance({ icon: appearanceIcon, color })}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  backgroundColor: color,
                  borderWidth:
                    appearanceColor === color ? 2 : StyleSheet.hairlineWidth,
                  borderColor:
                    appearanceColor === color
                      ? theme.colors.onSurface
                      : theme.colors.outlineVariant,
                }}
              />
            ))}
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

export default FolderModal;
