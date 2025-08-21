import React, { useCallback, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import Header from "../components/Header";
import AnimatedContainer from "../components/container/AnimatedContainer";
import { useTheme } from "../contexts/ThemeProvider";
import { Button, Icon, IconButton, Text } from "react-native-paper";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { RootStackParamList } from "../stacks/Stack";
import DigitalCardType from "../types/DigitalCardType";

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

export const BARCODE_TYPE_MAP: Record<string, DigitalCardType | undefined> = {
  qr: "QR-Code",
  code39: "CODE39",
  code128: "CODE128",
  ean13: "EAN13",
  ean8: "EAN8",
  itf14: "ITF14",
  codabar: "codabar",
  upc_a: "UPC",
  upc_e: "UPCE",
};

type DigitalCardScanScreenProps = StackScreenProps<
  RootStackParamList,
  "DigitalCardScan"
>;

const DigitalCardScanScreen: React.FC<DigitalCardScanScreenProps> = ({
  route,
  navigation,
}) => {
  const {
    globalStyles,
    headerWhite,
    setHeaderWhite,
    darkmode,
    setHeaderSpacing,
  } = useTheme();

  const { setData } = route.params;

  const lockedRef = useRef(false);

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(40);
      setHeaderWhite(false);
    }, [])
  );

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function mapBarcodeType(expoType: string): DigitalCardType | undefined {
    return BARCODE_TYPE_MAP[expoType] ?? undefined;
  }

  const handleScanned = useCallback(
    (res: { data: string; type: string }) => {
      if (lockedRef.current) return;
      lockedRef.current = true;

      const value = (res?.data ?? "").trim();

      if (!value) {
        lockedRef.current = false;
        return;
      }

      try {
        const mappedType = mapBarcodeType(res.type);
        if (!mappedType) {
          console.log("Nicht unterstützter Barcode-Typ:", res.type);
          return;
        }
        setData(value, mappedType);
      } catch (e) {
        console.error(e);
      } finally {
        navigation.goBack();
      }
    },
    [navigation, setData]
  );

  return (
    <AnimatedContainer style={globalStyles.container}>
      <StatusBar
        animated={true}
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent={true}
      />
      <Header
        onPress={() => {
          navigation.goBack();
        }}
      ></Header>
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
          //mirror={false}
          barcodeScannerSettings={{
            barcodeTypes: [
              "aztec",
              "ean13",
              "ean8",
              "qr",
              "pdf417",
              "upc_e",
              "datamatrix",
              "code39",
              "code93",
              "itf14",
              "codabar",
              "code128",
              "upc_a",
            ],
          }}
          onBarcodeScanned={handleScanned}
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

export default DigitalCardScanScreen;
