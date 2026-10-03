import React, { useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import type { IdentityStackParamList } from "../app/navigation/model/types";
import { useTheme } from "../app/providers/ThemeProvider";
import { useVault } from "../app/providers/VaultProvider";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import FocusAwareStatusBar from "../shared/components/FocusAwareStatusBar";
import AppChip from "../shared/components/chips/AppChip";
import AnimatedPressable from "../shared/components/AnimatedPressable";
import SearchHeader from "../shared/components/SearchHeader";
import { deriveIdentityClusters } from "../features/identity/utils/deriveIdentityClusters";
import type { IdentityCluster } from "../features/identity/utils/deriveIdentityClusters";
import IdentityEmailLogo from "../features/identity/components/IdentityEmailLogo";
import { getDefaultIdentityName } from "../features/identity/utils/identityDisplayName";

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
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = React.useState("");
  const inlineIdentityStats = width >= 760;
  const surfaceStyle = {
    backgroundColor: darkmode ? "rgba(28, 28, 34, 0.58)" : "rgba(255, 255, 255, 0.68)",
    borderColor: darkmode ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.82)",
    boxShadow: darkmode
      ? ("rgba(0, 0, 0, 0.14) 0px 8px 24px 0px" as any)
      : ("rgba(64, 76, 120, 0.08) 0px 8px 26px 0px" as any),
  };
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

  const totalAccounts = identities.reduce(
    (sum, identity) => sum + identity.entries.length,
    0,
  );
  const totalWebsites = identities.reduce(
    (sum, identity) => sum + identity.domains.length,
    0,
  );
  const totalRisks = identities.reduce((sum, identity) => sum + identity.riskCount, 0);

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
          <View style={styles.logoShell}>
            <IdentityEmailLogo email={identity.email} size={44} />
          </View>
          <View style={styles.identityBody}>
            <View
              style={[
                styles.identityContent,
                !inlineIdentityStats && styles.identityContentStacked,
              ]}
            >
              <View
                style={[
                  styles.identityTextBlock,
                  !inlineIdentityStats && styles.identityTextBlockStacked,
                ]}
              >
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
              </View>
              <View
                style={[
                  styles.identityStats,
                  !inlineIdentityStats && styles.identityStatsStacked,
                ]}
              >
                {identity.riskCount > 0 ? (
                  <AppChip
                    compact
                    icon={({ size }) => (
                      <Icon
                        source="alert-circle-outline"
                        size={size}
                        color={theme.colors.error}
                      />
                    )}
                    style={styles.riskChip}
                    textStyle={{ color: theme.colors.onSurface, fontWeight: "700" }}
                  >
                    {t("identities:risksCount", { count: identity.riskCount })}
                  </AppChip>
                ) : null}
                <AppChip compact icon="key-chain" style={styles.statChip}>
                  {t("identities:accountsCount", { count: identity.entries.length })}
                </AppChip>
                <AppChip compact icon="web" style={styles.statChip}>
                  {t("identities:websitesCount", { count: identity.domains.length })}
                </AppChip>
              </View>
            </View>
          </View>
          <View style={[styles.chevronBubble, { backgroundColor: `${theme.colors.primary}12` }]}>
            <Icon source="chevron-right" size={20} color={theme.colors.primary} />
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
        style={{ width: "100%" }}
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
            <View style={[styles.metricIcon, { backgroundColor: `${theme.colors.primary}18` }]}>
              <Icon source="email-multiple-outline" size={20} color={theme.colors.primary} />
            </View>
            <View style={{ minWidth: 0 }}>
              <Text style={{ fontWeight: "900", color: theme.colors.onSurface }}>
                {identities.length}
              </Text>
              <Text style={styles.metricLabel}>{t("identities:metricIdentities")}</Text>
            </View>
          </View>
          <View style={[styles.metric, subtleSurfaceStyle]}>
            <View style={[styles.metricIcon, { backgroundColor: `${theme.colors.primary}18` }]}>
              <Icon source="key-chain" size={20} color={theme.colors.primary} />
            </View>
            <View style={{ minWidth: 0 }}>
              <Text style={{ fontWeight: "900", color: theme.colors.onSurface }}>
                {totalAccounts}
              </Text>
              <Text style={styles.metricLabel}>{t("identities:metricAccounts")}</Text>
            </View>
          </View>
          <View style={[styles.metric, subtleSurfaceStyle]}>
            <View style={[styles.metricIcon, { backgroundColor: `${theme.colors.primary}18` }]}>
              <Icon source="web" size={20} color={theme.colors.primary} />
            </View>
            <View style={{ minWidth: 0 }}>
              <Text style={{ fontWeight: "900", color: theme.colors.onSurface }}>
                {totalWebsites}
              </Text>
              <Text style={styles.metricLabel}>{t("identities:metricWebsites")}</Text>
            </View>
          </View>
          <View style={[styles.metric, subtleSurfaceStyle]}>
            <View style={[styles.metricIcon, { backgroundColor: "rgba(236, 72, 103, 0.12)" }]}>
              <Icon source="alert-circle-outline" size={20} color={theme.colors.error} />
            </View>
            <View style={{ minWidth: 0 }}>
              <Text style={{ fontWeight: "900", color: theme.colors.onSurface }}>
                {totalRisks}
              </Text>
              <Text style={styles.metricLabel}>{t("identities:metricRisks")}</Text>
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
  logoShell: {
    width: 54,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.32)",
  },
  identityBody: {
    flex: 1,
    minWidth: 0,
  },
  identityContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  identityContentStacked: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
  identityTextBlock: {
    flex: 1,
    minWidth: 0,
    gap: 8,
  },
  identityTextBlockStacked: {
    flex: 0,
    alignSelf: "stretch",
  },
  identityStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
    maxWidth: "58%",
  },
  identityStatsStacked: {
    justifyContent: "flex-start",
    alignSelf: "stretch",
    maxWidth: "100%",
  },
  chip: {
    borderRadius: 10,
  },
  statChip: {
    borderRadius: 10,
  },
  riskChip: {
    borderRadius: 10,
    backgroundColor: "rgba(236, 72, 103, 0.12)",
  },
  metricRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metric: {
    minWidth: 132,
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
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
