import Modal from "./Modal";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onDiscard: () => void;
};

function DiscardChangesModal(props: Props) {
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
        }}
      >
        <View style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Text variant="headlineSmall" style={{ userSelect: "none" }}>
            Discard Changes?
          </Text>
          <Text variant="bodyMedium" style={{ userSelect: "none" }}>
            You have unsaved changes. Are you shure to discard them and leave
            the screen?
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
          style={{ borderRadius: 10 }}
            mode="contained-tonal"
            onPress={() => {
              props.setVisible(false);
            }}
          >
            Cancel
          </Button>
          <Button style={{ borderRadius: 10 }} mode="contained" onPress={props.onDiscard}>
            Discard
          </Button>
        </View>
      </View>
    </Modal>
  );
}

export default DiscardChangesModal;
