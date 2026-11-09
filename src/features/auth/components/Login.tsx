import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useWindowDimensions,
  View,
} from "react-native";
import { ActivityIndicator, Button as PaperButton, Text } from "react-native-paper";
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
  removeAuthentication,
} from "../utils/authenticateUser";
import { consumeSystemAuthAutoUnlockSuppression } from "../utils/systemAuthAutoUnlock";

import {
  fetchRemoteVaultFile,
  runVaultOperation,
  uploadRemoteVaultFile,
  canWriteRecoveryVault,
} from "../../../infrastructure/cloud/clients/CloudStorageClient";
import type { VaultSnapshot } from "../../../infrastructure/cloud/model/VaultFetchResult";
import * as DeviceStorageClient from "../../../infrastructure/cloud/clients/DeviceStorageClient";

import { decryptVaultContent } from "../../../infrastructure/crypto/decryptVaultContent";
import { getVaultFormatVersion, LATEST_VAULT_FORMAT } from "../../../infrastructure/crypto/vault/vaultFormatVersion";
import { encryptVaultContent } from "../../../infrastructure/crypto/encryptVaultContent";
import {
  persistPreparedRecoveryVault,
  prepareVaultPasswordRecovery,
} from "../../../infrastructure/crypto/vault/vaultRecovery";
import VaultRecoveryDialog from "./VaultRecoveryDialog";
import VaultRecoverySetupDialog from "./VaultRecoverySetupDialog";

