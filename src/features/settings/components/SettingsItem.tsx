import { ReactNode } from "react";
import { View } from "react-native";
import { MenuItem } from "../../../shared/components/menus/MenuItem";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  leadingIcon?: string;
  leading?: ReactNode;
  selected?: boolean;
  label?: string;
  rightIcon?: string | null;
};
function SettingsItem(props: Props) {
  return (
    <MenuItem
      onPress={props.onPress}
      leadingIcon={props.leadingIcon}
      leading={props.leading}
      selected={props.selected}
      label={props.label}
      rightIcon={props.rightIcon === undefined && props.onPress ? "chevron-right" : props.rightIcon ?? undefined}
    >
      {props.children}
    </MenuItem>
  );
}

export default SettingsItem;
