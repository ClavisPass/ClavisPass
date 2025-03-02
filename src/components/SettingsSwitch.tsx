import { Pressable, View } from "react-native";
import { Switch, Text } from "react-native-paper";

type Props = {
  label: string;
  value: boolean;
  onValueChange: (checked: boolean) => void;
};

const SettingsSwitch = (props: Props) => {
  return (
    <View
      style={{
        height: 44,
        minHeight: 24,
        padding: 10,
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Pressable onPress={() => props.onValueChange(!props.value)}>
        <Text
          variant="bodyLarge"
          style={{ userSelect: "none" }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {props.label}
        </Text>
      </Pressable>
      <Switch value={props.value} onValueChange={props.onValueChange} />
    </View>
  );
};

export default SettingsSwitch;