type Props = {
  userInfo: UserInfoType;
  onIntroModeChange?: (isCreating: boolean) => void;
};

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
  const { onIntroModeChange } = props;
  useEffect(() => {
    onIntroModeChange?.(showNewData);
  }, [onIntroModeChange, showNewData]);

  const [fetchError, setFetchError] = useState<string | null>(null);
  const uploadLocalVaultAfterUnlockRef = useRef(false);
  const [recoveryVisible, setRecoveryVisible] = useState(false);
  const [recoverySetupVisible, setRecoverySetupVisible] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(false);
  const creatingRef = useRef(false);
  const mounted = useRef(true);
  const activeProvider = useRef(provider);
  activeProvider.current = provider;
  const activeContent = useRef(vaultFileContent);
  activeContent.current = vaultFileContent;

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

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
    async (
      vaultJson: string,
      expected: VaultSnapshot,
      vaultId?: string,
      token?: string,
      allowRecoveryRemoval = false,
    ) => {
      if (!provider) throw new Error("No vault provider configured");

      await uploadRemoteVaultFile({
        provider,
        accessToken: token ?? (await resolveAccessToken()),
        remotePath: "clavispass.lock",
        content: vaultJson,
        onCompleted: undefined,
        vaultId,
        expected,
        allowRecoveryRemoval,
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
          if (result.reason === "UPDATE_REQUIRED") {
            setFetchError(t("login:vaultUpdateRequired"));
            return;
          }
          const failure = result;
          throw failure.error ?? new Error(failure.reason);
        }

        if (
          uploadLocalVaultAfterUnlockRef.current &&
          provider === "clavispassHub"
        ) {
          try {
            await writeVaultJson(content, { status: "not_found" }, result.payload.vaultId);
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
    [auth, provider, t, vault, writeVaultJson],
  );

  const authenticate = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      setShowNewData(false);
      setVaultFileContent(null);
      setRecoveryVisible(false);
      uploadLocalVaultAfterUnlockRef.current = false;

      const hasAuthentication = await isUsingAuthentication();
      const skipAutomaticSystemAuth = consumeSystemAuthAutoUnlockSuppression();
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

            if (hasAuthentication && !skipAutomaticSystemAuth) {
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

      if ((getVaultFormatVersion(res.content) ?? 0) > LATEST_VAULT_FORMAT) {
        setFetchError(t("login:vaultUpdateRequired"));
        setLoading(false);
        return;
      }
      setVaultFileContent(res.content);
      setLoading(false);

      if (hasAuthentication && !skipAutomaticSystemAuth) {
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

  const createVault = async (
    password: string,
    persist: (content: string, vaultId: string | undefined) => Promise<void>,
    isCurrent: () => boolean,
    recoveryKey?: string,
  ) => {
    const encrypted = await encryptVaultContent(getEmptyData(), password, {
      recoveryKey,
      commitSession: false,
      newVault: true,
    });
    if (!encrypted.ok) throw encrypted.error;

    const saved = await persistPreparedRecoveryVault(
      encrypted.content,
      password,
      (id) => persist(encrypted.content, id),
      isCurrent,
    );
    if (!saved || !isCurrent()) return;
    vault.unlockWithDecryptedVault(saved);
    auth.login(password);
  };

  const newMasterPassword = async (recoveryKey?: string, dialogCurrent = () => true) => {
    if (!canCreateVault || creatingRef.current) return;
    if (!provider || (recoveryKey && !canWriteRecoveryVault(provider))) {
      throw new Error("Recovery is unavailable for this provider");
    }
    const isCurrent = () => mounted.current && activeProvider.current === provider && dialogCurrent();
    creatingRef.current = true;
    setCreating(true);
    setCreateError(false);
    try {
      await createVault(
        masterPassword,
        (content, id) => writeVaultJson(content, { status: "not_found" }, id),
        isCurrent,
        recoveryKey,
      );
    } finally {
      creatingRef.current = false;
      if (mounted.current) setCreating(false);
    }
  };

  const createWithoutRecovery = () => {
    void newMasterPassword().catch(() => {
      if (mounted.current) setCreateError(true);
    });
  };

  const replaceVault = async (password: string, dialogCurrent: () => boolean) => {
    const source = vaultFileContent;
    if (!provider || !source) throw new Error("Replacement requires a saved vault");
    const fromLocalBackup = uploadLocalVaultAfterUnlockRef.current;
    const isCurrent = () =>
      mounted.current && activeProvider.current === provider &&
      activeContent.current === source &&
      uploadLocalVaultAfterUnlockRef.current === fromLocalBackup &&
      dialogCurrent();

    await runVaultOperation(async () => {
      if (!isCurrent()) throw new Error("Vault selection changed");
      const token = await resolveAccessToken();
      const saved = await fetchRemoteVaultFile({
        provider,
        accessToken: token,
        remotePath: "clavispass.lock",
      });
      if (saved.status === "error") throw new Error("Could not check the saved vault");

      if (fromLocalBackup) {
        const backup = await DeviceStorageClient.fetchFile();
        if (saved.status !== "not_found" || backup.status !== "ok" || backup.content !== source) {
          throw new Error("The vault or backup changed before replacement");
        }
      } else if (saved.status !== "ok" || saved.content !== source) {
        throw new Error("The saved vault changed before replacement");
      }
      if (!isCurrent()) throw new Error("Vault selection changed");

      await createVault(password, async (content, id) => {
        await writeVaultJson(content, saved, id, token, true);
        await removeAuthentication().catch(() => {
          logger.warn("[Login] Could not clear system authentication after replacement");
        });
      }, isCurrent);
    });
  };

  const recoverWithNewPassword = async (key: string, password: string, dialogCurrent: () => boolean) => {
    const source = vaultFileContent;
    if (!provider || !canWriteRecoveryVault(provider) || !source ||
        uploadLocalVaultAfterUnlockRef.current) {
      throw new Error("Recovery requires a saved vault");
    }
    const isCurrent = () => mounted.current && activeProvider.current === provider &&
      activeContent.current === source && dialogCurrent();
    await runVaultOperation(async () => {
      const token = await resolveAccessToken();
      const saved = await fetchRemoteVaultFile({
        provider,
        accessToken: token,
        remotePath: "clavispass.lock",
      });
      if (saved.status !== "ok" || saved.content !== source || !isCurrent()) {
        throw new Error("The saved vault changed before password recovery");
      }
      const content = await prepareVaultPasswordRecovery(saved.content, key, password);
      const payload = await persistPreparedRecoveryVault(content, password, async (id) => {
        await writeVaultJson(content, saved, id, token);
        await removeAuthentication().catch(() => {
          logger.warn("[Login] Could not clear system authentication after recovery");
        });
      }, isCurrent);
      if (!payload) return;
      vault.unlockWithDecryptedVault(payload);
      auth.login(password);
    });
  };

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
                  if (canCreateVault) createWithoutRecovery();
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
              onPress={createWithoutRecovery}
              disabled={!canCreateVault || creating}
              loading={creating}
            />
            {canWriteRecoveryVault(provider) ? (
              <PaperButton disabled={!canCreateVault || creating} onPress={() => setRecoverySetupVisible(true)}>
                {t("login:recoveryCreateOption")}
              </PaperButton>
            ) : null}
            {createError ? <Text style={{ color: theme.colors.error }}>{t("login:recoveryFailed")}</Text> : null}
            {recoverySetupVisible && canWriteRecoveryVault(provider) ? (
              <VaultRecoverySetupDialog
                cloudVault={provider !== "device"}
                onDismiss={() => setRecoverySetupVisible(false)}
                onSave={(key, isCurrent) => newMasterPassword(key ?? undefined, isCurrent)}
              />
            ) : null}
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

        {!showNewData && !fetchError && vaultFileContent ? (
          <>
            <PaperButton
              style={{ borderRadius: 12 }}
              onPress={() => setRecoveryVisible(true)}
            >
              {t("login:forgotMasterPassword")}
            </PaperButton>
            {recoveryVisible ? (
              <VaultRecoveryDialog
                content={vaultFileContent}
                recoverySupported={
                  canWriteRecoveryVault(provider) &&
                  !uploadLocalVaultAfterUnlockRef.current
                }
                onDismiss={() => setRecoveryVisible(false)}
                onRecover={recoverWithNewPassword}
                onReplace={replaceVault}
              />
            ) : null}
          </>
        ) : null}
      </Animated.View>
    );
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(110).duration(360).easing(transitionEasing)}
      layout={contentTransition}
      style={{ width: "100%", gap: 16 }}
    >
      {isWideLayout && !onIntroModeChange ? (
        <Animated.View
          key={showNewData ? "intro-create" : "intro-unlock"}
          entering={FadeIn.duration(280).easing(transitionEasing)}
          exiting={FadeOut.duration(180).easing(transitionEasing)}
          layout={contentTransition}
        >
          <Text
            variant="bodyMedium"
            style={{ textAlign: "center", color: theme.colors.onSurfaceVariant }}
          >
            {showNewData
              ? t("login:introCreateVault")
              : t("login:introUnlockVault")}
          </Text>
        </Animated.View>
      ) : null}
      {renderStageContent()}
    </Animated.View>
  );
}

export default Login;
