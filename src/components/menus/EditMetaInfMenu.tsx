import { ReactNode, useState } from "react";
import { Divider } from "react-native-paper";
import { formatDateTime } from "../../utils/Timestamp";
import { View } from "react-native";
import Menu from "./Menu";
import { useData } from "../../contexts/DataProvider";
import ValuesType from "../../types/ValuesType";
import DataType from "../../types/DataType";
import DeleteModal from "../modals/DeleteModal";
import React from "react";
import { MenuItem } from "../items/MenuItem";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  created: string;
  lastUpdated: string;
  positionY: number;
};
function EditMetaInfMenu(props: Props) {
  return (
    <>
      <Menu
        visible={props.visible}
        onDismiss={() => {
          props.setVisible(false);
        }}
        positionY={props.positionY}
      >
        <MenuItem label="Created">{formatDateTime(props.created)}</MenuItem>
        <Divider />
        <MenuItem label="Last Updated">
          {formatDateTime(props.lastUpdated)}
        </MenuItem>
        
      </Menu>
    </>
  );
}

export default EditMetaInfMenu;
