import { useEffect, useMemo, useRef, useState } from "react";
import { Platform, View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import Modal from "./Modal";
import DraggableFolderListWeb from "../draggableFolderList/DraggableFolderListWeb";
import DraggableFolderList from "../draggableFolderList/DraggableFolderList";
import { useTheme } from "../../contexts/ThemeProvider";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  folder: string[];
  setFolder: (folder: string[]) => void;
  setSelectedFolder?: (folder: string) => void;
};

function FolderModal(props: Props) {
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
    props.setFolder(newFolder);
  };

  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View
        style={{
          //backgroundColor: "white",
          padding: 16,
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: 350,
          cursor: "auto",
        }}
      >
        <View style={globalStyles.moduleView}>
          <TextInput
            placeholder="Add Folder..."
            outlineStyle={globalStyles.outlineStyle}
            style={globalStyles.textInputStyle}
            value={searchQuery}
            mode="outlined"
            onChangeText={(text) => setSearchQuery(text)}
            autoCapitalize="none"
          />
          <IconButton
            selected
            mode={addButtonDisabled ? undefined : "contained-tonal"}
            disabled={addButtonDisabled}
            icon={"plus"}
            onPress={() => {
              props.setFolder([...props.folder, searchQuery]);
              setSearchQuery("");
            }}
          />
        </View>

        {Platform.OS === "web" ? (
          <DraggableFolderListWeb
            folder={props.folder}
            setFolder={props.setFolder}
            setSelectedFolder={props.setSelectedFolder}
            deleteFolder={deleteFolder}
          />
        ) : (
          <DraggableFolderList
            folder={props.folder}
            setFolder={props.setFolder}
            setSelectedFolder={props.setSelectedFolder}
            deleteFolder={deleteFolder}
          />
        )}
      </View>
    </Modal>
  );
}

export default FolderModal;
