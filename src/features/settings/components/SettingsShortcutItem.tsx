import { ReactNode } from "react";
import { View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { useTheme } from "../../../app/providers/ThemeProvider";

type Props = {
  children: ReactNode;
  shortcut: string;
};
function SettingsItem(props: Props) {
  const { theme } = useTheme();
  return (
    <View style={{ height: 44, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
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
          source={"keyboard"}
        />
        <Text
          variant="bodyLarge"
          style={{ userSelect: "none" }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {props.children}
        </Text>
      </View>
      <Text
          variant="bodyLarge"
          style={{ userSelect: "none", color: theme.colors.primary, marginRight: 10 }}
          numberOfLines={1}
        >
          {props.shortcut}
        </Text>
    </View>
  );
}

export default SettingsItem;
