import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-qr-code";
import { Chip, Portal, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import Modal from "../../../../shared/components/modals/Modal";
import { useToken } from "../../../../app/providers/CloudProvider";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import getColors from "../../../../shared/ui/linearGradient";
import SessionQrPayload from "../../../../infrastructure/cloud/model/SessionQrPayload";
import { getClavisPassHubHostUrl } from "../../../../infrastructure/cloud/clients/ClavisPassHubConfig";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

function TokenQRCodeModal(props: Props) {
  const { theme } = useTheme();
  const { provider, refreshToken } = useToken();
  const { t } = useTranslation();

  const [value, setValue] = useState("");
  const hideModal = () => props.setVisible(false);

  const providerLabel =
    provider === "dropbox"
      ? "Dropbox"
      : provider === "googleDrive"
        ? "Google Drive"
        : provider === "clavispassHub"
          ? "ClavisPass Hub"
          : "Device";

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!refreshToken) {
        if (!cancelled) setValue("");
        return;
      }

      const payload: SessionQrPayload = {
        kind: "clavispass:session",
        version: 1,
        provider,
        refreshToken,
      };

      if (provider === "clavispassHub") {
        payload.hostUrl = (await getClavisPassHubHostUrl()) ?? undefined;
      }

      if (!cancelled) {
        setValue(JSON.stringify(payload));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [provider, refreshToken]);

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
            width: 320,
            maxWidth: "100%",
            padding: 1,
            borderRadius: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.outlineVariant,
          }}
          end={{ x: 0.1, y: 0.2 }}
          dither={true}
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
              <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
                {t("settings:showqrcode")}
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  color: theme.colors.onSurfaceVariant,
                  textAlign: "center",
                }}
              >
                {t("settings:scanqrcode")}
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

            <Chip
              icon={"cloud-outline"}
              showSelectedOverlay={true}
              style={{ borderRadius: 12 }}
            >
              {providerLabel}
            </Chip>
          </View>
        </LinearGradient>
      </Modal>
    </Portal>
  );
}

export default TokenQRCodeModal;
