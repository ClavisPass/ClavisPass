import React, { ReactNode } from "react";
import {
  View,
  Pressable,
  Platform,
  ViewStyle,
  StyleProp,
  StyleSheet,
} from "react-native";
import { Divider, Icon, IconButton } from "react-native-paper";
import { useTheme } from "../../../app/providers/ThemeProvider";
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
} from "react-native-reanimated";
import AnimatedPressable from "../../../shared/components/AnimatedPressable";

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
    <Animated.View
      exiting={FadeOutUp.duration(150)}
      style={[
        {
          flexDirection: "row",
          flex: 1,
          borderRadius: 12,
          borderColor: darkmode ? theme.colors.outlineVariant : "white",
          borderWidth: StyleSheet.hairlineWidth,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <View
        style={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <AnimatedPressable
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPressIn={Platform.OS === "web" ? ()=>{} : onDragStart}
        >
          <Icon source="drag" size={20} />
        </AnimatedPressable>
        <Divider
          style={{
            width: StyleSheet.hairlineWidth,
            alignSelf: "stretch",
            height: "100%",
          }}
        />
      </View>
      <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
      <View>
        <IconButton
          style={{ position: "absolute", right: 0, width: 24, height: 24 }}
          selected
          mode="contained-tonal"
          icon="close"
          size={12}
          onPress={() => onDelete?.(id)}
          tabIndex={-1 as any}
        />
      </View>
    </Animated.View>
  );
}
