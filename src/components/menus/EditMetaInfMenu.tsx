import { Divider } from "react-native-paper";
import { formatDateTime } from "../../utils/Timestamp";
import Menu from "./Menu";
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
