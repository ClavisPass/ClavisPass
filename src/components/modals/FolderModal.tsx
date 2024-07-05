import { useEffect, useMemo, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { IconButton, Modal, Portal, TextInput } from "react-native-paper";
import getColors from "../../ui/linearGradient";
import { LinearGradient } from "expo-linear-gradient";
import globalStyles from "../../ui/globalStyles";
import DraggableFolderListWeb from "../draggableFolderList/DraggableFolderListWeb";
import DraggableFolderList from "../draggableFolderList/DraggableFolderList";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 4,
  },
});

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  folder: string[];
  setFolder: (folder: string[]) => void;
};

function FolderModal(props: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredValues = useMemo(() => {
    return props.folder.filter((item) => {
      return item.toLowerCase().includes(searchQuery.toLowerCase());
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
  }, [filteredValues]);
  return (
    <Portal>
      <Modal
        visible={props.visible}
        onDismiss={hideModal}
        contentContainerStyle={{
          backgroundColor: "transparent",
          borderRadius: 20,
          display: "flex",
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <LinearGradient
          colors={getColors()}
          style={{ padding: 3, width: 300, borderRadius: 20 }}
          end={{ x: 0.1, y: 0.2 }}
          dither={true}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 16,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <View style={globalStyles.moduleView}>
              <TextInput
                outlineStyle={globalStyles.outlineStyle}
                style={globalStyles.textInputStyle}
                value={searchQuery}
                mode="outlined"
                onChangeText={(text) => setSearchQuery(text)}
                autoCapitalize="none"
              />
              <IconButton
                icon={"plus"}
                onPress={() => {}}
                disabled={addButtonDisabled}
              />
            </View>
            {Platform.OS === "web" ? (
              <DraggableFolderListWeb
                folder={filteredValues}
                setFolder={props.setFolder}
                draggableDisabled={draggableDisabled}
              />
            ) : (
              <DraggableFolderList
                folder={filteredValues}
                setFolder={props.setFolder}
                draggableDisabled={draggableDisabled}
              />
            )}
          </View>
        </LinearGradient>
      </Modal>
    </Portal>
  );
}

export default FolderModal;
