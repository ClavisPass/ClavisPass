import { useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import {
  IconButton,
  Portal,
  TextInput,
  TouchableRipple,
  Text,
} from "react-native-paper";
import getColors from "../../ui/linearGradient";
import { LinearGradient } from "expo-linear-gradient";
import globalStyles from "../../ui/globalStyles";
import Modal from "react-native-modal";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  folder: string[];
  setFolder: (folder: string[]) => void;
  navigation: any;
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
        coverScreen={false}
        isVisible={props.visible}
        onBackdropPress={hideModal}
        style={{
          zIndex: 2,
          backgroundColor: "transparent",
          borderRadius: 20,
          display: "flex",
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <View>
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
                  icon={"square-edit-outline"}
                  onPress={() => {
                    props.navigation.navigate("EditFolder", {
                      folder: props.folder,
                      setFolder: props.setFolder,
                    });
                  }}
                  //disabled={addButtonDisabled}
                />
              </View>
              <FlatList
                data={filteredValues}
                renderItem={({ item }) => (
                  <View style={globalStyles.folderContainer}>
                    <TouchableRipple
                      //style={styles.ripple}
                      onPress={() => {
                        console.log("test");
                      }}
                      rippleColor="rgba(0, 0, 0, .32)"
                    >
                      <Text
                        style={{
                          userSelect: "none",
                          fontWeight: "bold",
                          fontSize: 15,
                          //color: theme.colors.primary,
                        }}
                        variant="bodyMedium"
                      >
                        {item}
                      </Text>
                    </TouchableRipple>
                  </View>
                )}
              />
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </Portal>
  );
}

export default FolderModal;
