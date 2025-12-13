import Modal from "./Modal";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { useTranslation } from "react-i18next";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onDiscard: () => void;
};

function DiscardChangesModal(props: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const hideModal = () => props.setVisible(false);
  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View
        style={{
          width: 280,
          minHeight: 190,
          display: "flex",
          flexDirection: "column",
          padding: 14,
          justifyContent: "space-between",
          borderRadius: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.outlineVariant,
        }}
      >
        <View style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Text variant="headlineSmall" style={{ userSelect: "none" }}>
            {t("common:discardChangesTitle")}
          </Text>
          <Text variant="bodyMedium" style={{ userSelect: "none" }}>
            {t("common:discardChangesText")}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 6,
            alignSelf: "flex-end",
          }}
        >
          <Button
            style={{ borderRadius: 12 }}
            mode="contained-tonal"
            onPress={() => {
              props.setVisible(false);
            }}
          >
            {t("common:cancel")}
          </Button>
          <Button
            style={{ borderRadius: 12 }}
            mode="contained"
            onPress={props.onDiscard}
          >
            {t("common:discard")}
          </Button>
        </View>
      </View>
    </Modal>
  );
}

export default DiscardChangesModal;
