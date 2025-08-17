import React, { ReactNode, useEffect } from "react";
import {
  View,
  Pressable,
  Platform,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Icon, IconButton } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../contexts/ThemeProvider";

export type EditRowControlsContainerProps = {
  id: string;
  edit: boolean;
  children: ReactNode;
  onDragStart?: () => void;
  onDelete?: (id: string) => void;
  showDrag?: boolean;
  showDelete?: boolean;
  leftInset?: number;
  rightInset?: number;
  durationMs?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function EditRowControlsContainer({
  id,
  edit,
  children,
  onDragStart,
  onDelete,
  showDrag = true,
  showDelete = true,
  leftInset = 24,
  rightInset = 50,
  durationMs = 150,
  style,
  contentStyle,
}: EditRowControlsContainerProps) {
  const { theme } = useTheme();

  const translateXDrag = useSharedValue(-20);
  const translateXDelete = useSharedValue(showDelete ? rightInset - 4 : 0);
  const paddingLeft = useSharedValue(4);
  const paddingRight = useSharedValue(4);

  useEffect(() => {
    if (edit) {
      translateXDrag.value = withTiming(0, { duration: durationMs });
      translateXDelete.value = withTiming(0, { duration: durationMs });
      paddingLeft.value = withTiming(showDrag ? leftInset : 4, {
        duration: durationMs,
      });
      paddingRight.value = withTiming(showDelete ? rightInset : 4, {
        duration: durationMs,
      });
    } else {
      translateXDrag.value = withTiming(-20, { duration: durationMs });
      translateXDelete.value = withTiming(showDelete ? rightInset - 4 : 0, {
        duration: durationMs,
      });
      paddingLeft.value = withTiming(4, { duration: durationMs });
      paddingRight.value = withTiming(4, { duration: durationMs });
    }
  }, [edit, showDrag, showDelete, leftInset, rightInset, durationMs]);

  const animatedContainer = useAnimatedStyle(() => ({
    overflow: "hidden",
    paddingLeft: paddingLeft.value,
    paddingRight: paddingRight.value,
  }));

  const animatedDrag = useAnimatedStyle(() => ({
    position: "absolute",
    left: 4,
    transform: [{ translateX: translateXDrag.value }],
  }));

  const animatedDelete = useAnimatedStyle(() => ({
    position: "absolute",
    right: 4,
    transform: [{ translateX: translateXDelete.value }],
  }));

  return (
    <Animated.View
      style={[
        { flexDirection: "row", alignItems: "center", flex: 1 },
        style,
        animatedContainer,
      ]}
    >
      {showDrag && (
        <Animated.View style={animatedDrag}>
          {Platform.OS === "web" ? (
            <Icon source="drag" color={theme.colors?.primary} size={20} />
          ) : (
            <Pressable onPressIn={edit ? onDragStart : undefined}>
              <Icon source="drag" color={theme.colors?.primary} size={20} />
            </Pressable>
          )}
        </Animated.View>
      )}
      <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
      {showDelete && (
        <Animated.View
          style={[
            { justifyContent: "center", alignItems: "center" },
            animatedDelete,
          ]}
        >
          <IconButton
            animated
            selected={edit}
            mode="contained-tonal"
            icon="close"
            iconColor={theme.colors?.error}
            size={20}
            onPress={() => onDelete?.(id)}
            tabIndex={-1 as any}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
}