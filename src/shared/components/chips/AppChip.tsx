import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip } from "react-native-paper";

import { useTheme } from "../../../app/providers/ThemeProvider";
import AppIcon from "../icons/AppIcon";

type Props = Omit<React.ComponentProps<typeof Chip>, "children"> & {
  children?: React.ReactNode;
  iconOnly?: boolean;
  iconOnlyColor?: string;
  iconOnlySize?: number;
};
type IconSource = Props["icon"];

const styles = StyleSheet.create({
  iconOnlyChip: {
    width: 46,
    minWidth: 46,
  },
  iconOnlyIconWrap: {
    marginLeft: 6,
  },
  iconOnlyText: {
    width: 0,
    margin: 0,
    padding: 0,
  },
});

function normalizeIcon(icon: IconSource): IconSource {
  if (typeof icon !== "string") return icon;

  return ({ color, size }: { color: string; size: number }) => (
    <AppIcon name={icon} size={size} color={color} />
  );
}

function AppChip({
  children,
  icon,
  closeIcon,
  iconOnly,
  iconOnlyColor,
  iconOnlySize = 18,
  ...props
}: Props) {
  const { theme } = useTheme();

  if (iconOnly && typeof icon === "string") {
    return (
      <Chip
        {...props}
        icon={() => (
          <View style={styles.iconOnlyIconWrap}>
            <AppIcon
              name={icon}
              size={iconOnlySize}
              color={iconOnlyColor ?? theme.colors.primary}
            />
          </View>
        )}
        closeIcon={normalizeIcon(closeIcon)}
        style={[styles.iconOnlyChip, props.style]}
        textStyle={[styles.iconOnlyText, props.textStyle]}
      >
        {""}
      </Chip>
    );
  }

  return (
    <Chip
      {...props}
      icon={normalizeIcon(icon)}
      closeIcon={normalizeIcon(closeIcon)}
    >
      {children ?? ""}
    </Chip>
  );
}

export default AppChip;
