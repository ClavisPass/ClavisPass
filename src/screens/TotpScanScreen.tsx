// screens/TotpScanScreen.tsx
import React, { useCallback, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect } from "@react-navigation/native";
import { Button, Icon, IconButton, Text, TextInput } from "react-native-paper";

import Header from "../shared/components/Header";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import { useTheme } from "../app/providers/ThemeProvider";
import { RootStackParamList } from "../app/navigation/stacks/Stack";

const styles = StyleSheet.create({
  scrollView: { minWidth: 0 },
  scrollViewStyle: { overflow: "visible" },
  container: { flex: 1, justifyContent: "center" },
  message: { textAlign: "center", paddingBottom: 10 },
  camera: { flex: 1, width: Dimensions.get("window").width },
  overlay: {
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
  bottomBar: { position: "absolute", bottom: 12, flexDirection: "row", gap: 8 },
  manualBox: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 70,
    gap: 8,
  },
});

type TotpScanScreenProps = StackScreenProps<RootStackParamList, "TotpScan">;

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

const TotpScanScreen: React.FC<TotpScanScreenProps> = ({ route, navigation }) => {
  const { setOtpauth } = route.params;
  const { globalStyles, headerWhite, setHeaderWhite, darkmode, setHeaderSpacing } = useTheme();

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState<boolean>(false);

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
          <Text style={styles.message}>We need your permission to show the camera.</Text>
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
          //torch={torch ? "on" : "off"}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleScanned}
        >
          <View style={styles.overlay}>
            <Icon source={"scan-helper"} size={200} />
          </View>

          <View style={[styles.bottomBar, { alignSelf: "center" }]}>
            <IconButton
              selected
              mode="contained-tonal"
              icon={torch ? "flashlight-off" : "flashlight"}
              size={28}
              onPress={() => setTorch((t) => !t)}
            />
            <IconButton
              selected
              mode="contained-tonal"
              icon={"camera-flip"}
              size={28}
              onPress={toggleCameraFacing}
            />
          </View>
        </CameraView>
      )}
    </AnimatedContainer>
  );
};

export default TotpScanScreen;
