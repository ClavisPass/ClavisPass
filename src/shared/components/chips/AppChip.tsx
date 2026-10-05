import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip, TouchableRipple } from "react-native-paper";

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
    height: 30,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  iconOnlyTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  iconOnlyContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconOnlyIcon: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    elevation: 1,
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
  selected,
  disabled,
  onPress,
  showSelectedOverlay,
  style,
  textStyle,
  ...props
}: Props) {
  const { darkmode, theme } = useTheme();
  const chipBackgroundColor = darkmode
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(255, 255, 255, 0.82)";
  const chipBorderColor = darkmode
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(255, 255, 255, 0.82)";
  const chipLabelColor = darkmode
    ? "rgba(255, 255, 255, 0.82)"
    : "rgba(24, 28, 38, 0.76)";

  if (iconOnly && icon) {
    const selectedBackgroundColor = showSelectedOverlay
      ? "rgba(120, 127, 246, 0.18)"
      : chipBackgroundColor;
    const iconColor = iconOnlyColor ?? chipLabelColor;
    const iconKey = `${typeof icon === "string" ? icon : "custom"}-${
      selected ? "selected" : "idle"
    }`;
    const resolvedIcon =
      typeof icon === "string" ? (
        <AppIcon
          key={iconKey}
          name={icon}
          size={iconOnlySize}
          color={iconColor}
        />
      ) : typeof icon === "function" ? (
        <React.Fragment key={iconKey}>
          {icon({ color: iconColor, size: iconOnlySize })}
        </React.Fragment>
      ) : null;

    return (
      <View
        style={[
          styles.iconOnlyChip,
          {
            backgroundColor: selected
              ? selectedBackgroundColor
              : chipBackgroundColor,
            borderColor: chipBorderColor,
            borderWidth: StyleSheet.hairlineWidth,
            opacity: disabled ? 0.38 : 1,
          },
          style as any,
        ]}
      >
        <TouchableRipple
          borderless
          disabled={disabled}
          onPress={onPress}
          style={styles.iconOnlyTouchable}
          accessibilityRole="button"
          accessibilityState={{ selected, disabled }}
          accessibilityLabel={props.accessibilityLabel}
        >
          <View style={styles.iconOnlyContent} />
        </TouchableRipple>
        <View pointerEvents="none" style={styles.iconOnlyIcon}>
          {resolvedIcon}
        </View>
      </View>
    );
  }

  return (
    <Chip
      {...props}
      icon={normalizeIcon(icon)}
      closeIcon={normalizeIcon(closeIcon)}
      selected={selected}
      disabled={disabled}
      onPress={onPress}
      showSelectedOverlay={showSelectedOverlay}
      style={[
        {
          backgroundColor: chipBackgroundColor,
          borderColor: chipBorderColor,
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: 12,
        },
        style as any,
      ]}
      textStyle={[{ color: chipLabelColor }, textStyle as any]}
    >
      {children ?? ""}
    </Chip>
  );
}

export default AppChip;
