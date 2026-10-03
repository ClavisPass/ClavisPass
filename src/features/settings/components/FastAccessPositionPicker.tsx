import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { RadioButton, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../../app/providers/ThemeProvider";
import type { StoreValueMap } from "../../../infrastructure/storage/store";

type FastAccessPosition = StoreValueMap["FAST_ACCESS_POSITION"];

type Corner = {
  value: FastAccessPosition;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

type Props = {
  value: FastAccessPosition;
  setValue: (value: FastAccessPosition) => void;
};

function CornerOption({
  corner,
  selected,
  onSelect,
}: {
  corner: Corner;
  selected: boolean;
  onSelect: (value: FastAccessPosition) => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={() => onSelect(corner.value)}
      style={{
        position: "absolute",
        top: corner.top,
        bottom: corner.bottom,
        left: corner.left,
        right: corner.right,
        alignItems: "center",
        gap: 2,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: selected
            ? theme.colors.elevation.level3
            : theme.colors.elevation.level2,
          borderWidth: 2,
          borderColor: selected ? theme.colors.primary : "transparent",
        }}
      >
        <RadioButton
          value={corner.value}
          status={selected ? "checked" : "unchecked"}
          onPress={() => onSelect(corner.value)}
        />
      </View>
    </Pressable>
  );
}

export default function FastAccessPositionPicker({ value, setValue }: Props) {
  const { t } = useTranslation();
  const { darkmode, theme } = useTheme();

  const corners = useMemo<Corner[]>(
    () => [
      {
        value: "top-left",
        top: 10,
        left: 10,
      },
      {
        value: "top-right",
        top: 10,
        right: 10,
      },
      {
        value: "bottom-left",
        bottom: 10,
        left: 10,
      },
      {
        value: "bottom-right",
        bottom: 10,
        right: 10,
      },
    ],
    [],
  );

  return (
    <View
      style={{
        marginVertical: 4,
        borderRadius: 12,
        overflow: "hidden",
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
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 12,
      }}
    >
      <Text variant="bodyMedium">{t("settings:fastAccessPosition")}</Text>
      <Text
        variant="bodySmall"
        style={{
          color: theme.colors.onSurfaceVariant,
          marginTop: 2,
          marginBottom: 8,
        }}
      >
        {t("settings:fastAccessPositionSubtitle")}
      </Text>

      <View style={{ alignItems: "flex-start", gap: 8 }}>
        <View
          style={{
            width: 180,
            height: 120,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.colors.outlineVariant,
            backgroundColor: theme.colors.elevation.level2,
            padding: 10,
            paddingBottom: 20,
          }}
        >
          {corners.map((corner) => (
            <CornerOption
              key={corner.value}
              corner={corner}
              selected={value === corner.value}
              onSelect={setValue}
            />
          ))}
        </View>

      </View>
    </View>
  );
}
