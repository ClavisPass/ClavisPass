import React, { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

import { useAuth } from "../../../app/providers/AuthProvider";
import { useToken } from "../../../app/providers/CloudProvider";
import { useData } from "../../../app/providers/DataProvider";
import { useTheme } from "../../../app/providers/ThemeProvider";

import UserInfoType from "../../sync/model/UserInfoType";
import Button from "../../../shared/components/buttons/Button";
import TypeWriterComponent from "../../../shared/components/TypeWriter";
import PasswordTextbox from "../../../shared/components/PasswordTextbox";

import CryptoType, { CryptoTypeSchema } from "../../../infrastructure/crypto/CryptoType";
import { decrypt } from "../../../infrastructure/crypto/CryptoLayer";
import { DataTypeSchema } from "../../vault/model/DataType";
import getEmptyData from "../../vault/utils/getEmptyData";

import {
  authenticateUser,
  isUsingAuthentication,
  loadAuthentication,
} from "../../../shared/utils/authenticateUser";

import Logo from "../../../shared/ui/Logo";
import { logger } from "../../../infrastructure/logging/logger";
import { fetchRemoteVaultFile } from "../../../infrastructure/clients/CloudStorageClient";
import { useTranslation } from "react-i18next";

type Props = {
  userInfo: UserInfoType;
};

function Login(props: Props) {
  const auth = useAuth();
  const { provider, accessToken, ensureFreshAccessToken } = useToken();
  const { theme } = useTheme();
  const { setData, setLastUpdated, setShowSave } = useData();
  const { t } = useTranslation();

  const [parsedCryptoData, setParsedCryptoData] = useState<CryptoType | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [showNewData, setShowNewData] = useState(false);

  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState(false);
  const [autofocus, setAutofocus] = useState(false);

  const textInputRef = useRef<any>(null);
  const textInputNewRef = useRef<any>(null);
  const textInputNewConfirmRef = useRef<any>(null);

  const [masterPassword, setMasterPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [
    isUsingAuthenticationButtonVisible,
    setIsUsingAuthenticationButtonVisible,
  ] = useState(false);

  const authenticate = useCallback(async () => {
    try {
      setLoading(true);

      const hasAuthentication = await isUsingAuthentication();
      setIsUsingAuthenticationButtonVisible(hasAuthentication);

      if (!provider) {
        logger.warn("[Login] No provider configured – treating as new vault.");
        setShowNewData(true);
        setLoading(false);
        return;
      }

      let tokenToUse: string | null = null;

      if (provider !== "device") {
        tokenToUse = accessToken ?? (await ensureFreshAccessToken());
        if (!tokenToUse) {
          logger.warn(
            "[Login] No access token available – treating as new vault."
          );
          setShowNewData(true);
          setLoading(false);
          return;
        }
      }

      const remoteContent = await fetchRemoteVaultFile({
        provider,
        accessToken: tokenToUse ?? "",
        remotePath: "clavispass.lock",
      });

      if (!remoteContent) {
        setShowNewData(true);
        setLoading(false);
        return;
      }

      const parsed = CryptoTypeSchema.parse(JSON.parse(remoteContent));
      setParsedCryptoData(parsed);
      setLoading(false);

      if (hasAuthentication) {
        const ok = await authenticateUser();
        if (ok) {
          const storedPassword = await loadAuthentication();
          if (storedPassword) {
            await loginWithMasterPassword(storedPassword, parsed);
            return;
          }
        }
        logger.info(
          "[Login] Biometric auth failed or no stored password – using password input."
        );
      }

      setAutofocus(true);
      setTimeout(() => {
        textInputRef.current?.focus?.();
      }, 50);
    } catch (err) {
      logger.error("[Login] Error during authentication/bootstrap:", err);
      setShowNewData(true);
      setLoading(false);
    }
  }, [provider, accessToken, ensureFreshAccessToken]);

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  const loginWithMasterPassword = async (
    masterPassword: string,
    cryptoData: CryptoType | null
  ) => {
    try {
      if (!cryptoData) {
        return;
      }
      const lastUpdated = cryptoData.lastUpdated;
      const decryptedData = decrypt(cryptoData, masterPassword);
      const jsonData = JSON.parse(decryptedData);

      const parsedData = DataTypeSchema.parse(jsonData);
      setData(parsedData);
      setLastUpdated(lastUpdated);
      setShowSave(false);
      auth.login(masterPassword);
    } catch (error) {
      logger.error("[Login] Error decrypting data:", error);
      textInputRef.current?.focus?.();
      setMasterPassword("");
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1000);
    }
  };

  const handlePasswordLogin = () => {
    if (!parsedCryptoData) {
      logger.warn("[Login] No crypto data available for password login.");
      return;
    }
    void loginWithMasterPassword(masterPassword, parsedCryptoData);
  };

  const newMasterPassword = () => {
    if (
      masterPassword === newPasswordConfirm &&
      masterPassword !== "" &&
      newPasswordConfirm !== ""
    ) {
      setData(getEmptyData());
      auth.login(masterPassword);
    } else {
      logger.error("[Login] Master password confirmation does not match.");
    }
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator size={"large"} animating={true} />
      ) : (
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
          <Logo
            width={50}
            height={50}
            style={{ alignSelf: "center", flexGrow: 1 }}
          />
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

            {showNewData ? (
              <>
                <View
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
                    onSubmitEditing={() => {
                      textInputNewConfirmRef.current?.focus?.();
                    }}
                  />
                  <PasswordTextbox
                    textInputRef={textInputNewConfirmRef}
                    setCapsLock={setCapsLock}
                    setValue={setNewPasswordConfirm}
                    value={newPasswordConfirm}
                    placeholder={t("login:confirmMasterPassword")}
                  />
                </View>
                <Button
                  text={t("login:setNewPassword")}
                  onPress={newMasterPassword}
                />
              </>
            ) : (
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
            )}

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
            {isUsingAuthenticationButtonVisible && !showNewData && (
              <Button
                maxWidth={"100%"}
                color="black"
                icon="fingerprint"
                onPress={authenticate}
              />
            )}
          </View>
        </View>
      )}
    </>
  );
}

export default Login;
