import React, { useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import Header from "../components/Header";
import { TitlebarHeight } from "../components/CustomTitlebar";
import AnimatedContainer from "../components/container/AnimatedContainer";
import { useTheme } from "../contexts/ThemeProvider";
import { Button, Icon, IconButton, Text } from "react-native-paper";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { RootStackParamList } from "../../App";
import { useToken } from "../contexts/TokenProvider";
import fetchUserInfo from "../api/fetchUserInfo";
import isDropboxToken from "../utils/regex/isDropboxToken";
import isGoogleDriveToken from "../utils/regex/isGoogleDriveToken";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

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

const ScanScreen: React.FC<ScanScreenProps> = ({ route, navigation }) => {
  const { globalStyles, headerWhite, setHeaderWhite, darkmode } = useTheme();
  const { setToken } = useToken();

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  useFocusEffect(
    React.useCallback(() => {
      setHeaderWhite(false);
    }, [])
  );

  function isValidTokenFormat(token: string) {
    let tokenType: "Dropbox" | "GoogleDrive" | null = null;
    if (isDropboxToken(token)) tokenType = "Dropbox";
    if (isGoogleDriveToken(token)) tokenType = "GoogleDrive";

    if (tokenType) {
      try {
        fetchUserInfo(token, tokenType, () => {});
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <AnimatedContainer style={globalStyles.container}>
      <TitlebarHeight />
      <StatusBar animated={true} style={headerWhite ? "light" : darkmode ? "light" : "dark"} translucent={true} />
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
            <Button onPress={requestPermission}>Grant Permission</Button>
          </View>
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          facing={facing}
          //mirror={false}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={(scanningResult) => {
            try {
              if (isValidTokenFormat(scanningResult.data)) {
                setToken(scanningResult.data);
                navigation.goBack();
              }
            } catch (error) {
              console.error(error);
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
