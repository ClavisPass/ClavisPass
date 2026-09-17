import React from "react";
import {
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { Divider, Text } from "react-native-paper";

import { useTheme } from "../../../app/providers/ThemeProvider";

type ModalSurfaceProps = {
  children?: React.ReactNode;
  width?: number;
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  padded?: boolean;
  separatedHeader?: boolean;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

type ModalActionsProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const HORIZONTAL_MARGIN = 32;
const VERTICAL_MARGIN = 96;

function ModalSurface({
  children,
  width = 320,
  height,
  minHeight,
  maxHeight,
  padded = true,
  separatedHeader = false,
  title,
  description,
  footer,
  style,
  contentStyle,
}: ModalSurfaceProps) {
  const { theme } = useTheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const availableWidth = Math.max(1, windowWidth - HORIZONTAL_MARGIN);
  const availableHeight = Math.max(1, windowHeight - VERTICAL_MARGIN);
  const resolvedWidth = Math.min(width, availableWidth);
  const resolvedMaxHeight = Math.min(maxHeight ?? 620, availableHeight);
  const resolvedHeight =
    height === undefined ? undefined : Math.min(height, resolvedMaxHeight);
  const resolvedMinHeight =
    minHeight === undefined
      ? undefined
      : Math.min(minHeight, resolvedMaxHeight);
  const hasHeader = Boolean(title || description);

  return (
    <View
      style={[
        styles.surface,
        {
          width: resolvedWidth,
          height: resolvedHeight,
          minHeight: resolvedMinHeight,
          maxHeight: resolvedMaxHeight,
          borderColor: theme.colors.outlineVariant,
          backgroundColor: theme.colors.background,
        },
        style,
      ]}
    >
      {hasHeader ? (
        <>
          <View style={styles.header}>
            {title ? (
              <Text variant="headlineSmall" style={styles.unselectable}>
                {title}
              </Text>
            ) : null}
            {description ? (
              <Text
                variant="bodyMedium"
                style={[styles.unselectable, styles.description]}
              >
                {description}
              </Text>
            ) : null}
          </View>
          {separatedHeader ? <Divider /> : null}
        </>
      ) : null}

      <View
        style={[
          styles.content,
          padded ? styles.paddedContent : null,
          contentStyle,
        ]}
      >
        {children}
      </View>

      {footer ? (
        <>
          {separatedHeader ? <Divider /> : null}
          {footer}
        </>
      ) : null}
    </View>
  );
}

function ModalActions({ children, style }: ModalActionsProps) {
  return <View style={[styles.actions, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  surface: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  header: {
    gap: 4,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
  },
  content: {
    minWidth: 0,
  },
  paddedContent: {
    padding: 14,
  },
  description: {
    opacity: 0.72,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    padding: 10,
  },
  unselectable: {
    userSelect: "none",
  },
});

export { ModalActions };
export default ModalSurface;
