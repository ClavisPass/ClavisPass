import Modal from "./Modal";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { useTheme } from "../../contexts/ThemeProvider";
import { useTranslation } from "react-i18next";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onDelete: () => void;
};

function DeleteModal(props: Props) {
  const { theme } = useTheme();
  const {t} = useTranslation();
  const hideModal = () => props.setVisible(false);
  return (
    <Modal visible={props.visible} onDismiss={hideModal}>
      <View
        style={{
          width: 280,
          minHeight: 170,
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
            {`${t("common:delete")}?`}
          </Text>
          <Text variant="bodyMedium" style={{ userSelect: "none" }}>
            {t("common:deleteEntryText")}
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
            buttonColor="#D2222D"
            mode="contained"
            onPress={props.onDelete}
          >
            {t("common:delete")}
          </Button>
        </View>
      </View>
    </Modal>
  );
}

export default DeleteModal;
