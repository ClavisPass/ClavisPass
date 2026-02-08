import React, { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../../app/providers/AuthProvider";
import { useToken } from "../../../app/providers/CloudProvider";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { useVault } from "../../../app/providers/VaultProvider";

import UserInfoType from "../../sync/model/UserInfoType";
import Button from "../../../shared/components/buttons/Button";
import TypeWriterComponent from "../../../shared/components/TypeWriter";
import PasswordTextbox from "../../../shared/components/PasswordTextbox";
import Logo from "../../../shared/ui/Logo";

import getEmptyData from "../../vault/utils/getEmptyData";
import { logger } from "../../../infrastructure/logging/logger";

import {
  authenticateUser,
  isUsingAuthentication,
  loadAuthentication,
} from "../utils/authenticateUser";

import {
  fetchRemoteVaultFile,
  uploadRemoteVaultFile,
} from "../../../infrastructure/cloud/clients/CloudStorageClient";

import { decryptVaultContent } from "../../../infrastructure/crypto/decryptVaultContent";
import { getCryptoProvider } from "../../../infrastructure/crypto/provider";
import { encryptVaultV1 } from "../../../infrastructure/crypto/vault/v1/VaultV1";

type Props = { userInfo: UserInfoType };

function Login(props: Props) {
  const auth = useAuth();
  const vault = useVault();
  const { provider, accessToken, ensureFreshAccessToken } = useToken();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [vaultFileContent, setVaultFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewData, setShowNewData] = useState(false);

  const [fetchError, setFetchError] = useState<string | null>(null);

  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState(false);
  const [autofocus, setAutofocus] = useState(false);

  const textInputRef = useRef<any>(null);
  const textInputNewRef = useRef<any>(null);
  const textInputNewConfirmRef = useRef<any>(null);

  const [masterPassword, setMasterPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [isUsingAuthenticationButtonVisible, setIsUsingAuthenticationButtonVisible] =
    useState(false);

  const resolveAccessToken = useCallback(async (): Promise<string> => {
    if (!provider || provider === "device") return "";
    return accessToken ?? (await ensureFreshAccessToken()) ?? "";
  }, [provider, accessToken, ensureFreshAccessToken]);

  const writeVaultJson = useCallback(
    async (vaultJson: string) => {
      if (!provider) return;

      const token = await resolveAccessToken();

      await uploadRemoteVaultFile({
        provider,
        accessToken: token,
        remotePath: "clavispass.lock",
        content: vaultJson, // string ist ok, wenn UploadFileParams.content string erlaubt
        onCompleted: undefined,
      });
    },
    [provider, resolveAccessToken]
  );

  const loginWithMasterPassword = useCallback(
    async (masterPasswordToUse: string, content: string | null) => {
      try {
        if (!content) return;

        const cryptoProvider = await getCryptoProvider();


        const result = await decryptVaultContent(
          cryptoProvider,
          content,
          masterPasswordToUse
        );

        if (!result.ok) {
          throw result.error ?? new Error(result.reason);
        }

        // 1) unlock
        vault.unlockWithDecryptedVault(result.payload);
        auth.login(masterPasswordToUse);

        // 2) best-effort migration writeback (nur wenn legacy erkannt wurde)
        if (result.migratedVaultJson && provider) {
          try {
            await writeVaultJson(result.migratedVaultJson);
            logger.info("[Login] Legacy vault migrated to V1 and written back.");
          } catch (e) {
            logger.warn("[Login] Migration write-back failed (continuing):", e);
          }
        }
      } catch (err) {
        logger.error("[Login] Error decrypting vault:", err);
        textInputRef.current?.focus?.();
        setMasterPassword("");
        setError(true);
        setTimeout(() => setError(false), 1000);
      }
    },
    [auth, vault, provider, writeVaultJson]
  );

  const authenticate = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      setShowNewData(false);
      setVaultFileContent(null);

      const hasAuthentication = await isUsingAuthentication();
      setIsUsingAuthenticationButtonVisible(hasAuthentication);

      if (!provider) {
        logger.warn("[Login] No provider configured – treating as new vault.");
        setShowNewData(true);
        setLoading(false);
        setTimeout(() => textInputNewRef.current?.focus?.(), 50);
        return;
      }

      const tokenToUse = await resolveAccessToken();
      if (provider !== "device" && !tokenToUse) {
        setFetchError(t("login:cloudAuthMissing") ?? "No access token available.");
        setLoading(false);
        return;
      }

      const res = await fetchRemoteVaultFile({
        provider,
        accessToken: tokenToUse,
        remotePath: "clavispass.lock",
      });

      if (res.status === "not_found") {
        setShowNewData(true);
        setLoading(false);
        setTimeout(() => textInputNewRef.current?.focus?.(), 50);
        return;
      }

      if (res.status === "error") {
        setFetchError(res.message || "Failed to load vault.");
        setLoading(false);
        return;
      }

      setVaultFileContent(res.content);
      setLoading(false);

      if (hasAuthentication) {
        const ok = await authenticateUser();
        if (ok) {
          const storedPassword = await loadAuthentication();
          if (storedPassword) {
            await loginWithMasterPassword(storedPassword, res.content);
            return;
          }
        }
      }

      setAutofocus(true);
      setTimeout(() => textInputRef.current?.focus?.(), 50);
    } catch (err) {
      logger.error("[Login] Error during authentication/bootstrap:", err);
      setFetchError("Unexpected error while loading vault.");
      setLoading(false);
    }
  }, [provider, resolveAccessToken, t, loginWithMasterPassword]);

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  const handlePasswordLogin = () => {
    if (!vaultFileContent) return;
    void loginWithMasterPassword(masterPassword, vaultFileContent);
  };

  const newMasterPassword = useCallback(async () => {
    try {
      if (!(masterPassword === newPasswordConfirm && masterPassword && newPasswordConfirm)) {
        logger.error("[Login] Master password confirmation does not match.");
        return;
      }

      // 1) create empty vault payload
      const empty = getEmptyData();

      const cryptoProvider = await getCryptoProvider();

      // 2) encrypt as VaultV1 JSON string
      //    encryptVaultV1(crypto, masterPassword, payload) -> Promise<string>
      const vaultJson = await encryptVaultV1(cryptoProvider, masterPassword, empty);

      // 3) write to provider
      if (provider) {
        await writeVaultJson(vaultJson);
      }

      // 4) unlock
      vault.unlockWithDecryptedVault(empty);
      auth.login(masterPassword);
    } catch (e) {
      logger.error("[Login] Failed to create new vault:", e);
      setFetchError("Failed to create vault.");
    }
  }, [auth, masterPassword, newPasswordConfirm, provider, vault, writeVaultJson]);

  if (loading) {
    return <ActivityIndicator size={"large"} animating={true} />;
  }

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        width: "100%",
      }}
    >
      <Logo width={50} height={50} style={{ alignSelf: "center", flexGrow: 1 }} />

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
          marginBottom: 0,
        }}
      >
        <TypeWriterComponent displayName={props.userInfo?.username ?? ""} />

        {fetchError && !showNewData && (
          <View style={{ width: "100%", gap: 8 }}>
            <Text style={{ color: theme.colors.error, textAlign: "center" }}>
              {fetchError}
            </Text>
            <Button text={t("common:retry") ?? "Retry"} onPress={authenticate} />
          </View>
        )}

        {!fetchError && showNewData ? (
          <>
            <View style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
              <PasswordTextbox
                autofocus
                textInputRef={textInputNewRef}
                setCapsLock={setCapsLock}
                setValue={setMasterPassword}
                value={masterPassword}
                placeholder={t("login:newMasterPassword")}
                onSubmitEditing={() => textInputNewConfirmRef.current?.focus?.()}
              />
              <PasswordTextbox
                textInputRef={textInputNewConfirmRef}
                setCapsLock={setCapsLock}
                setValue={setNewPasswordConfirm}
                value={newPasswordConfirm}
                placeholder={t("login:confirmMasterPassword")}
              />
            </View>
            <Button text={t("login:setNewPassword")} onPress={newMasterPassword} />
          </>
        ) : !fetchError ? (
          <>
            <View style={{ width: "100%" }}>
              <PasswordTextbox
                setCapsLock={setCapsLock}
                textInputRef={textInputRef}
                errorColor={error}
                autofocus={autofocus}
                setValue={setMasterPassword}
                value={masterPassword}
                placeholder={t("login:masterPassword")}
                onSubmitEditing={handlePasswordLogin}
              />
            </View>
            <Button text={t("login:login")} onPress={handlePasswordLogin} />
          </>
        ) : null}

        {capsLock && (
          <Text style={{ color: theme.colors.primary, marginTop: 10 }}>
            {t("common:capslockOn")}
          </Text>
        )}
      </View>

      <View
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          flexGrow: 1,
          justifyContent: "flex-end",
          gap: 6,
        }}
      >
        {isUsingAuthenticationButtonVisible && !showNewData && !fetchError && (
          <Button maxWidth={"100%"} color="black" icon="fingerprint" onPress={authenticate} />
        )}
      </View>
    </View>
  );
}

export default Login;
