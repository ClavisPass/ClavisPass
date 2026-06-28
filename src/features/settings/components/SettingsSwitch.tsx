import { Pressable, View } from "react-native";
import { Switch } from "react-native-paper";
import SettingsItem from "./SettingsItem";
import SettingInfoButton, { SettingInfo } from "./SettingInfoButton";

type Props = {
  label: string;
  value: boolean;
  onValueChange: (checked: boolean) => void;
  leadingIcon?: string;
  disabled?: boolean;
  info?: SettingInfo;
};

const SettingsSwitch = (props: Props) => {
  return (
    <View
      style={{
        height: 44,
        minHeight: 44,
        maxHeight: 44,
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        <Pressable
          disabled={props.disabled}
          onPress={() => props.onValueChange(!props.value)}
          style={{ minWidth: 0 }}
        >
          <SettingsItem
            leadingIcon={props.leadingIcon}
            minWidth={0}
            onPress={undefined}
            afterLabel={
              props.info ? <SettingInfoButton {...props.info} compact /> : null
            }
          >
            {props.label}
          </SettingsItem>
        </Pressable>
      </View>
      <View style={{ paddingRight: 10 }}>
        <Switch
          value={props.value}
          onValueChange={props.onValueChange}
          disabled={props.disabled}
        />
      </View>
    </View>
  );
};

export default SettingsSwitch;
