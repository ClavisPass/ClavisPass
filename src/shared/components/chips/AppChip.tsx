import React from "react";
import { Platform, StyleSheet, View } from "react-native";
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

export function getAppChipSurfaceStyle({
  darkmode,
  selected = false,
}: {
  darkmode: boolean;
  selected?: boolean;
}) {
  const chipBackgroundColor = darkmode
    ? "rgba(255, 255, 255, 0.075)"
    : "rgba(120, 127, 246, 0.09)";
  const selectedChipBackgroundColor = darkmode
    ? "rgba(120, 127, 246, 0.18)"
    : "rgba(120, 127, 246, 0.16)";
  const chipBorderColor = darkmode
    ? "rgba(120, 127, 246, 0.32)"
    : "rgba(120, 127, 246, 0.28)";
  const glassChipStyle =
    Platform.OS === "web"
      ? ({
          backdropFilter: "blur(14px) saturate(1.08)",
          WebkitBackdropFilter: "blur(14px) saturate(1.08)",
        } as any)
      : null;

  return {
    borderColor: chipBorderColor,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: selected
      ? selectedChipBackgroundColor
      : chipBackgroundColor,
    borderRadius: 12,
    ...glassChipStyle,
  };
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
  const chipLabelColor = theme.colors.onSurfaceVariant;

  if (iconOnly && icon) {
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
            opacity: disabled ? 0.38 : 1,
          },
          getAppChipSurfaceStyle({
            darkmode,
            selected: selected && showSelectedOverlay,
          }),
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
        getAppChipSurfaceStyle({ darkmode, selected }),
        style as any,
      ]}
      textStyle={[{ color: chipLabelColor }, textStyle] as any}
    >
      {children ?? ""}
    </Chip>
  );
}

export default AppChip;
