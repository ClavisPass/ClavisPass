import React, { ReactNode } from "react";
import {
  View,
  Pressable,
  Platform,
  ViewStyle,
  StyleProp,
  StyleSheet,
} from "react-native";
import { Icon, IconButton } from "react-native-paper";
import { useTheme } from "../../contexts/ThemeProvider";

export type EditRowControlsContainerProps = {
  id: string;
  children: ReactNode;
  onDragStart?: () => void;
  onDelete?: (id: string) => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function EditRowControlsContainer({
  id,
  children,
  onDragStart,
  onDelete,
  style,
  contentStyle,
}: EditRowControlsContainerProps) {
  const { theme, darkmode } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: "row",
          flex: 1,
          paddingLeft: 16,
          paddingRight: 4,
          borderRadius: 12,
          borderColor: darkmode ? theme.colors.outlineVariant : "white",
          borderWidth: StyleSheet.hairlineWidth,
        },
        style,
      ]}
    >
      <View
        style={{
          position: "absolute",
          left: 2,
          top: 0,
          bottom: 0,
          justifyContent: "center",
        }}
      >
        {Platform.OS === "web" ? (
          <Icon source="drag" size={20} />
        ) : (
          <Pressable onPressIn={onDragStart}>
            <Icon source="drag" size={20} />
          </Pressable>
        )}
      </View>
      <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
      <IconButton
        style={{ position: "absolute", right: 0, width: 20, height: 20 }}
        selected
        mode="contained-tonal"
        icon="close"
        size={8}
        onPress={() => onDelete?.(id)}
        tabIndex={-1 as any}
      />
    </View>
  );
}
