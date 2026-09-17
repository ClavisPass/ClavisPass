import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import * as Progress from "react-native-progress";
import { useTranslation } from "react-i18next";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

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
import PasswordStrengthLevel from "../../analysis/model/PasswordStrengthLevel";
import {
  computeEntropyBitsForUi,
  entropyToProgress,
  entropyToStrength,
} from "../../vault/utils/entropyUi";

import {
  authenticateUser,
  isUsingAuthentication,
  loadAuthentication,
} from "../utils/authenticateUser";

import {
  fetchRemoteVaultFile,
  uploadRemoteVaultFile,
} from "../../../infrastructure/cloud/clients/CloudStorageClient";
import * as DeviceStorageClient from "../../../infrastructure/cloud/clients/DeviceStorageClient";

import { decryptVaultContent } from "../../../infrastructure/crypto/decryptVaultContent";
import { encryptVaultContent } from "../../../infrastructure/crypto/encryptVaultContent";

type Props = { userInfo: UserInfoType };

function Login(props: Props) {
  const auth = useAuth();
  const vault = useVault();
  const { provider, accessToken, ensureFreshAccessToken } = useToken();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 600;

  const [vaultFileContent, setVaultFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewData, setShowNewData] = useState(false);

  const [fetchError, setFetchError] = useState<string | null>(null);
  const uploadLocalVaultAfterUnlockRef = useRef(false);

  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState(false);
  const [autofocus, setAutofocus] = useState(false);

  const textInputRef = useRef<any>(null);
  const textInputNewRef = useRef<any>(null);
  const textInputNewConfirmRef = useRef<any>(null);

  const [masterPassword, setMasterPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const masterPasswordStrength = useMemo(() => {
    const entropyBits = computeEntropyBitsForUi(masterPassword);
    const strength = entropyToStrength(entropyBits);

    return {
      entropyBits,
      progress: entropyToProgress(entropyBits),
      strength,
    };
  }, [masterPassword]);

  const getStrengthColor = useCallback(
    (strength: PasswordStrengthLevel) => {
      if (strength === PasswordStrengthLevel.WEAK) return theme.colors.error;
      if (strength === PasswordStrengthLevel.MEDIUM)
        return theme.colors.warning;
      return theme.colors.success;
    },
    [theme.colors.error, theme.colors.success, theme.colors.warning],
  );

  const masterPasswordStrengthColor = getStrengthColor(
    masterPasswordStrength.strength,
  );
  const masterPasswordEntered = masterPassword.length > 0;
  const masterPasswordIsStrongEnough =
    masterPasswordEntered &&
    masterPasswordStrength.strength !== PasswordStrengthLevel.WEAK;
  const masterPasswordConfirmMismatch =
    newPasswordConfirm.length > 0 && masterPassword !== newPasswordConfirm;
  const canCreateVault =
    masterPasswordIsStrongEnough &&
    newPasswordConfirm.length > 0 &&
    !masterPasswordConfirmMismatch;

  const [
    isUsingAuthenticationButtonVisible,
    setIsUsingAuthenticationButtonVisible,
  ] = useState(false);
  const transitionEasing = Easing.bezier(0.22, 1, 0.36, 1);
  const contentTransition =
    LinearTransition.duration(320).easing(transitionEasing);

  const resolveAccessToken = useCallback(async (): Promise<string> => {
    if (!provider || provider === "device") return "";
    return accessToken ?? (await ensureFreshAccessToken()) ?? "";
  }, [provider, accessToken, ensureFreshAccessToken]);

  const writeVaultJson = useCallback(
    async (vaultJson: string, vaultId?: string) => {
      if (!provider) return;

      const token = await resolveAccessToken();

      await uploadRemoteVaultFile({
        provider,
        accessToken: token,
        remotePath: "clavispass.lock",
        content: vaultJson,
        onCompleted: undefined,
        vaultId,
      });
    },
    [provider, resolveAccessToken],
  );

  const loginWithMasterPassword = useCallback(
    async (masterPasswordToUse: string, content: string | null) => {
      try {
        if (!content) return;

        const result = await decryptVaultContent(content, masterPasswordToUse);

        if (!result.ok) {
          const failure = result;
          throw failure.error ?? new Error(failure.reason);
        }

        if (
          uploadLocalVaultAfterUnlockRef.current &&
          provider === "clavispassHub"
        ) {
          try {
            await writeVaultJson(content, result.payload.vaultId);
            uploadLocalVaultAfterUnlockRef.current = false;
          } catch (uploadError) {
            logger.error(
              "[Login] Failed to upload initial Hub vault:",
              uploadError,
            );
            setFetchError("Failed to upload vault.");
            return;
          }
        }

        vault.unlockWithDecryptedVault(result.payload);
        auth.login(masterPasswordToUse);
      } catch (err) {
        logger.error("[Login] Error decrypting vault:", err);
        textInputRef.current?.focus?.();
        setMasterPassword("");
        setError(true);
        setTimeout(() => setError(false), 1000);
      }
    },
    [auth, provider, vault, writeVaultJson],
  );

  const authenticate = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      setShowNewData(false);
      setVaultFileContent(null);
      uploadLocalVaultAfterUnlockRef.current = false;

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
        setFetchError(
          t("login:cloudAuthMissing") ?? "No access token available.",
        );
        setLoading(false);
        return;
      }

      const res = await fetchRemoteVaultFile({
        provider,
        accessToken: tokenToUse,
        remotePath: "clavispass.lock",
      });

      if (res.status === "not_found") {
        if (provider === "clavispassHub") {
          const local = await DeviceStorageClient.fetchFile();

          if (local.status === "ok") {
            setVaultFileContent(local.content);
            uploadLocalVaultAfterUnlockRef.current = true;
            setLoading(false);

            if (hasAuthentication) {
              const ok = await authenticateUser();
              if (ok) {
                const storedPassword = await loadAuthentication();
                if (storedPassword) {
                  await loginWithMasterPassword(storedPassword, local.content);
                  return;
                }
              }
            }

            setAutofocus(true);
            setTimeout(() => textInputRef.current?.focus?.(), 50);
            return;
          }

          if (local.status === "error") {
            logger.warn(
              "[Login] Hub vault not found and local backup fetch failed:",
              local.message,
              local.cause,
            );
          }
        }

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
      if (!canCreateVault) {
        return;
      }

      if (
        !(
          masterPassword === newPasswordConfirm &&
          masterPassword &&
          newPasswordConfirm
        )
      ) {
        logger.error("[Login] Master password confirmation does not match.");
        return;
      }

      // 1) create empty vault payload
      const empty = getEmptyData();

      const encrypted = await encryptVaultContent(empty, masterPassword);
      if (!encrypted.ok) {
        const failure = encrypted;
        throw failure.error;
      }

      const vaultJson = encrypted.content;

      // 3) write to provider
      if (provider) {
        await writeVaultJson(vaultJson, empty.vaultId);
      }

      // 4) unlock
      vault.unlockWithDecryptedVault(empty);
      auth.login(masterPassword);
    } catch (e) {
      logger.error("[Login] Failed to create new vault:", e);
      setFetchError("Failed to create vault.");
    }
  }, [
    auth,
    masterPassword,
    newPasswordConfirm,
    canCreateVault,
    provider,
    vault,
    writeVaultJson,
  ]);

  const stageKey = loading
    ? "loading"
    : fetchError && !showNewData
      ? "error"
      : showNewData
        ? "create"
        : "unlock";

  const renderStageContent = () => {
    if (loading) {
      return (
        <Animated.View
          key="loading"
          entering={FadeIn.duration(280).easing(transitionEasing)}
          exiting={FadeOut.duration(220).easing(transitionEasing)}
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: isWideLayout ? 24 : 12,
            minHeight: isWideLayout ? 154 : 128,
          }}
        >
          <ActivityIndicator size={"large"} animating={true} />
        </Animated.View>
      );
    }

    return (
      <Animated.View
        key={stageKey}
        entering={FadeInDown.duration(320).easing(transitionEasing)}
        exiting={FadeOut.duration(220).easing(transitionEasing)}
        layout={contentTransition}
        style={{ width: "100%", gap: 10 }}
      >
        <TypeWriterComponent displayName={props.userInfo?.username ?? ""} />

        {fetchError && !showNewData && (
          <Animated.View
            layout={contentTransition}
            style={{ width: "100%", gap: 8 }}
          >
            <Text style={{ color: theme.colors.error, textAlign: "center" }}>
              {fetchError}
            </Text>
            <Button
              text={t("common:retry") ?? "Retry"}
              onPress={authenticate}
            />
          </Animated.View>
        )}

        {!fetchError && showNewData ? (
          <>
            <Animated.View
              layout={contentTransition}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <PasswordTextbox
                autofocus
                textInputRef={textInputNewRef}
                setCapsLock={setCapsLock}
                setValue={setMasterPassword}
                value={masterPassword}
                placeholder={t("login:newMasterPassword")}
                onSubmitEditing={() =>
                  textInputNewConfirmRef.current?.focus?.()
                }
              />
              {masterPasswordEntered ? (
                <Animated.View
                  layout={contentTransition}
                  style={{ width: "100%", gap: 6, paddingHorizontal: 2 }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      {t("login:masterPasswordStrength")}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={{
                        color: masterPasswordStrengthColor,
                        fontWeight: "600",
                      }}
                    >
                      {t(
                        `analysis:${masterPasswordStrength.strength.toLowerCase()}`,
                      )}
                    </Text>
                  </View>
                  <Progress.Bar
                    progress={masterPasswordStrength.progress}
                    color={masterPasswordStrengthColor}
                    width={null}
                    borderWidth={0}
                    unfilledColor={theme.colors.outlineVariant}
                    height={4}
                  />
                  <Text
                    variant="bodySmall"
                    style={{
                      color: masterPasswordIsStrongEnough
                        ? theme.colors.onSurfaceVariant
                        : theme.colors.error,
                    }}
                  >
                    {masterPasswordIsStrongEnough
                      ? t("login:masterPasswordStrongEnoughHint")
                      : t("login:masterPasswordWeakHint")}
                  </Text>
                </Animated.View>
              ) : null}
              <PasswordTextbox
                textInputRef={textInputNewConfirmRef}
                setCapsLock={setCapsLock}
                setValue={setNewPasswordConfirm}
                value={newPasswordConfirm}
                placeholder={t("login:confirmMasterPassword")}
                onSubmitEditing={() => {
                  if (canCreateVault) void newMasterPassword();
                }}
              />
              {masterPasswordConfirmMismatch ? (
                <Animated.View layout={contentTransition}>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.error }}
                  >
                    {t("login:masterPasswordMismatch")}
                  </Text>
                </Animated.View>
              ) : null}
            </Animated.View>
            <Button
              text={t("login:setNewPassword")}
              onPress={newMasterPassword}
              disabled={!canCreateVault}
            />
          </>
        ) : !fetchError ? (
          <>
            <Animated.View layout={contentTransition} style={{ width: "100%" }}>
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
            </Animated.View>
            <Button text={t("login:login")} onPress={handlePasswordLogin} />
          </>
        ) : null}

        {capsLock && (
          <Animated.View layout={contentTransition}>
            <Text style={{ color: theme.colors.primary, marginTop: 10 }}>
              {t("common:capslockOn")}
            </Text>
          </Animated.View>
        )}

        {isUsingAuthenticationButtonVisible && !showNewData && !fetchError && (
          <Animated.View layout={contentTransition}>
            <Button
              maxWidth={"100%"}
              color="black"
              icon="fingerprint"
              onPress={authenticate}
            />
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const brandingContent = (
    <Animated.View
      layout={contentTransition}
      entering={FadeIn.duration(360).easing(transitionEasing)}
      style={{
        width: "100%",
        maxWidth: isWideLayout ? 320 : 360,
        gap: 10,
        alignItems: "center",
      }}
    >
      <Logo width={isWideLayout ? 76 : 44} height={isWideLayout ? 76 : 44} />
      <Text
        style={{
          width: "100%",
          textAlign: "center",
          fontFamily: "LexendExa_400Regular",
          fontSize: isWideLayout ? 18 : 15,
          lineHeight: isWideLayout ? 24 : 21,
          includeFontPadding: false,
          paddingHorizontal: 6,
        }}
      >
        ClavisPass
      </Text>
      {isWideLayout ? (
        <Animated.View
          key={`intro-${showNewData ? "create" : "unlock"}`}
          entering={FadeIn.duration(280).easing(transitionEasing)}
          exiting={FadeOut.duration(180).easing(transitionEasing)}
          layout={contentTransition}
        >
          <Text
            style={{
              opacity: 0.72,
              textAlign: "center",
            }}
          >
            {showNewData
              ? t("login:introCreateVault")
              : t("login:introUnlockVault")}
          </Text>
        </Animated.View>
      ) : null}
    </Animated.View>
  );

  if (isWideLayout) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          paddingHorizontal: 24,
          paddingVertical: 24,
          gap: 24,
          backgroundColor: "transparent",
        }}
      >
        <Animated.View
          entering={FadeInDown.delay(60).duration(360).easing(transitionEasing)}
          style={{
            flex: 0.95,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "stretch",
          }}
        >
          {brandingContent}
        </Animated.View>

        <View
          style={{
            width: StyleSheet.hairlineWidth,
            alignSelf: "stretch",
            backgroundColor: theme.colors.outlineVariant,
            opacity: 0.85,
          }}
        />

        <Animated.View
          entering={FadeInDown.delay(120)
            .duration(360)
            .easing(transitionEasing)}
          layout={contentTransition}
          style={{
            flex: 1.55,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "stretch",
            paddingLeft: 18,
            paddingRight: 18,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: "100%",
              alignSelf: "center",
            }}
          >
            {renderStageContent()}
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        width: "100%",
        paddingHorizontal: 6,
        paddingVertical: 20,
        gap: 14,
      }}
    >
      <Animated.View
        entering={FadeInDown.delay(50).duration(340).easing(transitionEasing)}
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        {brandingContent}
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(110).duration(360).easing(transitionEasing)}
        layout={contentTransition}
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            width: "92%",
            maxWidth: 380,
            alignSelf: "center",
          }}
        >
          {renderStageContent()}
        </View>
      </Animated.View>
    </View>
  );
}

export default Login;
