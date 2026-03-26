import React, { useEffect, useState } from "react";
import { View, InteractionManager, StyleSheet } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "../shared/components/Header";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import { useTheme } from "../app/providers/ThemeProvider";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import QRCode from "react-qr-code";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import { HomeStackParamList } from "../app/navigation/model/types";
import { LinearGradient } from "expo-linear-gradient";
import {
  buildFaviconUrl,
  getHostnameLabel,
  getReadableTextColor,
  mixColors,
  resolveDigitalCardPaletteFromUrl,
  withAlpha,
} from "../features/vault/utils/digitalCardTheme";
import { Icon, Text } from "react-native-paper";
import { Image } from "expo-image";

type CardDetailsScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "CardDetails"
>;

const CardDetailsScreen: React.FC<CardDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const {
    value: value,
    title: title,
    type: type,
    sourceUrl,
    faviconUrl: routeFaviconUrl,
    accentColor: routeAccentColor,
  } = route.params!;
  const { theme } = useTheme();
  const {
    globalStyles,
    headerWhite,
    setHeaderWhite,
    darkmode,
    setHeaderSpacing,
  } = useTheme();
  const [accentColor, setAccentColor] = useState<string | null>(
    routeAccentColor ?? null
  );

  useEffect(() => {
    let cancelled = false;

    if (routeAccentColor || !sourceUrl) return;

    (async () => {
      const palette = await resolveDigitalCardPaletteFromUrl(sourceUrl);
      if (!cancelled) setAccentColor(palette.accentColor);
    })();

    return () => {
      cancelled = true;
    };
  }, [routeAccentColor, sourceUrl]);

  useFocusEffect(
    React.useCallback(() => {
      let task = InteractionManager.runAfterInteractions(() => {
        setHeaderSpacing(220);
        setHeaderWhite(false);
      });
      return () => task?.cancel?.();
    }, [])
  );

  const goBack = () => {
    navigation.goBack();
  };

  const cardBase = accentColor
    ? mixColors(accentColor, darkmode ? "#0D0D0D" : "#FFFFFF", darkmode ? 0.72 : 0.85)
    : theme.colors.elevation.level2;
  const titleColor = accentColor
    ? getReadableTextColor(accentColor)
    : theme.colors.onBackground;
  const secondaryTextColor = accentColor
    ? withAlpha(titleColor === "#ffffff" ? "#ffffff" : "#111111", 0.72)
    : theme.colors.onSurfaceVariant;
  const faviconUrl = routeFaviconUrl ?? buildFaviconUrl(sourceUrl ?? null);
  const hostname = getHostnameLabel(sourceUrl ?? null);

  return (
    <AnimatedContainer style={globalStyles.container}>
      <StatusBar
        animated={true}
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent={true}
      />
      <Header onPress={goBack} title={title}></Header>
      <LinearGradient
        colors={[
          theme.colors.elevation.level2,
          theme.colors.elevation.level2,
          theme.colors.elevation.level2,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          width: "100%",
          padding: 20,
          paddingTop: 0,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.elevation.level2,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 28,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: accentColor
              ? withAlpha(accentColor, darkmode ? 0.5 : 0.24)
              : theme.colors.outlineVariant,
            backgroundColor: cardBase,
            boxShadow: theme.colors.shadow as any,
          }}
        >
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 14,
              gap: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: accentColor
                    ? withAlpha(accentColor, darkmode ? 0.22 : 0.16)
                    : theme.colors.surfaceVariant,
                }}
              >
                {faviconUrl ? (
                  <Image
                    source={faviconUrl}
                    style={{ width: 24, height: 24, borderRadius: 7 }}
                    contentFit="cover"
                  />
                ) : (
                  <Icon
                    source="credit-card-outline"
                    size={20}
                    color={accentColor ?? theme.colors.primary}
                  />
                )}
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  variant="titleLarge"
                  style={{ color: titleColor, fontWeight: "700", userSelect: "none" }}
                  numberOfLines={1}
                >
                  {title}
                </Text>
                {hostname ? (
                  <Text
                    style={{ color: secondaryTextColor, userSelect: "none" }}
                    numberOfLines={1}
                  >
                    {hostname}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 20,
              paddingBottom: 24,
              paddingTop: 6,
              backgroundColor: accentColor
                ? withAlpha(accentColor, darkmode ? 0.12 : 0.08)
                : "transparent",
            }}
          >
            <View
              style={{
                padding: 18,
                backgroundColor: "white",
                borderRadius: 24,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: accentColor
                  ? withAlpha(accentColor, 0.2)
                  : "rgba(0, 0, 0, 0.06)",
              }}
            >
              {value !== "" ? (
                type === "QR-Code" ? (
                  <QRCode value={value} size={180} />
                ) : (
                  <Barcode height={120} format={type} value={value} text={value} />
                )
              ) : null}
            </View>
          </View>
        </View>
      </LinearGradient>
    </AnimatedContainer>
  );
};

export default CardDetailsScreen;
