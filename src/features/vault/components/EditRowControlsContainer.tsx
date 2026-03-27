import React, { ReactNode } from "react";
import {
  View,
  Platform,
  ViewStyle,
  StyleProp,
  StyleSheet,
} from "react-native";
import { Divider, Icon, IconButton } from "react-native-paper";
import { useTheme } from "../../../app/providers/ThemeProvider";
import Animated, { FadeOutUp } from "react-native-reanimated";
import AnimatedPressable from "../../../shared/components/AnimatedPressable";

export type EditRowControlsContainerProps = {
  id: string;
  children: ReactNode;
  onDragStart?: () => void;
  onDelete?: (id: string) => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  topRightInset?: number;
};

const DRAG_RAIL_WIDTH = 29;
const DELETE_BUTTON_ZONE = 36;

export function EditRowControlsContainer({
  id,
  children,
  onDragStart,
  onDelete,
  style,
  contentStyle,
  topRightInset = 0,
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
          position: "relative",
        },
        style,
      ]}
    >
      <View
        style={{
          width: DRAG_RAIL_WIDTH,
          justifyContent: "center",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <AnimatedPressable
          style={{
            height: "100%",
            width: DRAG_RAIL_WIDTH,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPressIn={Platform.OS === "web" ? () => {} : onDragStart}
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

      <View style={[{ flex: 1, paddingRight: topRightInset }, contentStyle]}>
        {children}
      </View>

      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: 6,
          right: 1,
          width: DELETE_BUTTON_ZONE,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <IconButton
          style={{ margin: 0, width: 24, height: 24 }}
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
