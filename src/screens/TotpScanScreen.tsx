import React, { useCallback, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { StatusBar } from "expo-status-bar";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect } from "@react-navigation/native";
import { Button, Icon, IconButton, Text } from "react-native-paper";

import Header from "../shared/components/Header";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import { useTheme } from "../app/providers/ThemeProvider";
import { HomeStackParamList } from "../app/navigation/model/types";

const styles = StyleSheet.create({
  scrollView: { minWidth: 0 },
  scrollViewStyle: { overflow: "visible" },
  container: { flex: 1, justifyContent: "center" },
  message: { textAlign: "center", paddingBottom: 10 },
  camera: { flex: 1, width: Dimensions.get("window").width },
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

type TotpScanScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "TotpScan"
>;

function isValidOtpauth(uri?: string) {
  if (!uri || !uri.startsWith("otpauth://")) return false;
  try {
    const u = new URL(uri);
    if (u.protocol !== "otpauth:") return false;
    if (u.host !== "totp") return false; // nur TOTP unterstützen
    const secret = u.searchParams.get("secret");
    return Boolean(secret && secret.length >= 8);
  } catch {
    return false;
  }
}

const TotpScanScreen: React.FC<TotpScanScreenProps> = ({
  route,
  navigation,
}) => {
  const { setOtpauth } = route.params;
  const {
    globalStyles,
    headerWhite,
    setHeaderWhite,
    darkmode,
    setHeaderSpacing,
  } = useTheme();

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  const lockedRef = useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(40);
      setHeaderWhite(false);
    }, [])
  );

  const acceptAndExit = useCallback(
    (uri: string) => {
      setOtpauth(uri);
      navigation.goBack();
    },
    [navigation, setOtpauth]
  );

  const handleScanned = useCallback(
    (res: { data: string; type: string }) => {
      if (lockedRef.current) return;
      const raw = (res?.data ?? "").trim();

      if (res?.type !== "qr") return;

      if (!raw) return;
      if (!isValidOtpauth(raw)) return;

      lockedRef.current = true;
      acceptAndExit(raw);
    },
    [acceptAndExit]
  );

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <AnimatedContainer style={globalStyles.container}>
      <StatusBar
        animated
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent
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
          //torch={torch ? "on" : "off"}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleScanned}
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
              Scan QR Code
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
              selected
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

export default TotpScanScreen;
