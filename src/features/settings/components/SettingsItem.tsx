import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../../app/providers/ThemeProvider";
import AnimatedPressable from "../../../shared/components/AnimatedPressable";
import AppIcon from "../../../shared/components/icons/AppIcon";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  leadingIcon?: string;
  leading?: ReactNode;
  selected?: boolean;
  label?: string;
  subtitle?: string;
  afterLabel?: ReactNode;
  minWidth?: number;
  rightIcon?: string | null;
  rightText?: string;
  trailing?: ReactNode;
  surface?: boolean;
};

function SettingsItem(props: Props) {
  const { theme, darkmode } = useTheme();
  const compactSubtitle =
    props.subtitle && props.subtitle.length > 42
      ? `${props.subtitle.slice(0, 39).trim()}...`
      : props.subtitle;
  const hasSubtitle = !!compactSubtitle;
  const surface = props.surface ?? true;
  const selectedBackgroundColor = "rgba(120, 127, 246, 0.18)";

  const content = (
    <View
      style={{
        minHeight: hasSubtitle ? 64 : 52,
        minWidth: props.minWidth ?? 0,
        paddingHorizontal: 14,
        paddingVertical: hasSubtitle ? 10 : 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: props.selected ? selectedBackgroundColor : undefined,
        borderLeftWidth: props.selected ? 3 : 0,
        borderLeftColor: theme.colors.primary,
      }}
    >
      {props.leading ??
        (props.leadingIcon ? (
          <AppIcon
            size={24}
            color={theme.colors.primary}
            name={props.leadingIcon}
          />
        ) : null)}
      <View style={{ flex: 1, minWidth: 0 }}>
        {props.label ? (
          <Text
            variant="labelSmall"
            style={{ userSelect: "none", color: theme.colors.primary }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {props.label}
          </Text>
        ) : null}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text
            variant="bodyLarge"
            style={{ userSelect: "none", flexShrink: 1 }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {props.children}
          </Text>
          {props.afterLabel}
        </View>
        {compactSubtitle ? (
          <Text
            variant="bodySmall"
            style={{
              color: theme.colors.onSurfaceVariant,
              marginTop: 2,
              userSelect: "none",
            }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {compactSubtitle}
          </Text>
        ) : null}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        {props.rightText ? (
          <Text
            variant="bodyLarge"
            style={{ userSelect: "none", color: theme.colors.primary }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {props.rightText}
          </Text>
        ) : null}
        {props.trailing}
        {props.rightIcon === null ? null : props.rightIcon ||
          (props.onPress ? "chevron-right" : undefined) ? (
          <AppIcon
            size={20}
            color={theme.colors.primary}
            name={
              props.rightIcon ||
              (props.onPress ? "chevron-right" : "chevron-right")
            }
          />
        ) : null}
      </View>
    </View>
  );

  return (
    <View
      style={[
        {
          marginVertical: 4,
          borderRadius: 12,
          overflow: "hidden",
        },
        surface
          ? {
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: darkmode
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(255, 255, 255, 0.72)",
              backgroundColor: darkmode
                ? "rgba(36, 36, 36, 0.52)"
                : "rgba(255, 255, 255, 0.58)",
              boxShadow: darkmode
                ? "rgba(0, 0, 0, 0.10) 0px 2px 10px 0px"
                : "rgba(99, 99, 99, 0.06) 0px 2px 10px 0px",
            }
          : null,
      ]}
    >
      {props.onPress ? (
        <AnimatedPressable onPress={props.onPress} style={{ cursor: "pointer" }}>
          {content}
        </AnimatedPressable>
      ) : (
        content
      )}
    </View>
  );
}

export default SettingsItem;
