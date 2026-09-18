import React, { useMemo, useState } from "react";
import { CommonActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider, Icon, Text, TextInput } from "react-native-paper";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";

import type {
  AppTabsParamList,
  IdentityStackParamList,
} from "../app/navigation/model/types";
import { useTheme } from "../app/providers/ThemeProvider";
import { useVault } from "../app/providers/VaultProvider";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import Header from "../shared/components/Header";
import FocusAwareStatusBar from "../shared/components/FocusAwareStatusBar";
import AppChip from "../shared/components/chips/AppChip";
import AnimatedPressable from "../shared/components/AnimatedPressable";
import Modal from "../shared/components/modals/Modal";
import ModalSurface, {
  ModalActions,
} from "../shared/components/modals/ModalSurface";
import { deriveIdentityClusters } from "../features/identity/utils/deriveIdentityClusters";
import ModulesEnum from "../features/vault/model/ModulesEnum";
import {
  buildFaviconUrl,
  normalizeUrl,
} from "../features/vault/utils/digitalCardTheme";
import AppIcon from "../shared/components/icons/AppIcon";
import IdentityEmailLogo from "../features/identity/components/IdentityEmailLogo";
import { getDefaultIdentityName } from "../features/identity/utils/identityDisplayName";

type IdentityDetailScreenProps = NativeStackScreenProps<
  IdentityStackParamList,
  "IdentityDetail"
>;

const moduleLabelKey: Partial<Record<ModulesEnum, string>> = {
  [ModulesEnum.ADDRESS]: "address",
  [ModulesEnum.ATTACHMENT]: "attachment",
  [ModulesEnum.COMPANY]: "company",
  [ModulesEnum.CREDIT_CARD]: "creditCard",
  [ModulesEnum.CUSTOM_FIELD]: "customField",
  [ModulesEnum.DOCUMENT]: "document",
  [ModulesEnum.KEY]: "key",
  [ModulesEnum.NOTE]: "note",
  [ModulesEnum.PASSWORD]: "password",
  [ModulesEnum.PERSON]: "person",
  [ModulesEnum.PIN]: "pin",
  [ModulesEnum.PHONE_NUMBER]: "phoneNumber",
  [ModulesEnum.TOTP]: "totp",
  [ModulesEnum.URL]: "url",
  [ModulesEnum.USERNAME]: "username",
  [ModulesEnum.WIFI]: "wifi",
};

const moduleIconByType: Partial<Record<ModulesEnum, string>> = {
  [ModulesEnum.ADDRESS]: "map-marker-outline",
  [ModulesEnum.ATTACHMENT]: "paperclip",
  [ModulesEnum.COMPANY]: "office-building-outline",
  [ModulesEnum.CREDIT_CARD]: "credit-card-outline",
  [ModulesEnum.CUSTOM_FIELD]: "card-text-outline",
  [ModulesEnum.DOCUMENT]: "card-account-details-outline",
  [ModulesEnum.KEY]: "key-variant",
  [ModulesEnum.NOTE]: "note-outline",
  [ModulesEnum.PASSWORD]: "form-textbox-password",
  [ModulesEnum.PERSON]: "account-details-outline",
  [ModulesEnum.PIN]: "dialpad",
  [ModulesEnum.PHONE_NUMBER]: "phone-outline",
  [ModulesEnum.TOTP]: "two-factor-authentication",
  [ModulesEnum.URL]: "web",
  [ModulesEnum.USERNAME]: "account-outline",
  [ModulesEnum.WIFI]: "wifi",
};

const failedFaviconUrls = new Set<string>();
const WEBSITE_COLLAPSED_LIMIT = 10;
const ENTRIES_COLLAPSED_LIMIT = 12;
const nonSelectableImageStyle =
  Platform.OS === "web"
    ? ({
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitUserDrag: "none",
      } as any)
    : null;

