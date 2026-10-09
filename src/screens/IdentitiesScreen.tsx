import React, { useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import type { IdentityStackParamList } from "../app/navigation/model/types";
import { useTheme } from "../app/providers/ThemeProvider";
import { useVault } from "../app/providers/VaultProvider";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import FocusAwareStatusBar from "../shared/components/FocusAwareStatusBar";
import AnimatedPressable from "../shared/components/AnimatedPressable";
import SearchHeader from "../shared/components/SearchHeader";
import { deriveIdentityClusters } from "../features/identity/utils/deriveIdentityClusters";
import type { IdentityCluster } from "../features/identity/utils/deriveIdentityClusters";
import IdentityEmailLogo from "../features/identity/components/IdentityEmailLogo";
import { getDefaultIdentityName } from "../features/identity/utils/identityDisplayName";
import {
  getItemSurfaceStyle,
  getScreenContentStyle,
} from "../shared/ui/glass";

type IdentitiesScreenProps = NativeStackScreenProps<
  IdentityStackParamList,
  "Identities"
>;

function includesQuery(identity: IdentityCluster, query: string) {
  if (!query) return true;

  const haystack = [
    identity.email,
    ...identity.usernames,
    ...identity.domains,
    ...identity.entries.map((entry) => entry.title),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

const IdentitiesScreen: React.FC<IdentitiesScreenProps> = ({ navigation }) => {
  const vault = useVault();
  const { t } = useTranslation();
  const {
    globalStyles,
    theme,
    headerWhite,
    setHeaderWhite,
    darkmode,
    setHeaderSpacing,
    setTitlebarCenterGap,
    setTitlebarOverlayDragEnabled,
  } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState("");
  const screenContentStyle = getScreenContentStyle(theme);
  const surfaceStyle = getItemSurfaceStyle(theme);
  const subtleSurfaceStyle = {
    backgroundColor: darkmode ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.48)",
    borderColor: darkmode ? "rgba(255, 255, 255, 0.07)" : "rgba(255, 255, 255, 0.72)",
  };

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
      setHeaderWhite(false);
      setTitlebarCenterGap(0);
      setTitlebarOverlayDragEnabled(false);

      return () => {
        setTitlebarCenterGap(0);
      };
    }, [
      setHeaderSpacing,
      setHeaderWhite,
      setTitlebarCenterGap,
      setTitlebarOverlayDragEnabled,
    ]),
  );

  const values = useMemo(() => {
    if (!vault.isUnlocked) return [];
    try {
      return vault.exportFullData().values ?? [];
    } catch {
      return [];
    }
  }, [vault, vault.dirty, vault.isUnlocked]);

  const identities = useMemo(() => deriveIdentityClusters(values), [values]);
  const query = searchQuery.trim().toLowerCase();
  const visibleIdentities = useMemo(
    () => identities.filter((identity) => includesQuery(identity, query)),
    [identities, query],
  );

  const renderIdentityCard = (identity: IdentityCluster, index: number) => (
    <Animated.View
      key={identity.id}
      entering={FadeInDown.delay(Math.min(index, 8) * 35).duration(220)}
      style={[
        styles.identityCard,
        surfaceStyle,
      ]}
    >
      <AnimatedPressable
        onPress={() =>
          navigation.navigate("IdentityDetail", { identityId: identity.id })
        }
        style={styles.identityPressable}
        hoverBackgroundColor={
          darkmode ? "rgba(120, 127, 246, 0.12)" : "rgba(120, 127, 246, 0.08)"
        }
      >
        <View style={styles.identityCardInner}>
          <View style={styles.identityHeaderRow}>
            <View style={styles.logoShell}>
              <IdentityEmailLogo email={identity.email} size={44} />
            </View>
            <View style={styles.identityTextBlock}>
              <Text
                variant="bodyLarge"
                style={{ fontWeight: "900", userSelect: "none" }}
                numberOfLines={1}
              >
                {getDefaultIdentityName(identity.email)}
              </Text>
              <Text
                style={{ opacity: 0.7, userSelect: "none" }}
                numberOfLines={1}
              >
                {identity.email}
              </Text>
              <View style={styles.identityMetaRow}>
                <View style={[styles.identityMetaBadge, subtleSurfaceStyle]}>
                  <Icon source="key-chain" size={13} color={theme.colors.primary} />
                  <Text style={styles.identityMetaText}>
                    {identity.entries.length}
                  </Text>
                </View>
                <View style={[styles.identityMetaBadge, subtleSurfaceStyle]}>
                  <Icon source="web" size={13} color={theme.colors.primary} />
                  <Text style={styles.identityMetaText}>
                    {identity.domains.length}
                  </Text>
                </View>
                {identity.riskCount > 0 ? (
                  <View
                    style={[
                      styles.identityMetaBadge,
                      styles.identityRiskBadge,
                      { borderColor: `${theme.colors.error}30` },
                    ]}
                  >
                    <Icon
                      source="alert-circle-outline"
                      size={13}
                      color={theme.colors.error}
                    />
                    <Text
                      style={[
                        styles.identityMetaText,
                        { color: theme.colors.error },
                      ]}
                    >
                      {identity.riskCount}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
            <View style={[styles.chevronBubble, { backgroundColor: `${theme.colors.primary}12` }]}>
              <Icon source="chevron-right" size={20} color={theme.colors.primary} />
            </View>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );

  return (
    <AnimatedContainer style={globalStyles.container}>
      <FocusAwareStatusBar
        animated
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent
      />

      <SearchHeader
        idPrefix="identities"
        title={t("bar:Identities")}
        placeholder={t("identities:searchHint")}
        value={searchQuery}
        onChangeText={setSearchQuery}
        resetLabel={t("common:reset")}
      />

      <ScrollView
        style={{
          width: "100%",
          ...screenContentStyle,
        }}
        contentContainerStyle={{
          padding: 8,
          paddingTop: 0,
          gap: 8,
          alignSelf: "center",
          width: "100%",
          maxWidth: 920,
          paddingBottom: 8,
        }}
      >
        <View style={styles.metricRow}>
          <View style={[styles.metric, subtleSurfaceStyle]}>
            <Icon source="email-multiple-outline" size={16} color={theme.colors.primary} />
            <View style={styles.identityStatTextBlock}>
              <Text style={styles.identityStatValue}>
                {identities.length}
              </Text>
              <Text style={styles.metricLabel}>{t("identities:metricIdentities")}</Text>
            </View>
          </View>
        </View>

        {visibleIdentities.length === 0 ? (
          <View style={[styles.emptyState, surfaceStyle]}>
            <View style={[styles.emptyIcon, { backgroundColor: `${theme.colors.primary}14` }]}>
              <Icon source="account-search-outline" size={28} color={theme.colors.primary} />
            </View>
            <Text style={styles.emptyText}>
              {t("identities:noMatches")}
            </Text>
          </View>
        ) : (
          <View style={{ gap: 8 }}>{visibleIdentities.map(renderIdentityCard)}</View>
        )}
      </ScrollView>
    </AnimatedContainer>
  );
};

const styles = StyleSheet.create({
  identityCard: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  identityPressable: {
    borderRadius: 14,
    overflow: "hidden",
  },
  identityCardInner: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  identityHeaderRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoShell: {
    width: 54,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.32)",
  },
  identityTextBlock: {
    flex: 1,
    minWidth: 0,
    gap: 5,
  },
  identityMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
  },
  identityMetaBadge: {
    minHeight: 22,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 7,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  identityRiskBadge: {
    backgroundColor: "rgba(236, 72, 103, 0.10)",
  },
  identityMetaText: {
    opacity: 0.74,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800",
    userSelect: "none",
  },
  identityStatTextBlock: {
    minWidth: 0,
  },
  identityStatValue: {
    fontWeight: "900",
    lineHeight: 16,
    userSelect: "none",
  },
  identityStatLabel: {
    opacity: 0.68,
    fontSize: 12,
    lineHeight: 16,
    userSelect: "none",
  },
  metricRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metric: {
    minHeight: 42,
    minWidth: 120,
    flexGrow: 1,
    flexBasis: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  metricLabel: {
    opacity: 0.68,
    fontSize: 12,
    userSelect: "none",
  },
  chevronBubble: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    minHeight: 150,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 8,
  },
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    opacity: 0.72,
    textAlign: "center",
    userSelect: "none",
  },
});

export default IdentitiesScreen;
