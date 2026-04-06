import { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../../app/providers/ThemeProvider";
import AnimatedPressable from "../../../shared/components/AnimatedPressable";

type Props = {
  children: ReactNode;
  shortcut: string;
  onPress?: () => void;
};
function SettingsItem(props: Props) {
  const { theme } = useTheme();
  const content = (
    <View
      style={{
        height: 44,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          display: "flex",
          padding: 10,
          minWidth: 140,
          minHeight: 50,
          height: 50,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        {/*
        <Icon
          size={20}
          color={theme.colors.primary}
          source={"keyboard"}
        />*/}
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
        style={{
          userSelect: "none",
          color: theme.colors.primary,
          marginRight: 10,
        }}
        numberOfLines={1}
      >
        {props.shortcut}
      </Text>
    </View>
  );

  if (props.onPress) {
    return (
      <AnimatedPressable onPress={props.onPress}>{content}</AnimatedPressable>
    );
  }

  return content;
}

export default SettingsItem;
