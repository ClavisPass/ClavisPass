import { ReactNode } from "react";
import { Divider} from "react-native-paper";
import { formatDateTime } from "../../utils/Timestamp";
import { View } from "react-native";
import Menu, { MenuItem } from "./Menu";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setFolderModalVisible: (visible: boolean) => void;
  created: string;
  lastUpdated: string;
  folder: string;
  folderList: string[];
  setFolderList: (folder: string[]) => void;
  favButton: ReactNode;
  positionY: number;
};
function EditMetaInfMenu(props: Props) {
  return (
    <Menu
      visible={props.visible}
      onDismiss={() => {
        props.setVisible(false);
      }}
      positionY={props.positionY}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <MenuItem
          leadingIcon={"folder-outline"}
          onPress={() => {
            props.setFolderModalVisible(true);
          }}
        >
          {props.folder === "" ? "None" : props.folder}
        </MenuItem>
        {props.favButton}
      </View>
      <Divider />
      <MenuItem>{"created: " + formatDateTime(props.created)}</MenuItem>
      <MenuItem>
        {"last updated: " + formatDateTime(props.lastUpdated)}
      </MenuItem>
      <Divider />
      <MenuItem
        leadingIcon={"delete-outline"}
        onPress={() => {
          console.log("test");
        }}
      >
        Delete
      </MenuItem>
    </Menu>
  );
}

export default EditMetaInfMenu;
