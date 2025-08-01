import { Pressable, View } from "react-native";
import { Icon, Switch, Text } from "react-native-paper";
import { useTheme } from "../contexts/ThemeProvider";

type Props = {
  label: string;
  value: boolean;
  onValueChange: (checked: boolean) => void;
  leadingIcon?: string;
};

const SettingsSwitch = (props: Props) => {
  const { theme } = useTheme();
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
        {props.leadingIcon ? (
          <View
            style={{
              flex: 1,
              display: "flex",
              padding: 10,
              minWidth: 140,
              minHeight: 30,
              height: 30,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon
              size={20}
              color={theme.colors.primary}
              source={props.leadingIcon}
            />
            <Text
              variant="bodyLarge"
              style={{ userSelect: "none" }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {props.label}
            </Text>
          </View>
        ) : (
          <Text
            variant="bodyLarge"
            style={{ userSelect: "none" }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {props.label}
          </Text>
        )}
      </Pressable>
      <Switch value={props.value} onValueChange={props.onValueChange} />
    </View>
  );
};

export default SettingsSwitch;
