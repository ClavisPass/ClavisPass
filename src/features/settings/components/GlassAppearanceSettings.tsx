import React, { useEffect } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { Slider } from "@react-native-assets/slider";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { useSetting } from "../../../app/providers/SettingsProvider";
import { getItemSurfaceStyle } from "../../../shared/ui/glass";
import {
  DEFAULT_GLASS_APPEARANCE,
  type GlassAppearance,
} from "../../../shared/ui/glassAppearance";

export default function GlassAppearanceSettings() {
  const { t } = useTranslation();
  const { theme, glassAppearance, setGlassAppearancePreview } = useTheme();
  const { setValue: setTransparency } = useSetting("GLASS_TRANSPARENCY");
  const { setValue: setTintStrength } = useSetting("GLASS_TINT_STRENGTH");

  useEffect(
    () => () => setGlassAppearancePreview({}),
    [setGlassAppearancePreview],
  );

  const commit = async (field: keyof GlassAppearance, value: number) => {
    await (field === "transparency"
      ? setTransparency(value)
      : setTintStrength(value));
    setGlassAppearancePreview((current) =>
      current[field] === value ? { ...current, [field]: undefined } : current,
    );
  };

  const reset = async () => {
    setGlassAppearancePreview(DEFAULT_GLASS_APPEARANCE);
    await Promise.all([
      setTransparency(DEFAULT_GLASS_APPEARANCE.transparency),
      setTintStrength(DEFAULT_GLASS_APPEARANCE.tintStrength),
    ]);
    setGlassAppearancePreview({});
  };

  const controls = [
    {
      field: "transparency" as const,
      label: t("settings:glassTransparency"),
      description: t("settings:glassTransparencySubtitle"),
      maximum: 100,
    },
    {
      field: "tintStrength" as const,
      label: t("settings:glassTintStrength"),
      description: t("settings:glassTintStrengthSubtitle"),
      maximum: 300,
    },
  ];

  return (
    <View
      style={[
        getItemSurfaceStyle(theme),
        { borderRadius: 12, padding: 14, gap: 8, marginVertical: 4 },
      ]}
    >
      <Text variant="titleSmall">{t("settings:glassAppearance")}</Text>
      <Text
        variant="bodySmall"
        style={{ color: theme.colors.onSurfaceVariant }}
      >
        {t("settings:glassAppearanceSubtitle")}
      </Text>
      {controls.map(({ field, label, description, maximum }) => (
        <View key={field} style={{ gap: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text variant="bodyLarge" style={{ flexShrink: 1 }}>
              {label}
            </Text>
            <Text variant="bodyMedium">
              {Math.round(glassAppearance[field])}%
            </Text>
          </View>
          <Slider
            value={glassAppearance[field]}
            minimumValue={0}
            maximumValue={maximum}
            step={1}
            style={{ width: "100%", height: 40 }}
            accessibilityLabel={label}
            accessibilityRole="adjustable"
            accessibilityValue={{
              min: 0,
              max: maximum,
              now: glassAppearance[field],
              text: `${Math.round(glassAppearance[field])}%`,
            }}
            accessibilityActions={[
              { name: "increment" },
              { name: "decrement" },
            ]}
            onAccessibilityAction={(event) => {
              const direction = event.nativeEvent.actionName;
              if (direction !== "increment" && direction !== "decrement")
                return;
              const next = Math.min(
                maximum,
                Math.max(
                  0,
                  glassAppearance[field] + (direction === "increment" ? 5 : -5),
                ),
              );
              setGlassAppearancePreview((current) => ({
                ...current,
                [field]: next,
              }));
              void commit(field, next);
            }}
            onValueChange={(value) =>
              setGlassAppearancePreview((current) => ({
                ...current,
                [field]: value,
              }))
            }
            onSlidingComplete={(value) => {
              void commit(field, value);
            }}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.outlineVariant}
            thumbTintColor={theme.colors.primary}
          />
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {description}
          </Text>
        </View>
      ))}
      <Button
        mode="text"
        icon="restore"
        onPress={() => {
          void reset();
        }}
        style={{ alignSelf: "flex-start" }}
      >
        {t("common:reset")}
      </Button>
    </View>
  );
}
