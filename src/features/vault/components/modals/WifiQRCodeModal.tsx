import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { Chip, Portal, Text } from "react-native-paper";
import QRCode from "react-qr-code";

import { useTheme } from "../../../../app/providers/ThemeProvider";
import Modal from "../../../../shared/components/modals/Modal";
import getColors from "../../../../shared/ui/linearGradient";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  wifitype: string;
  wifiname: string;
  wifipassword: string;
  hidden: boolean;
};

function WifiQRCodeModal(props: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const hideModal = () => props.setVisible(false);
  const networkLabel = props.wifiname?.trim() || t("modules:wifi");
  const typeLabel =
    props.wifitype === "blank"
      ? t("modules:wifiOpen")
      : props.wifitype || "WiFi";

  useEffect(() => {
    const wifiString = [
      "WIFI:",
      `S:${props.wifiname};`,
      `T:${props.wifitype};`,
      props.wifitype === "blank" ? "" : `P:${props.wifipassword};`,
      props.hidden ? "H:true;" : "",
      ";",
    ].join("");
    setValue(wifiString);
  }, [props.hidden, props.wifitype, props.wifiname, props.wifipassword]);
  return (
    <Portal>
      <Modal visible={props.visible} onDismiss={hideModal}>
        <LinearGradient
          colors={getColors()}
          style={{
            width: 320,
            maxWidth: "100%",
            padding: 1,
            borderRadius: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.outlineVariant,
          }}
          end={{ x: 0.1, y: 0.2 }}
          dither
        >
          <View
            style={{
              backgroundColor: theme.colors.background,
              padding: 18,
              borderRadius: 11,
              gap: 14,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                gap: 6,
                alignItems: "center",
              }}
            >
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  textAlign: "center",
                }}
              >
                {networkLabel}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "white",
                padding: 18,
                borderRadius: 12,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: theme.colors.outlineVariant,
                shadowColor: "#000",
                shadowOpacity: 0.12,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 6 },
                elevation: 5,
              }}
            >
              <QRCode
                size={208}
                style={{ height: "auto", width: "auto" }}
                value={value || " "}
                viewBox="0 0 200 200"
              />
            </View>

            <Chip icon="wifi" showSelectedOverlay style={{ borderRadius: 12 }}>
              {typeLabel}
            </Chip>
          </View>
        </LinearGradient>
      </Modal>
    </Portal>
  );
}

export default WifiQRCodeModal;
