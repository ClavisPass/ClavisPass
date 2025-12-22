import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import QRCode from "react-native-qrcode-svg";
import { Portal } from "react-native-paper";

import Modal from "../../../../shared/components/modals/Modal";
import getColors from "../../../../shared/ui/linearGradient";
import { useToken } from "../../../../app/providers/CloudProvider";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import SessionQrPayload from "../../../../infrastructure/cloud/model/SessionQrPayload";

const logo = require("../../../../../assets/icon.png");

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

function TokenQRCodeModal(props: Props) {
  const { theme } = useTheme();
  const { provider, refreshToken } = useToken();

  const [value, setValue] = useState("");

  const hideModal = () => props.setVisible(false);

  useEffect(() => {
    if (refreshToken) {
      const payload: SessionQrPayload = {
        kind: "clavispass:session",
        version: 1,
        provider,
        refreshToken,
      };
      setValue(JSON.stringify(payload));
    } else {
      setValue("");
    }
  }, [provider, refreshToken]);

  useEffect(() => {
    if (!refreshToken && props.visible) hideModal();
  }, [refreshToken, props.visible]);

  const outerGradient = getColors();

  // QR Styling
  const qrSize = 240;
  const bg = "#FFFFFF";

  // Gradient-Farben für das "Schwarz" des QR-Codes.
  // Wichtig: dunkel lassen für Scanbarkeit.
  const inkGradient = getColors();

  const quietZone = 14;

  // Logo "Plakette"
  const logoSize = 54;
  const plateSize = logoSize + 18;
  const plateRadius = 16;

  return (
    <Portal>
      <Modal visible={props.visible} onDismiss={hideModal}>
        <LinearGradient
          colors={outerGradient}
          style={{
            padding: 2,
            borderRadius: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.outlineVariant,
          }}
          end={{ x: 0.1, y: 0.2 }}
          dither
        >
          <View
            style={{
              backgroundColor: bg,
              padding: 4,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ width: qrSize, height: qrSize }}>
              <MaskedView
                style={{ width: qrSize, height: qrSize }}
                maskElement={
                  <View style={{ backgroundColor: "transparent" }}>
                    <QRCode
                      value={value || " "}
                      size={qrSize}
                      color="#000000"
                      backgroundColor={bg}
                      ecl="H"
                      quietZone={quietZone}
                    />
                  </View>
                }
              >
                <LinearGradient
                  colors={inkGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ width: qrSize, height: qrSize }}
                />
              </MaskedView>
              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  left: (qrSize - plateSize) / 2,
                  top: (qrSize - plateSize) / 2,
                  width: plateSize,
                  height: plateSize,
                  borderRadius: plateRadius,
                  backgroundColor: bg,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: theme.colors.outlineVariant,
                }}
              >
                <Image
                  source={logo}
                  style={{
                    width: logoSize,
                    height: logoSize,
                    borderRadius: 12,
                  }}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      </Modal>
    </Portal>
  );
}

export default TokenQRCodeModal;
