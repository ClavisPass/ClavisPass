import React, { useState } from "react";
import { Image } from "expo-image";
import { Platform, ScrollView, View, useWindowDimensions } from "react-native";
import { Icon, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../app/providers/ThemeProvider";
import AnimatedPressable from "../../../shared/components/AnimatedPressable";
import type { WebsitePreset } from "../utils/websitePresets";
import { getItemSurfaceStyle } from "../../../shared/ui/glass";
import { buildFaviconUrl } from "../utils/digitalCardTheme";

type Props = {
  presets: WebsitePreset[];
  onSelect: (preset: WebsitePreset) => void;
  onDismiss: () => void;
};

export default function WebsitePresetSuggestions({
  presets,
  onSelect,
  onDismiss,
}: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { fontScale } = useWindowDimensions();
  const [failedFavicons, setFailedFavicons] = useState<Record<string, boolean>>(
    {},
  );
  const cardHeight = Math.ceil(36 * Math.max(1, fontScale) + 16);
  if (!presets.length) return null;

  return (
    <View
      style={{
        width: "100%",
        flexShrink: 0,
        paddingHorizontal: 8,
        paddingVertical: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      <ScrollView
        horizontal
        style={{ height: cardHeight + 4, flex: 1 }}
        keyboardShouldPersistTaps="always"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 8,
          paddingBottom: 2,
        }}
      >
        {presets.map((preset) => (
          <AnimatedPressable
            key={preset.id}
            accessibilityRole="button"
            accessibilityLabel={t("common:applyWebsitePreset", {
              name: preset.name,
            })}
            onPress={() => onSelect(preset)}
            style={[
              getItemSurfaceStyle(theme),
              {
                height: cardHeight,
                minWidth: 120,
                maxWidth: 240,
                flexGrow: 0,
                flexShrink: 0,
                alignSelf: "flex-start",
                justifyContent: "center",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              },
              Platform.OS === "web"
                ? ({ WebkitAppRegion: "no-drag" } as any)
                : null,
            ]}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              {failedFavicons[preset.id] ? (
                <Icon
                  source="web"
                  size={28}
                  color={theme.colors.onSurfaceVariant}
                />
              ) : (
                <Image
                  source={buildFaviconUrl(preset.url)}
                  style={{ width: 28, height: 28, borderRadius: 6 }}
                  contentFit="contain"
                  transition={250}
                  accessibilityIgnoresInvertColors
                  onError={() =>
                    setFailedFavicons((current) => ({
                      ...current,
                      [preset.id]: true,
                    }))
                  }
                />
              )}
              <View style={{ flexShrink: 1 }}>
                <Text variant="labelLarge" numberOfLines={1}>
                  {preset.name}
                </Text>
                <Text
                  variant="bodySmall"
                  numberOfLines={1}
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  {new URL(preset.url).hostname.replace(/^www\./, "")}
                </Text>
              </View>
            </View>
          </AnimatedPressable>
        ))}
      </ScrollView>
      <AnimatedPressable
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel={t("common:dismissWebsitePresets")}
        style={{
          width: 36,
          height: 44,
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
        }}
      >
        <Icon source="close" size={16} color={theme.colors.onSurfaceVariant} />
      </AnimatedPressable>
    </View>
  );
}
