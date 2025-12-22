import { Pressable, View } from "react-native";
import { Switch } from "react-native-paper";
import SettingsItem from "./SettingsItem";

type Props = {
  label: string;
  value: boolean;
  onValueChange: (checked: boolean) => void;
  leadingIcon?: string;
};

const SettingsSwitch = (props: Props) => {
  return (
    <View
      style={{
        height: 44,
        minHeight: 44,
        maxHeight: 44,
        padding: 10,
        paddingLeft: 0,
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Pressable onPress={() => props.onValueChange(!props.value)}>
        <SettingsItem leadingIcon={props.leadingIcon} onPress={undefined}>
          {props.label}
        </SettingsItem>
      </Pressable>
      <Switch value={props.value} onValueChange={props.onValueChange} />
    </View>
  );
};

export default SettingsSwitch;
