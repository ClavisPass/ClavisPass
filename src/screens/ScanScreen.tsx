import React, { useCallback, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import Header from "../shared/components/Header";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import { useTheme } from "../app/providers/ThemeProvider";
import { Button, Icon, IconButton, Text } from "react-native-paper";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { RootStackParamList } from "../app/navigation/stacks/Stack";
import { logger } from "../infrastructure/logging/logger";
import { useToken } from "../app/providers/CloudProvider";
import { refreshAccessToken as refreshCloudAccessToken } from "../infrastructure/cloud/clients/CloudStorageClient";
import isSessionQrPayload from "../shared/utils/isSessionQrPayload";
import SessionQrPayload from "../infrastructure/cloud/model/SessionQrPayload";

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
  buttonContainer: {
    position: "absolute",
    flex: 1,
    width: Dimensions.get("window").width,
    height: "100%",
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 6,
  },
  button: {
    bottom: 0,
  },
});

type ScanScreenProps = StackScreenProps<RootStackParamList, "Scan">;

const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
  const {
    globalStyles,
    headerWhite,
    setHeaderWhite,
    darkmode,
    setHeaderSpacing,
  } = useTheme();

  const { setSession } = useToken();

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
          refreshToken: payload.refreshToken,
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
            <Button style={{ borderRadius: 12 }} onPress={requestPermission}>
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
          <View style={styles.buttonContainer}>
            <Icon source={"scan-helper"} size={200} />
            <View style={styles.button}>
              <IconButton
                selected={true}
                mode="contained-tonal"
                icon={"camera-flip"}
                size={30}
                onPress={toggleCameraFacing}
              />
            </View>
          </View>
        </CameraView>
      )}
    </AnimatedContainer>
  );
};

export default ScanScreen;
