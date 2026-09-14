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
  },
  iconOnlyTouchable: {
    flex: 1,
  },
  iconOnlyContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconOnlySelectedOverlay: {
    ...StyleSheet.absoluteFillObject,
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
  ...props
}: Props) {
  const { theme } = useTheme();

  if (iconOnly && typeof icon === "string") {
    const selectedBackgroundColor = showSelectedOverlay
      ? "rgba(120, 127, 246, 0.18)"
      : theme.colors.secondaryContainer;

    return (
      <View
        style={[
          styles.iconOnlyChip,
          {
            backgroundColor: selected
              ? selectedBackgroundColor
              : theme.colors.secondaryContainer,
            opacity: disabled ? 0.38 : 1,
          },
          props.style as any,
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
          <View style={styles.iconOnlyContent}>
            {selected && showSelectedOverlay ? (
              <View
                pointerEvents="none"
                style={[
                  styles.iconOnlySelectedOverlay,
                  { borderColor: theme.colors.primary, borderWidth: 1 },
                ]}
              />
            ) : null}
            <AppIcon
              name={icon}
              size={iconOnlySize}
              color={iconOnlyColor ?? theme.colors.primary}
            />
          </View>
        </TouchableRipple>
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
    >
      {children ?? ""}
    </Chip>
  );
}

export default AppChip;
