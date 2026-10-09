import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { useEffect, useMemo, useState } from "react";
import { RadioButton, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import lightTheme from "../../../shared/ui/theme";
import darkTheme from "../../../shared/ui/theme-darkmode";
import { getItemSurfaceStyle } from "../../../shared/ui/glass";

type CheckedType = "light" | "dark";
type Size = "large" | "small";

type PreviewProps = {
  value: CheckedType;
  checked: CheckedType;
  label: string;
  onSelect: (checked: CheckedType) => void;
  previewTheme: any;
  size: Size;
};

function ThemePreviewCard({
  value,
  checked,
  label,
  onSelect,
  previewTheme,
  size,
}: PreviewProps) {
  const { theme: appTheme, darkmode } = useTheme();
  const selected = checked === value;
  const compact = size === "small";

  const dimensions = useMemo(
    () =>
      compact
        ? {
            cardHeight: 84,
            mockWidth: 82,
            mockHeight: 48,
            dot: 5,
            radius: 10,
          }
        : {
            cardHeight: 136,
            mockWidth: 154,
            mockHeight: 72,
            dot: 7,
            radius: 12,
          },
    [compact],
  );

  const mockIsDark = value === "dark";
  const surface = mockIsDark ? "#171717" : "rgba(255, 255, 255, 0.82)";
  const line = mockIsDark
    ? "rgba(255, 255, 255, 0.12)"
    : "rgba(120, 127, 246, 0.10)";
  const cardBackground = darkmode
    ? "rgba(36, 36, 36, 0.52)"
    : "rgba(255, 255, 255, 0.58)";

  return (
    <Pressable
      onPress={() => onSelect(value)}
      style={{
        flex: compact ? undefined : 1,
        minWidth: compact ? dimensions.mockWidth + 18 : 0,
        height: dimensions.cardHeight,
        borderRadius: 12,
        borderWidth: selected ? 2 : StyleSheet.hairlineWidth,
        borderColor: selected
          ? appTheme.colors.primary
          : darkmode
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(255, 255, 255, 0.72)",
        backgroundColor: cardBackground,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: compact ? 4 : 8,
        paddingTop: compact ? 7 : 12,
        paddingBottom: compact ? 6 : 10,
        paddingHorizontal: compact ? 8 : 14,
        boxShadow: selected
          ? `${appTheme.colors.primary}24 0px 8px 22px 0px`
          : darkmode
            ? "rgba(0, 0, 0, 0.10) 0px 2px 10px 0px"
            : "rgba(99, 99, 99, 0.06) 0px 2px 10px 0px",
      }}
    >
      <View
        style={{
          width: dimensions.mockWidth,
          height: dimensions.mockHeight,
          borderRadius: dimensions.radius,
          backgroundColor: surface,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: mockIsDark
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(120, 127, 246, 0.14)",
          padding: compact ? 8 : 12,
          boxShadow: darkmode
            ? "rgba(0, 0, 0, 0.24) 0px 8px 20px 0px"
            : "rgba(31, 41, 55, 0.12) 0px 8px 20px 0px",
        }}
      >
        <View style={{ flexDirection: "row", gap: 4, marginBottom: compact ? 7 : 10 }}>
          {[0, 1, 2].map((dot) => (
            <View
              key={dot}
              style={{
                width: dimensions.dot,
                height: dimensions.dot,
                borderRadius: 999,
                backgroundColor:
                  dot === 0
                    ? previewTheme.colors.primary
                    : `${previewTheme.colors.primary}80`,
              }}
            />
          ))}
        </View>
        <View
          style={{
            width: "82%",
            height: compact ? 9 : 12,
            borderRadius: 999,
            backgroundColor: line,
            marginBottom: compact ? 6 : 8,
          }}
        />
        <View
          style={{
            width: "64%",
            height: compact ? 9 : 12,
            borderRadius: 999,
            backgroundColor: line,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          minHeight: compact ? 26 : 34,
        }}
      >
        <RadioButton
          value={value}
          status={selected ? "checked" : "unchecked"}
          onPress={() => onSelect(value)}
          color={appTheme.colors.primary}
          uncheckedColor={appTheme.colors.onSurfaceVariant}
        />
        <Text
          variant={compact ? "bodySmall" : "bodyLarge"}
          style={{ userSelect: "none", color: appTheme.colors.onSurface }}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

type Props = { size?: Size };

export default function DarkModeSwitch({ size = "large" }: Props) {
  const { darkmode, setDarkmode, theme } = useTheme();
  const { t } = useTranslation();
  const [checked, setChecked] = useState<CheckedType>(
    darkmode ? "dark" : "light",
  );
  const itemSurfaceStyle = getItemSurfaceStyle(theme);

  useEffect(() => {
    setChecked(darkmode ? "dark" : "light");
  }, [darkmode]);

  const onSelect = (value: CheckedType) => {
    setChecked(value);
    setDarkmode(value === "dark");
  };

  const picker = (
    <View
      style={{
        flexDirection: "row",
        gap: size === "small" ? 8 : 12,
        marginTop: size === "small" ? 6 : 0,
        justifyContent: "center",
        width: "100%",
      }}
    >
      <ThemePreviewCard
        value="light"
        checked={checked}
        label={t("settings:themeLight")}
        onSelect={onSelect}
        previewTheme={lightTheme}
        size={size}
      />
      <ThemePreviewCard
        value="dark"
        checked={checked}
        label={t("settings:themeDark")}
        onSelect={onSelect}
        previewTheme={darkTheme}
        size={size}
      />
    </View>
  );

  if (size === "small") return picker;

  return (
    <View
      style={{
        ...itemSurfaceStyle,
        marginVertical: 4,
        borderRadius: 14,
        overflow: "visible",
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 14,
        padding: 14,
      }}
    >
      {picker}
    </View>
  );
}
