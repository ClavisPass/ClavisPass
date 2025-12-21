import { useEffect, useMemo, useState } from "react";
import { Platform, View, StyleSheet } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
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
  const { theme, globalStyles } = useTheme();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredValues = useMemo(() => {
    return props.folder.filter((item) => item.name === searchQuery);
  }, [props.folder, searchQuery]);

  const [addButtonDisabled, setAddButtonDisabled] = useState(true);
  const [draggableDisabled, setDraggableDisabled] = useState(false);

  const hideModal = () => props.setVisible(false);

  useEffect(() => {
    if (filteredValues.length === 0) setAddButtonDisabled(false);
    else setAddButtonDisabled(true);

    if (filteredValues.length === props.folder.length) setDraggableDisabled(false);
    else setDraggableDisabled(true);

    if (searchQuery === "" || searchQuery === "Favorite") {
      setAddButtonDisabled(true);
    }
  }, [filteredValues, searchQuery, props.folder.length]);

  useEffect(() => {
    setDraggableDisabled(!addButtonDisabled);
  }, [addButtonDisabled]);

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

  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View
        style={{
          padding: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: 350,
          cursor: "auto",
          gap: 6,
          borderRadius: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.outlineVariant,
        }}
      >
        <View
          style={[
            globalStyles.moduleView,
            {
              backgroundColor: "transparent",
              opacity: draggableDisabled ? 0.98 : 1,
            },
          ]}
        >
          <View style={{ flexGrow: 1 }}>
            <TextInput
              placeholder={t("common:addFolder")}
              style={[
                globalStyles.textInputStyle,
                {
                  borderColor: theme.colors.primary,
                  borderBottomWidth: 0,
                  backgroundColor: "transparent",
                },
              ]}
              value={searchQuery}
              mode="flat"
              onChangeText={(text) => setSearchQuery(text)}
              autoCapitalize="none"
            />
          </View>

          <IconButton
            selected
            mode={addButtonDisabled ? undefined : "contained-tonal"}
            disabled={addButtonDisabled}
            icon={"plus"}
            iconColor={theme.colors.primary}
            style={{ margin: 4 }}
            onPress={addFolder}
          />
        </View>

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
          />
        )}
      </View>
    </Modal>
  );
}

export default FolderModal;
