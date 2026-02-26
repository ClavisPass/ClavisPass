import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../../../../shared/ui/linearGradient";
import QRCode from "react-qr-code";
import Modal from "../../../../shared/components/modals/Modal";
import { Portal } from "react-native-paper";
import { useToken } from "../../../../app/providers/CloudProvider";
import { useEffect, useState } from "react";

import { useTheme } from "../../../../app/providers/ThemeProvider";
import SessionQrPayload from "../../../../infrastructure/cloud/model/SessionQrPayload";

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

  // Ob du automatisch schließen willst, wenn kein Token da ist,
  // ist Geschmackssache. Ich würde das Schließen eher dem Aufrufer überlassen.
  // Wenn du das Verhalten behalten willst:
  useEffect(() => {
    if (!refreshToken && props.visible) {
      hideModal();
    }
  }, [refreshToken, props.visible]);

  return (
    <Portal>
      <Modal visible={props.visible} onDismiss={hideModal}>
        <LinearGradient
          colors={getColors()}
          style={{
            padding: 6,
            borderRadius: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.outlineVariant,
          }}
          end={{ x: 0.1, y: 0.2 }}
          dither={true}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 12,
            }}
          >
            <QRCode
              size={200}
              style={{ height: "auto", width: "auto" }}
              value={value || " "}
              viewBox="0 0 200 200"
            />
          </View>
        </LinearGradient>
      </Modal>
    </Portal>
  );
}

export default TokenQRCodeModal;
