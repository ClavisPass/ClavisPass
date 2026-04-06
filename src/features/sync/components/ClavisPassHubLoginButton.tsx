import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
import {
  ActivityIndicator,
  Chip,
  Icon,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../../app/providers/ThemeProvider";
import { useToken } from "../../../app/providers/CloudProvider";
import { useVault } from "../../../app/providers/VaultProvider";
import { logger } from "../../../infrastructure/logging/logger";
import {
  checkDiscovery,
  login as loginToClavisPassHub,
  looksLikeClavisPassHubHostUrl,
  normalizeClavisPassHubHostUrl,
} from "../../../infrastructure/cloud/clients/ClavisPassHubClient";
import {
  getClavisPassHubHostUrl,
  getClavisPassHubLastUsername,
} from "../../../infrastructure/cloud/clients/ClavisPassHubConfig";
import ClavisPassHubDiscoveryResult from "../../../infrastructure/cloud/model/ClavisPassHubDiscoveryResult";
import Button from "../../../shared/components/buttons/Button";
import Modal from "../../../shared/components/modals/Modal";
import PasswordTextbox from "../../../shared/components/PasswordTextbox";
import LogoColored from "../../../shared/ui/LogoColored";
import Divider from "../../../shared/components/Divider";
import SettingsItem from "../../settings/components/SettingsItem";
import * as Linking from "expo-linking";
import { detectTauriEnvironment } from "../../../infrastructure/platform/isTauri";

const CLAVISPASS_HUB_REPO_URL = "https://github.com/ClavisPass/ClavisPass-Hub";

function ClavisPassHubLoginButton() {
  const { t } = useTranslation();
  const { globalStyles, theme } = useTheme();
  const { setSession } = useToken();
  const vault = useVault();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hostUrl, setHostUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [discovery, setDiscovery] =
    useState<ClavisPassHubDiscoveryResult>({ status: "idle" });

  const hostInputRef = useRef<any>(null);
  const usernameInputRef = useRef<any>(null);
  const passwordInputRef = useRef<any>(null);
  const discoveryRequestIdRef = useRef(0);

  const loadDefaults = useCallback(async () => {
    try {
      const [storedHostUrl, storedUsername] = await Promise.all([
        getClavisPassHubHostUrl(),
        getClavisPassHubLastUsername(),
      ]);

      setHostUrl(storedHostUrl ?? "");
      setUsername(storedUsername ?? "");
    } catch (loadError) {
      logger.error("[ClavisPassHubLoginButton] Failed to load defaults:", loadError);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    void loadDefaults();
    setPassword("");
    setError(null);

    const timeoutId = setTimeout(() => {
      hostInputRef.current?.focus?.();
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [visible, loadDefaults]);

  useEffect(() => {
    if (!visible) return;

    const trimmedHostUrl = hostUrl.trim();
    const requestId = ++discoveryRequestIdRef.current;

    if (!trimmedHostUrl) {
      setDiscovery({ status: "idle" });
      return;
    }

    const normalizedHostUrl = normalizeClavisPassHubHostUrl(trimmedHostUrl);

    if (!looksLikeClavisPassHubHostUrl(normalizedHostUrl)) {
      setDiscovery({
        status: "error",
        message: "Bitte eine gültige URL mit http:// oder https:// eingeben.",
      });
      return;
    }

    setDiscovery({ status: "checking" });

    const timeoutId = setTimeout(() => {
      void (async () => {
        const result = await checkDiscovery(normalizedHostUrl);

        if (discoveryRequestIdRef.current !== requestId) {
          return;
        }

        setDiscovery(result);
      })();
    }, 650);

    return () => clearTimeout(timeoutId);
  }, [hostUrl, visible]);

  const handleConnect = useCallback(async () => {
    const normalizedHostUrl = normalizeClavisPassHubHostUrl(hostUrl);
    const normalizedUsername = username.trim();

    if (!looksLikeClavisPassHubHostUrl(normalizedHostUrl)) {
      setError(
        discovery.status === "error" ? discovery.message : t("login:hubHostRequired")
      );
      return;
    }

    if (discovery.status !== "success") {
      setError(
        discovery.status === "error"
          ? discovery.message
          : "ClavisPass Hub konnte nicht verifiziert werden."
      );
      return;
    }

    if (!normalizedUsername || !password) {
      setError(t("login:hubCredentialsRequired"));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await loginToClavisPassHub({
        hostUrl: normalizedHostUrl,
        username: normalizedUsername,
        password,
      });

      const expiresIn =
        data.expiresAt != null
          ? Math.max(
              Math.floor(
                ((data.expiresAt > 1_000_000_000_000
                  ? data.expiresAt
                  : data.expiresAt * 1000) - Date.now()) /
                  1000
              ),
              1
            )
          : undefined;

      await setSession({
        provider: "clavispassHub",
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn,
      });

      vault.update((draft) => {
        draft.version = draft.version;
      });

      setPassword("");
      setVisible(false);
    } catch (connectError: any) {
      logger.error("[ClavisPassHubLoginButton] Login failed:", connectError);

      if (connectError?.status === 401) {
        setError(t("login:hubInvalidCredentials"));
        return;
      }

      if (connectError?.status === 403 || connectError?.code === "USER_DISABLED") {
        setError(t("login:hubAccountDisabled"));
        return;
      }

      if (
        connectError?.code === "HOST_URL_MISSING" ||
        connectError?.code === "INVALID_HOST_URL"
      ) {
        setError(t("login:hubHostRequired"));
        return;
      }

      if (connectError?.code === "NETWORK_ERROR") {
        setError(t("login:hubNetworkError"));
        return;
      }

      setError(connectError?.message || t("login:hubNetworkError"));
    } finally {
      setLoading(false);
    }
  }, [hostUrl, username, password, setSession, t, vault, discovery]);

  const renderDiscoveryIndicator = () => {
    if (!hostUrl.trim()) return null;

    if (discovery.status === "checking") {
      return (
        <View
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            marginTop: -10,
          }}
        >
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      );
    }

    if (discovery.status === "success") {
      return (
        <View
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            marginTop: -10,
          }}
        >
          <Icon source="check-circle" size={20} color="#22c55e" />
        </View>
      );
    }

    if (discovery.status === "error") {
      return (
        <View
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            marginTop: -10,
          }}
        >
          <Icon source="close-circle" size={20} color={theme.colors.error} />
        </View>
      );
    }

    return null;
  };

  const openURL = useCallback(async (value: string) => {
    if (await detectTauriEnvironment()) {
      const { open } = await import("@tauri-apps/plugin-shell");
      await open(value);
    } else {
      await Linking.openURL(value);
    }
  }, []);

  return (
    <>
      <SettingsItem
        leading={
          <LogoColored
            width={20}
            height={20}
            fillColor={theme.colors.primary}
          />
        }
        onPress={() => setVisible(true)}
      >
        ClavisPass Hub
      </SettingsItem>

      <Portal>
        <Modal visible={visible} onDismiss={() => setVisible(false)}>
          <View
            style={{
              width: 320,
              maxWidth: "100%",
              backgroundColor: theme.colors.background,
              padding: 16,
              gap: 10,
              borderWidth: 1,
              borderColor: theme.colors.outlineVariant,
            }}
          >
            <Text variant="titleMedium">{t("login:hubConnect")}</Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              <Chip
                icon={"github"}
                showSelectedOverlay={true}
                onPress={() => {
                  void openURL(CLAVISPASS_HUB_REPO_URL);
                }}
                style={{ borderRadius: 12 }}
              >
                ClavisPass Hub
              </Chip>
            </View>

            <View style={{ height: 40, position: "relative" }}>
              <TextInput
                ref={hostInputRef}
                mode="outlined"
                value={hostUrl}
                onChangeText={setHostUrl}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                placeholder="https://hub.example.com"
                outlineStyle={globalStyles.outlineStyle}
                style={[globalStyles.textInputStyle, { paddingRight: 40 }]}
                onSubmitEditing={() => usernameInputRef.current?.focus?.()}
              />
              {renderDiscoveryIndicator()}
            </View>

            {discovery.status === "error" ? (
              <Text style={{ color: theme.colors.error }}>
                {discovery.message}
              </Text>
            ) : null}

            <Divider />

            <View style={{ height: 40 }}>
              <TextInput
                ref={usernameInputRef}
                mode="outlined"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={t("login:hubUsername")}
                outlineStyle={globalStyles.outlineStyle}
                style={globalStyles.textInputStyle}
                onSubmitEditing={() => passwordInputRef.current?.focus?.()}
              />
            </View>

            <PasswordTextbox
              textInputRef={passwordInputRef}
              value={password}
              setValue={setPassword}
              placeholder={t("login:hubPassword")}
              onSubmitEditing={handleConnect}
            />

            {error ? <Text style={{ color: theme.colors.error }}>{error}</Text> : null}

            <Button
              text={t("login:hubSignIn")}
              onPress={handleConnect}
              loading={loading}
              disabled={loading}
            />
          </View>
        </Modal>
      </Portal>
    </>
  );
}

export default ClavisPassHubLoginButton;
