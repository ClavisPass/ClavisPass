import { MutableRefObject, ReactNode, useState } from "react";
import { Divider, IconButton } from "react-native-paper";
import theme from "../../ui/theme";
import { formatDateTime } from "../../utils/Timestamp";
import { View } from "react-native";
import FolderModal from "../modals/FolderModal";
import Menu, { MenuItem } from "./Menu";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  created: string;
  lastUpdated: string;
  folder: string;
  folderList: string[];
  setFolderList: (folder: string[]) => void;
  favButton: ReactNode;
  navigation: any;
  positionY: number;
};
function EditMetaInfMenu(props: Props) {
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  return (
    <Menu
      visible={props.visible}
      onDismiss={() => {
        props.setVisible(false);
      }}
      positionY={props.positionY}
    >
      <View style={{ display: "flex", flexDirection: "row" }}>
        <MenuItem leadingIcon={"folder"}>
          {props.folder === "" ? "None" : props.folder}
        </MenuItem>
        <IconButton
          icon="pencil"
          size={20}
          iconColor={theme.colors.primary}
          onPress={() => {
            setFolderModalVisible(true);
          }}
        />
        <FolderModal
          visible={folderModalVisible}
          setVisible={setFolderModalVisible}
          folder={props.folderList}
          setFolder={props.setFolderList}
          navigation={props.navigation}
        />
        {props.favButton}
      </View>
      <Divider />
      <MenuItem>{"created: " + formatDateTime(props.created)}</MenuItem>
      <MenuItem>
        {"last updated: " + formatDateTime(props.lastUpdated)}
      </MenuItem>
      <Divider />
      <MenuItem leadingIcon={"delete"}>Delete</MenuItem>
    </Menu>
  );
}

export default EditMetaInfMenu;
