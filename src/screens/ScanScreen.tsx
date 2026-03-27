import React, { useCallback, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "../shared/components/Header";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import { useTheme } from "../app/providers/ThemeProvider";
import { Button, Icon, IconButton, Text } from "react-native-paper";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { logger } from "../infrastructure/logging/logger";
import { useToken } from "../app/providers/CloudProvider";
import { refreshAccessToken as refreshCloudAccessToken } from "../infrastructure/cloud/clients/CloudStorageClient";
import { setClavisPassHubHostUrl } from "../infrastructure/cloud/clients/ClavisPassHubConfig";
import isSessionQrPayload from "../shared/utils/isSessionQrPayload";
import SessionQrPayload from "../infrastructure/cloud/model/SessionQrPayload";
import { RootStackParamList } from "../app/navigation/model/types";
import { useTranslation } from "react-i18next";

const styles = StyleSheet.create({
  scrollView: {
    minWidth: 0,
  },
  scrollViewStyle: {
    overflow: "visible",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    width: Dimensions.get("window").width,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 72,
  },
  scanFrameOuter: {
    width: 248,
    height: 248,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    overflow: "hidden",
  },
  scanFrameInner: {
    width: 196,
    height: 196,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  hintCard: {
    position: "absolute",
    bottom: 92,
    alignSelf: "center",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 18,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,
  },
});

type ScanScreenProps = NativeStackScreenProps<RootStackParamList, "Scan">;

const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
  const {
    globalStyles,
    headerWhite,
    setHeaderWhite,
    darkmode,
    setHeaderSpacing,
  } = useTheme();

  const { setSession } = useToken();
  const { t } = useTranslation();

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [trying, setTrying] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(40);
      setHeaderWhite(false);
    }, [setHeaderSpacing, setHeaderWhite])
  );

  const handleScannedValue = useCallback(
    async (rawValue: string) => {
      if (trying) return;
      setTrying(true);

      try {
        let parsed: unknown;
        try {
          parsed = JSON.parse(rawValue);
        } catch (e) {
          logger.warn("Scanned QR is not valid JSON.");
          return;
        }

        if (!isSessionQrPayload(parsed)) {
          logger.warn("Scanned QR is not a valid ClavisPass session payload.");
          return;
        }

        const payload = parsed as SessionQrPayload;

        // Optional: nur bestimmte Provider zulassen
        if (payload.provider === "device") {
          logger.warn(
            "Session payload with provider 'device' is not supported for QR transfer."
          );
          return;
        }

        if (payload.provider === "clavispassHub") {
          if (!payload.hostUrl) {
            logger.warn(
              "Session payload with provider 'clavispassHub' is missing the host URL."
            );
            return;
          }

          await setClavisPassHubHostUrl(payload.hostUrl);
        }

        // Einmal Refresh auf dem Zielgerät, um ein frisches Access-Token zu holen
        const result = await refreshCloudAccessToken({
          provider: payload.provider,
          refreshToken: payload.refreshToken,
        });

        if (!result || !result.accessToken) {
          logger.warn(
            "Cloud provider did not return a valid access token for scanned session."
          );
          return;
        }

        await setSession({
          provider: payload.provider,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken ?? payload.refreshToken,
          expiresIn: result.expiresIn,
        });

        navigation.goBack();
      } catch (error) {
        logger.error("Error handling scanned session QR:", error);
      } finally {
        setTrying(false);
      }
    },
    [trying, setSession, navigation]
  );

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <AnimatedContainer style={globalStyles.container}>
      <StatusBar
        animated={true}
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent={true}
      />
      <Header onPress={() => navigation.goBack()} />
      {!permission ? (
        <Text style={styles.message}>No Permission.</Text>
      ) : !permission.granted ? (
        <View style={styles.container}>
          <Text style={styles.message}>
            We need your permission to show the camera.
          </Text>
          <View>
            <Button
              mode="contained"
              contentStyle={{ paddingHorizontal: 10 }}
              style={{ borderRadius: 12 }}
              onPress={requestPermission}
            >
              Grant Permission
            </Button>
          </View>
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={(scanningResult) => {
            try {
              if (trying) return;
              const value = scanningResult?.data;
              if (!value) return;

              void handleScannedValue(value);
            } catch (error) {
              logger.error("Error scanning barcode:", error);
            }
          }}
        >
          <View style={styles.overlay}>
            <View
              style={[
                styles.scanFrameOuter,
                {
                  backgroundColor: "rgba(10, 14, 24, 0.16)",
                  borderColor: "rgba(255,255,255,0.18)",
                },
              ]}
            >
              <View
                style={[
                  styles.scanFrameInner,
                  {
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.92)",
                  },
                ]}
              >
                <Icon source={"scan-helper"} size={108} color={"white"} />
              </View>
            </View>
          </View>

          <View
            style={[
              styles.hintCard,
              {
                backgroundColor: "rgba(10, 14, 24, 0.58)",
                borderColor: "rgba(255,255,255,0.14)",
              },
            ]}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              {t("settings:scanqrcode")}
            </Text>
          </View>

          <View
            style={[
              styles.bottomBar,
              {
                backgroundColor: "rgba(10, 14, 24, 0.62)",
                borderColor: "rgba(255,255,255,0.14)",
              },
            ]}
          >
            <IconButton
              selected={true}
              mode="contained-tonal"
              containerColor="rgba(255,255,255,0.12)"
              iconColor="white"
              icon={"camera-flip"}
              size={24}
              onPress={toggleCameraFacing}
            />
          </View>
        </CameraView>
      )}
    </AnimatedContainer>
  );
};

export default ScanScreen;