function WebsiteChip({ domain }: { domain: string }) {
  const { theme } = useTheme();
  const faviconUrl = buildFaviconUrl(normalizeUrl(domain)) ?? "";
  const [faviconFailed, setFaviconFailed] = useState(
    faviconUrl !== "" && failedFaviconUrls.has(faviconUrl),
  );

  React.useEffect(() => {
    setFaviconFailed(faviconUrl !== "" && failedFaviconUrls.has(faviconUrl));
  }, [faviconUrl]);

  const showFavicon = faviconUrl !== "" && !faviconFailed;

  return (
    <AppChip
      compact
      icon={({ color, size }) =>
        showFavicon ? (
          <Image
            style={[
              { width: size, height: size, borderRadius: 4 },
              nonSelectableImageStyle,
            ]}
            source={faviconUrl}
            contentFit="cover"
            transition={200}
            onError={() => {
              if (faviconUrl) failedFaviconUrls.add(faviconUrl);
              setFaviconFailed(true);
            }}
          />
        ) : (
          <AppIcon name="web" size={size} color={color ?? theme.colors.primary} />
        )
      }
      style={styles.chip}
    >
      {domain}
    </AppChip>
  );
}

const IdentityDetailScreen: React.FC<IdentityDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const vault = useVault();
  const tabNav = useNavigation<BottomTabNavigationProp<AppTabsParamList>>();
  const { t } = useTranslation();
  const { globalStyles, theme, headerWhite, setHeaderWhite, darkmode, setHeaderSpacing } =
    useTheme();
  const [displayName, setDisplayName] = useState("");
  const [draftDisplayName, setDraftDisplayName] = useState("");
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [websitesExpanded, setWebsitesExpanded] = useState(false);
  const [entriesExpanded, setEntriesExpanded] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(0);
      setHeaderWhite(false);
    }, [setHeaderSpacing, setHeaderWhite]),
  );

  const values = useMemo(() => {
    if (!vault.isUnlocked) return [];
    try {
      return vault.exportFullData().values ?? [];
    } catch {
      return [];
    }
  }, [vault, vault.dirty, vault.isUnlocked]);

  const identity = useMemo(
    () =>
      deriveIdentityClusters(values).find(
        (item) => item.id === route.params.identityId,
      ) ?? null,
    [route.params.identityId, values],
  );

  React.useEffect(() => {
    setWebsitesExpanded(false);
    setEntriesExpanded(false);
  }, [route.params.identityId]);

  const defaultIdentityName = identity
    ? getDefaultIdentityName(identity.email)
    : t("bar:Identities");
  const title = displayName.trim() || defaultIdentityName;
  const getModuleLabel = (module: ModulesEnum) =>
    t(`modules:${moduleLabelKey[module]}`, { defaultValue: module });
  const visibleDomains =
    identity && !websitesExpanded && identity.domains.length > WEBSITE_COLLAPSED_LIMIT
      ? identity.domains.slice(0, WEBSITE_COLLAPSED_LIMIT)
      : (identity?.domains ?? []);
  const hiddenDomainsCount = identity
    ? identity.domains.length - visibleDomains.length
    : 0;
  const visibleEntries =
    identity && !entriesExpanded && identity.entries.length > ENTRIES_COLLAPSED_LIMIT
      ? identity.entries.slice(0, ENTRIES_COLLAPSED_LIMIT)
      : (identity?.entries ?? []);
  const hiddenEntriesCount = identity
    ? identity.entries.length - visibleEntries.length
    : 0;

  const openEntry = (entryId: string) => {
    const value = values.find((item) => item.id === entryId);
    if (!value) return;

    tabNav.dispatch(
      CommonActions.navigate({
        name: "HomeStack",
        params: {
          screen: "Edit",
          params: { value },
        },
      }),
    );
  };

  const openRenameModal = () => {
    setDraftDisplayName(displayName.trim() || defaultIdentityName);
    setRenameModalVisible(true);
  };

  const applyDisplayName = () => {
    setDisplayName(draftDisplayName.trim());
    setRenameModalVisible(false);
  };

  return (
    <AnimatedContainer style={globalStyles.container}>
      <FocusAwareStatusBar
        animated
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent
      />

      <Header
        title={title}
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{
          padding: 8,
          paddingTop: 0,
          gap: 8,
          alignSelf: "center",
          width: "100%",
          maxWidth: 980,
        }}
      >
        {!identity ? (
          <View style={{ padding: 18 }}>
            <Text style={{ opacity: 0.72, textAlign: "center", userSelect: "none" }}>
              {t("identities:detailMissing")}
            </Text>
          </View>
        ) : (
          <>
            <View
              style={[
                styles.panel,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: darkmode ? theme.colors.outlineVariant : "white",
                  boxShadow: theme.colors.shadow as any,
                },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <IdentityEmailLogo email={identity.email} size={44} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text variant="titleMedium" style={{ fontWeight: "900" }} numberOfLines={1}>
                    {title}
                  </Text>
                  <Text style={{ opacity: 0.7 }} numberOfLines={1}>
                    {identity.email}
                  </Text>
                </View>
                <Button
                  compact
                  mode="contained-tonal"
                  icon="pencil-outline"
                  onPress={openRenameModal}
                  style={styles.renameButton}
                >
                  {t("common:edit")}
                </Button>
              </View>

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                <AppChip compact icon="key-chain" style={styles.chip}>
                  {t("identities:accountsCount", { count: identity.entries.length })}
                </AppChip>
                <AppChip compact icon="web" style={styles.chip}>
                  {t("identities:websitesCount", { count: identity.domains.length })}
                </AppChip>
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
              </View>
            </View>

            <View style={styles.grid}>
              <View
                style={[
                  styles.panel,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: darkmode ? theme.colors.outlineVariant : "white",
                    boxShadow: theme.colors.shadow as any,
                  },
                ]}
              >
                <Text style={styles.sectionTitle}>{t("identities:websitesTitle")}</Text>
                <View style={styles.chipWrap}>
                  {identity.domains.length > 0 ? (
                    visibleDomains.map((domain) => (
                      <WebsiteChip key={domain} domain={domain} />
                    ))
                  ) : (
                    <Text style={styles.insightText}>{t("identities:noWebsites")}</Text>
                  )}
                  {hiddenDomainsCount > 0 ? (
                    <AppChip
                      compact
                      icon="chevron-down"
                      style={[styles.chip, styles.moreChip]}
                      onPress={() => setWebsitesExpanded(true)}
                    >
                      {t("identities:showMore", { count: hiddenDomainsCount })}
                    </AppChip>
                  ) : null}
                </View>
                {websitesExpanded && identity.domains.length > WEBSITE_COLLAPSED_LIMIT ? (
                  <Button
                    compact
                    icon="chevron-up"
                    mode="text"
                    onPress={() => setWebsitesExpanded(false)}
                    labelStyle={styles.showLessText}
                    style={styles.showLessButton}
                  >
                    {t("identities:showLess")}
                  </Button>
                ) : null}
              </View>

              <View
                style={[
                  styles.panel,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: darkmode ? theme.colors.outlineVariant : "white",
                    boxShadow: theme.colors.shadow as any,
                  },
                ]}
              >
                <Text style={styles.sectionTitle}>{t("identities:informationTitle")}</Text>
                <View style={styles.chipWrap}>
                  <AppChip compact icon="email-outline" style={styles.chip}>
                    {identity.email}
                  </AppChip>
                  {identity.moduleTypes.map((module) => (
                    <AppChip
                      key={module}
                      compact
                      icon={moduleIconByType[module] ?? "card-text-outline"}
                      style={styles.chip}
                    >
                      {getModuleLabel(module)}
                    </AppChip>
                  ))}
                </View>
              </View>
            </View>

            {identity.usernames.length > 0 ? (
              <View
                style={[
                  styles.panel,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: darkmode ? theme.colors.outlineVariant : "white",
                    boxShadow: theme.colors.shadow as any,
                  },
                ]}
              >
                <Text style={styles.sectionTitle}>{t("identities:usernamesTitle")}</Text>
                <View style={styles.chipWrap}>
                  {identity.usernames.map((username) => (
                    <AppChip key={username} compact icon="account-outline" style={styles.chip}>
                      {username}
                    </AppChip>
                  ))}
                </View>
              </View>
            ) : null}

            <View
              style={[
                styles.panel,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: darkmode ? theme.colors.outlineVariant : "white",
                  boxShadow: theme.colors.shadow as any,
                },
              ]}
            >
              <Text style={styles.sectionTitle}>{t("identities:insightsTitle")}</Text>
              <View style={{ gap: 6, marginTop: 8 }}>
                <Text style={styles.insightText}>
                  {t("identities:insightAccounts", {
                    email: identity.email,
                    count: identity.entries.length,
                  })}
                </Text>
                <Text style={styles.insightText}>
                  {t("identities:insightDomains", {
                    count: identity.domains.length,
                  })}
                </Text>
                <Text style={styles.insightText}>
                  {t("identities:insightInformation", {
                    count: identity.moduleTypes.length,
                  })}
                </Text>
                <Text style={styles.insightText}>
                  {t("identities:insightRisks", {
                    count: identity.riskCount,
                  })}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.panel,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: darkmode ? theme.colors.outlineVariant : "white",
                  boxShadow: theme.colors.shadow as any,
                },
              ]}
            >
              <Text style={styles.sectionTitle}>{t("identities:linkedEntries")}</Text>
              <View style={{ gap: 8, marginTop: 8 }}>
                {visibleEntries.map((entry) => (
                  <AnimatedPressable
                    key={entry.id}
                    onPress={() => openEntry(entry.id)}
                    style={[
                      styles.entryRow,
                      { borderColor: theme.colors.outlineVariant },
                    ]}
                  >
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ fontWeight: "800" }} numberOfLines={1}>
                        {entry.title}
                      </Text>
                      <Text style={{ opacity: 0.62 }} numberOfLines={1}>
                        {entry.domains.join(", ") || t("identities:noDomain")}
                      </Text>
                    </View>
                    <Text style={{ opacity: 0.62, fontSize: 12, userSelect: "none" }}>
                      {t("identities:entryInfoCount", {
                        count: entry.moduleTypes.length,
                      })}
                    </Text>
                    {entry.hasRisk ? (
                      <Icon source="alert-circle-outline" size={20} color={theme.colors.error} />
                    ) : null}
                  </AnimatedPressable>
                ))}
                {hiddenEntriesCount > 0 ? (
                  <AppChip
                    compact
                    icon="chevron-down"
                    style={[styles.chip, styles.moreChip]}
                    onPress={() => setEntriesExpanded(true)}
                  >
                    {t("identities:showMore", { count: hiddenEntriesCount })}
                  </AppChip>
                ) : null}
              </View>
              {entriesExpanded && identity.entries.length > ENTRIES_COLLAPSED_LIMIT ? (
                <View style={styles.showLessRow}>
                  <Button
                    compact
                    icon="chevron-up"
                    mode="text"
                    onPress={() => setEntriesExpanded(false)}
                    labelStyle={styles.showLessText}
                    style={styles.showLessButton}
                  >
                    {t("identities:showLess")}
                  </Button>
                </View>
              ) : null}
              <Divider style={{ marginVertical: 12 }} />
              <Button
                mode="contained-tonal"
                icon="shield-search"
                onPress={() =>
                  tabNav.dispatch(
                    CommonActions.navigate({
                      name: "HomeStack",
                      params: { screen: "Analysis" },
                    }),
                  )
                }
                style={{ borderRadius: 8, alignSelf: "flex-start" }}
              >
                {t("identities:openAnalysis")}
              </Button>
            </View>
          </>
        )}
      </ScrollView>
      <Modal
        visible={renameModalVisible}
        onDismiss={() => setRenameModalVisible(false)}
      >
        <ModalSurface
          width={360}
          title={t("identities:renameTitle")}
          description={identity?.email}
          footer={
            <ModalActions>
              <Button
                style={styles.modalButton}
                onPress={() => setRenameModalVisible(false)}
              >
                {t("common:cancel")}
              </Button>
              <Button
                mode="contained"
                style={styles.modalButton}
                onPress={applyDisplayName}
              >
                {t("common:save")}
              </Button>
            </ModalActions>
          }
        >
          <TextInput
            autoFocus
            selectTextOnFocus
            mode="outlined"
            value={draftDisplayName}
            placeholder={t("identities:displayNamePlaceholder")}
            onChangeText={setDraftDisplayName}
            returnKeyType="done"
            onSubmitEditing={applyDisplayName}
            outlineStyle={globalStyles.outlineStyle}
            style={globalStyles.textInputStyle}
          />
        </ModalSurface>
      </Modal>
    </AnimatedContainer>
  );
};

const styles = StyleSheet.create({
  panel: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
  },
  grid: {
    gap: 8,
  },
  chip: {
    borderRadius: 8,
  },
  riskChip: {
    borderRadius: 8,
    backgroundColor: "rgba(236, 72, 103, 0.12)",
  },
  renameButton: {
    borderRadius: 8,
    flexShrink: 0,
  },
  modalButton: {
    borderRadius: 8,
  },
  moreChip: {
    backgroundColor: "transparent",
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: "900",
    userSelect: "none",
  },
  insightText: {
    opacity: 0.76,
    userSelect: "none",
  },
  entryRow: {
    minHeight: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  showLessRow: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: -2,
  },
  showLessButton: {
    minWidth: 0,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 8,
  },
  showLessText: {
    fontSize: 12,
    lineHeight: 16,
    marginVertical: 0,
  },
});

export default IdentityDetailScreen;
