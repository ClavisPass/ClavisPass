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
          leadingIcon={"folder"}
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
        leadingIcon={"delete"}
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
