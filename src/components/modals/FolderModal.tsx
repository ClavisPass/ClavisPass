import { useEffect, useMemo, useRef, useState } from "react";
import { Platform, View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import Modal from "./Modal";
import DraggableFolderListWeb from "../lists/draggableFolderList/DraggableFolderListWeb";
import DraggableFolderList from "../lists/draggableFolderList/DraggableFolderList";
import { useTheme } from "../../contexts/ThemeProvider";
import changeFolder from "../../utils/changeFolder";
import { useData } from "../../contexts/DataProvider";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  folder: string[];
  setSelectedFolder?: (folder: string) => void;
};

function FolderModal(props: Props) {
  const data = useData();
  const { theme } = useTheme();
  const { globalStyles } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredValues = useMemo(() => {
    return props.folder.filter((item) => {
      return item === searchQuery;
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

  const deleteFolder = (folder: string) => {
    const newFolder: string[] = [
      ...props.folder.filter((item: string) => item !== folder),
    ];
    changeFolder(newFolder, data);
    data.setShowSave(true);
  };

  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View
        style={{
          padding: 16,
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: 350,
          cursor: "auto",
          gap: 6,
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
          <TextInput
            placeholder="Add Folder..."
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
          <IconButton
            selected
            mode={addButtonDisabled ? undefined : "contained-tonal"}
            disabled={addButtonDisabled}
            icon={"plus"}
            iconColor={theme.colors.primary}
            style={{ margin: 4 }}
            onPress={() => {
              changeFolder([...props.folder, searchQuery], data);
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
