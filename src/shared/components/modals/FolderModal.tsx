import { useEffect, useMemo, useState } from "react";
import { Platform, View, StyleSheet } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import DraggableFolderList from "../../../features/vault/components/lists/DraggableFolderList";
import { useTheme } from "../../../app/providers/ThemeProvider";
import changeFolder from "../../../features/vault/utils/changeFolder";
import { useData } from "../../../app/providers/DataProvider";
import FolderType from "../../../features/vault/model/FolderType";
import createUniqueID from "../../utils/createUniqueID";
import { useTranslation } from "react-i18next";
import DraggableFolderListWeb from "../../../features/vault/components/lists/DraggableFolderListWeb";
import Modal from "./Modal";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  folder: FolderType[];
  setSelectedFolder?: (folder: FolderType | null) => void;
};

function FolderModal(props: Props) {
  const data = useData();
  const { theme } = useTheme();
  const { globalStyles } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredValues = useMemo(() => {
    return props.folder.filter((item) => {
      return item.name === searchQuery;
    });
  }, [props.folder, searchQuery]);
  const [addButtonDisabled, setAddButtonDisabled] = useState(true);
  const [draggableDisabled, setDraggableDisabled] = useState(false);
  const hideModal = () => props.setVisible(false);
  useEffect(() => {
    if (filteredValues.length == 0) {
      setAddButtonDisabled(false);
    } else {
      setAddButtonDisabled(true);
    }
    if (filteredValues.length == props.folder.length) {
      setDraggableDisabled(false);
    } else {
      setDraggableDisabled(true);
    }
    if (searchQuery === "" || searchQuery === "Favorite") {
      setAddButtonDisabled(true);
    }
  }, [filteredValues, searchQuery]);

  useEffect(() => {
    if (addButtonDisabled) {
      setDraggableDisabled(false);
    } else {
      setDraggableDisabled(true);
    }
  }, [addButtonDisabled]);

  const deleteFolder = (folder: FolderType) => {
    const newFolder: FolderType[] = [
      ...props.folder.filter((item: FolderType) => item.id !== folder.id),
    ];
    changeFolder(newFolder, data);
    data.setShowSave(true);
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
            onPress={() => {
              changeFolder(
                [...props.folder, { id: createUniqueID(), name: searchQuery }],
                data
              );
              setSearchQuery("");
              data.setShowSave(true);
            }}
          />
        </View>

        {Platform.OS === "web" ? (
          <DraggableFolderListWeb
            data={data}
            folder={props.folder}
            setSelectedFolder={props.setSelectedFolder}
            deleteFolder={deleteFolder}
          />
        ) : (
          <DraggableFolderList
            data={data}
            folder={props.folder}
            setSelectedFolder={props.setSelectedFolder}
            deleteFolder={deleteFolder}
          />
        )}
      </View>
    </Modal>
  );
}

export default FolderModal;
