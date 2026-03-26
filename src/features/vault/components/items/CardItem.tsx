import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import ValuesType from "../../model/ValuesType";
import { useTheme } from "../../../../app/providers/ThemeProvider";

import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import Animated, { FadeInDown } from "react-native-reanimated";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import QRCode from "react-qr-code";
import DigitalCardType from "../../model/DigitalCardType";

import { Divider, Icon, Text } from "react-native-paper";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  buildFaviconUrl,
  getHostnameLabel,
  getReadableTextColor,
  mixColors,
  resolveDigitalCardPalette,
  withAlpha,
} from "../../utils/digitalCardTheme";

const styles = StyleSheet.create({
  container: {
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  ripple: {
    padding: 8,
    paddingLeft: 8,
    paddingRight: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    overflow: "hidden",
  },
});

type Props = {
  title: string;
  value: string;
  type: DigitalCardType;
  item: ValuesType;
  onPressEdit: () => void;
  onPress: (payload: {
    accentColor: string | null;
    sourceUrl: string | null;
    faviconUrl: string | null;
  }) => void;
  sourceUrl?: string | null;
  key?: React.Key;
  index: number;
};

function CardItem(props: Props) {
  const { theme, darkmode } = useTheme();
  const [accentColor, setAccentColor] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const palette = await resolveDigitalCardPalette(props.item);
      if (!cancelled) {
        setAccentColor(palette.accentColor);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [props.item]);

  if(props.value === "") {
    return null;
  }

  const sourceUrl = props.sourceUrl ?? null;
  const faviconUrl = useMemo(() => buildFaviconUrl(sourceUrl), [sourceUrl]);
  const hostname = useMemo(() => getHostnameLabel(sourceUrl), [sourceUrl]);
  const cardBase = accentColor
    ? mixColors(accentColor, darkmode ? "#0D0D0D" : "#FFFFFF", darkmode ? 0.7 : 0.82)
    : theme.colors?.background;
  const cardAccentGlow = accentColor
    ? withAlpha(accentColor, darkmode ? 0.2 : 0.14)
    : "transparent";
  const titleColor = accentColor
    ? getReadableTextColor(accentColor)
    : theme.colors.onBackground;
  const secondaryTextColor = accentColor
    ? withAlpha(titleColor === "#ffffff" ? "#ffffff" : "#111111", 0.72)
    : theme.colors.onSurfaceVariant;

  return (
    <Animated.View
      entering={FadeInDown.delay(props.index * 50).duration(250)}
      key={props.key}
      style={[
        styles.container,
        {
          backgroundColor: cardBase,
          boxShadow: theme.colors?.shadow,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: accentColor
            ? withAlpha(accentColor, darkmode ? 0.5 : 0.24)
            : darkmode
              ? theme.colors.outlineVariant
              : "white",
        },
      ]}
    >
      <LinearGradient
        colors={[
          accentColor ? withAlpha(accentColor, darkmode ? 0.26 : 0.18) : cardBase,
          cardBase,
          accentColor ? withAlpha(accentColor, darkmode ? 0.18 : 0.08) : cardBase,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AnimatedPressable
            key={props.key}
            style={[
              styles.ripple,
              {
                paddingTop: 12,
                paddingBottom: 10,
                alignItems: "flex-start",
              },
            ]}
            onPress={props.onPressEdit}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: accentColor
                    ? withAlpha(accentColor, darkmode ? 0.22 : 0.16)
                    : theme.colors.surfaceVariant,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: accentColor
                    ? withAlpha(accentColor, darkmode ? 0.45 : 0.22)
                    : theme.colors.outlineVariant,
                }}
              >
                {faviconUrl ? (
                  <Image
                    source={faviconUrl}
                    style={{ width: 20, height: 20, borderRadius: 6 }}
                    contentFit="cover"
                  />
                ) : (
                  <Icon
                    source="credit-card-outline"
                    size={18}
                    color={accentColor ?? theme.colors.primary}
                  />
                )}
              </View>
              <View style={{ minWidth: 0, flexShrink: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{ color: titleColor, fontWeight: "700", userSelect: "none" }}
                >
                  {props.title}
                </Text>
                {hostname ? (
                  <Text
                    numberOfLines={1}
                    style={{ color: secondaryTextColor, userSelect: "none" }}
                  >
                    {hostname}
                  </Text>
                ) : null}
              </View>
            </View>
          </AnimatedPressable>
          <Divider />
          <View
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              height: 120,
              overflow: "hidden",
              backgroundColor: cardAccentGlow,
            }}
          >
            <AnimatedPressable
              key={props.key}
              style={[
                styles.ripple,
                { justifyContent: "center", alignItems: "center", paddingVertical: 16 },
              ]}
              onPress={() =>
                props.onPress({
                  accentColor,
                  sourceUrl,
                  faviconUrl,
                })
              }
            >
              <View
                style={{
                  padding: 10,
                  backgroundColor: "white",
                  borderRadius: 16,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: accentColor
                    ? withAlpha(accentColor, 0.24)
                    : "rgba(0, 0, 0, 0.06)",
                }}
              >
                {props.value !== "" ? (
                  props.type === "QR-Code" ? (
                    <QRCode value={props.value} size={90} />
                  ) : (
                    <Barcode
                      height={70}
                      format={props.type}
                      value={props.value}
                      text={props.value}
                    />
                  )
                ) : null}
              </View>
            </AnimatedPressable>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

export default CardItem;
