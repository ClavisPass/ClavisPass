import { ReactNode } from "react";
import { View } from "react-native";
import { MenuItem } from "./MenuItem";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  leadingIcon?: string;
  selected?: boolean;
  label?: string;
};
function SettingsItem(props: Props) {
  return (
    <View style={{ height: 44 }}>
      <MenuItem
        onPress={props.onPress}
        leadingIcon={props.leadingIcon}
        selected={props.selected}
        label={props.label}
      >
        {props.children}
      </MenuItem>
    </View>
  );
}

export default SettingsItem;
