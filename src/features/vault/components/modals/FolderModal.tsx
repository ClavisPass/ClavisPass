import { useCallback, useMemo, useState } from "react";
import { Platform, Pressable, View, StyleSheet, useWindowDimensions } from "react-native";
import { Icon, Text, TextInput } from "react-native-paper";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import FolderType from "../../model/FolderType";
import createUniqueID from "../../../../shared/utils/createUniqueID";
import { useTranslation } from "react-i18next";
import DraggableFolderListWeb from "../lists/DraggableFolderListWeb";
import DraggableFolderList from "../lists/DraggableFolderList";
import Modal from "../../../../shared/components/modals/Modal";
import { useVault } from "../../../../app/providers/VaultProvider";

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
  const modalHeight = height > 760 ? 460 : 360;

  const normalizedQuery = searchQuery.trim();
  const hasExactMatch = useMemo(() => {
    return props.folder.some((item) => item.name === normalizedQuery);
  }, [props.folder, normalizedQuery]);
  const addButtonDisabled =
    normalizedQuery === "" || normalizedQuery === "Favorite" || hasExactMatch;
  const draggableDisabled = normalizedQuery !== "";

  const hideModal = () => props.setVisible(false);

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

    const next = [...props.folder, { id: createUniqueID(), name }];
    applyFolders(next);
    setSearchQuery("");
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
          width: 340,
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
            paddingHorizontal: 10,
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
              minHeight: 52,
              gap: 8,
            }}
          >
            <View
              style={{
                width: 32,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                source="folder-plus-outline"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
            </View>

            <View style={{ flex: 1, minWidth: 0 }}>
              <TextInput
                placeholder={t("common:addFolder")}
                style={{
                  borderRadius: 10,
                  borderBottomWidth: 0,
                  backgroundColor: "transparent",
                  paddingHorizontal: 0,
                  margin: 0,
                }}
                value={searchQuery}
                mode="outlined"
                onChangeText={(text) => setSearchQuery(text)}
                autoCapitalize="sentences"
                returnKeyType="done"
                onSubmitEditing={addFolder}
                outlineColor="transparent"
                activeOutlineColor="transparent"
                contentStyle={{ paddingLeft: 0, paddingRight: 0, minHeight: 36 }}
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
              draggableDisabled={draggableDisabled}
            />
          ) : (
            <DraggableFolderList
              folder={props.folder}
              setSelectedFolder={props.setSelectedFolder}
              deleteFolder={deleteFolder}
              draggableDisabled={draggableDisabled}
              persistFolderOrder={persistFolderOrder}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

export default FolderModal;
