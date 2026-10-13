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
  SCROLLBAR_CONTENT_GAP,
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

function sumIdentityEntries(identities: IdentityCluster[]) {
  return identities.reduce(
    (total, identity) => total + identity.entries.length,
    0,
  );
}

function countIdentityDomains(identities: IdentityCluster[]) {
  return new Set(identities.flatMap((identity) => identity.domains)).size;
}

const IdentitiesScreen: React.FC<IdentitiesScreenProps> = ({ navigation }) => {
  const vault = useVault();
  const { t } = useTranslation();
  const {
    globalStyles,
    theme,
    darkmode,
    setHeaderSpacing,
    setTitlebarCenterGap,
    setTitlebarOverlayDragEnabled,
  } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dismissCompactSearchSignal, setDismissCompactSearchSignal] =
    React.useState(0);
  const screenContentStyle = getScreenContentStyle(theme);
  const surfaceStyle = getItemSurfaceStyle(theme);
  const subtleSurfaceStyle = {
    backgroundColor: darkmode
      ? "rgba(255, 255, 255, 0.04)"
      : "rgba(255, 255, 255, 0.48)",
    borderColor: darkmode
      ? "rgba(255, 255, 255, 0.07)"
      : "rgba(255, 255, 255, 0.72)",
  };

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
      setTitlebarCenterGap(0);
      setTitlebarOverlayDragEnabled(false);

      return () => {
        setTitlebarCenterGap(0);
      };
    }, [
      setHeaderSpacing,
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
  const totalAccounts = useMemo(
    () => sumIdentityEntries(identities),
    [identities],
  );
  const totalWebsites = useMemo(
    () => countIdentityDomains(identities),
    [identities],
  );
  const identitiesWithRisks = useMemo(
    () => identities.filter((identity) => identity.riskCount > 0).length,
    [identities],
  );
  const totalAliases = useMemo(
    () =>
      identities.reduce(
        (total, identity) => total + identity.usernames.length,
        0,
      ),
    [identities],
  );

  const dismissCompactSearchIfEmpty = React.useCallback(() => {
    setDismissCompactSearchSignal((current) => current + 1);
    return false;
  }, []);

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
            <IdentityEmailLogo email={identity.email} size={40} />
          </View>
          <View style={styles.identityTextBlock}>
            <Text
              variant="bodyLarge"
              style={[styles.identityTitle, { color: theme.colors.onSurface }]}
              numberOfLines={1}
            >
              {getDefaultIdentityName(identity.email)}
            </Text>
            <Text
              style={[
                styles.identitySubtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
              numberOfLines={1}
            >
              {identity.email}
            </Text>
          </View>
          <View style={styles.identityTrailing}>
            {identity.riskCount > 0 ? (
              <Icon
                source="alert-circle-outline"
                size={18}
                color={theme.colors.error}
              />
            ) : null}
            <View style={styles.identityCount}>
              <Icon source="key-chain" size={15} color={theme.colors.primary} />
              <Text
                style={[
                  styles.identityCountText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {identity.entries.length}
              </Text>
            </View>
            <Icon
              source="chevron-right"
              size={20}
              color={theme.colors.primary}
            />
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );

  return (
    <AnimatedContainer style={globalStyles.container}>
      <FocusAwareStatusBar
        animated
        style={darkmode ? "light" : "dark"}
        translucent
      />

      <SearchHeader
        idPrefix="identities"
        title={t("bar:Identities")}
        placeholder={t("identities:searchHint")}
        value={searchQuery}
        onChangeText={setSearchQuery}
        resetLabel={t("common:reset")}
        dismissCompactSearchSignal={dismissCompactSearchSignal}
      />

      <View
        onStartShouldSetResponderCapture={dismissCompactSearchIfEmpty}
        style={{
          flex: 1,
          width: "100%",
          ...screenContentStyle,
        }}
      >
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={dismissCompactSearchIfEmpty}
          contentContainerStyle={{
            gap: 8,
            paddingRight: SCROLLBAR_CONTENT_GAP,
            alignSelf: "center",
            width: "100%",
            maxWidth: 920,
          }}
        >
          <View style={styles.metricRow}>
            <View style={[styles.metric, subtleSurfaceStyle]}>
              <Icon
                source="email-multiple-outline"
                size={16}
                color={theme.colors.primary}
              />
              <View style={styles.identityStatTextBlock}>
                <Text style={styles.identityStatValue}>
                  {identities.length}
                </Text>
                <Text style={styles.metricLabel}>
                  {t("identities:metricIdentities")}
                </Text>
              </View>
            </View>
            <View style={[styles.metric, subtleSurfaceStyle]}>
              <Icon source="key-chain" size={16} color={theme.colors.primary} />
              <View style={styles.identityStatTextBlock}>
                <Text style={styles.identityStatValue}>{totalAccounts}</Text>
                <Text style={styles.metricLabel}>
                  {t("identities:metricAccounts")}
                </Text>
              </View>
            </View>
            <View style={[styles.metric, subtleSurfaceStyle]}>
              <Icon source="web" size={16} color={theme.colors.primary} />
              <View style={styles.identityStatTextBlock}>
                <Text style={styles.identityStatValue}>{totalWebsites}</Text>
                <Text style={styles.metricLabel}>
                  {t("identities:metricWebsites")}
                </Text>
              </View>
            </View>
            <View style={[styles.metric, subtleSurfaceStyle]}>
              <Icon
                source="alert-circle-outline"
                size={16}
                color={
                  identitiesWithRisks > 0
                    ? theme.colors.error
                    : theme.colors.primary
                }
              />
              <View style={styles.identityStatTextBlock}>
                <Text
                  style={[
                    styles.identityStatValue,
                    identitiesWithRisks > 0
                      ? { color: theme.colors.error }
                      : null,
                  ]}
                >
                  {identitiesWithRisks}
                </Text>
                <Text style={styles.metricLabel}>
                  {t("identities:metricAtRisk")}
                </Text>
              </View>
            </View>
            <View style={[styles.metric, subtleSurfaceStyle]}>
              <Icon
                source="account-outline"
                size={16}
                color={theme.colors.primary}
              />
              <View style={styles.identityStatTextBlock}>
                <Text style={styles.identityStatValue}>{totalAliases}</Text>
                <Text style={styles.metricLabel}>
                  {t("identities:metricAliases")}
                </Text>
              </View>
            </View>
          </View>

          {visibleIdentities.length === 0 ? (
            <View style={[styles.emptyState, surfaceStyle]}>
              <View
                style={[
                  styles.emptyIcon,
                  { backgroundColor: `${theme.colors.primary}14` },
                ]}
              >
                <Icon
                  source="account-search-outline"
                  size={28}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.emptyText}>{t("identities:noMatches")}</Text>
            </View>
          ) : (
            <View style={{ gap: 8 }}>
              {visibleIdentities.map(renderIdentityCard)}
            </View>
          )}
        </ScrollView>
      </View>
    </AnimatedContainer>
  );
};

const styles = StyleSheet.create({
  identityCard: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "visible",
  },
  identityPressable: {
    borderRadius: 12,
    overflow: "hidden",
  },
  identityCardInner: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  logoShell: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.32)",
  },
  identityTextBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  identityTitle: {
    fontWeight: "500",
    userSelect: "none",
  },
  identitySubtitle: {
    opacity: 0.72,
    fontSize: 13,
    lineHeight: 17,
    userSelect: "none",
  },
  identityTrailing: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    flexShrink: 0,
  },
  identityCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  identityCountText: {
    opacity: 0.82,
    fontSize: 13,
    lineHeight: 17,
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
  emptyState: {
    minHeight: 150,
    borderRadius: 8,
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
