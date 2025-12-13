import { ReactNode } from "react";
import { View } from "react-native";
import { MenuItem } from "../../../shared/components/menus/MenuItem";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  leadingIcon?: string;
  selected?: boolean;
  label?: string;
};
function SettingsItem(props: Props) {
  return (
    <MenuItem
      onPress={props.onPress}
      leadingIcon={props.leadingIcon}
      selected={props.selected}
      label={props.label}
    >
      {props.children}
    </MenuItem>
  );
}

export default SettingsItem;
