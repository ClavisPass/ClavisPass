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
        <View>
          <Text variant="headlineSmall" style={{ userSelect: "none" }}>
            Discard Changes?
          </Text>
          <Text variant="bodyMedium" style={{ userSelect: "none" }}>
            You have unsaved changes. Are you shure to discard them and leave the
            screen?
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
            mode="contained"
            onPress={() => {
              props.setVisible(false);
            }}
          >
            Don't leave
          </Button>
          <Button mode="contained-tonal" onPress={props.onDiscard}>Discard</Button>
        </View>
      </View>
    </Modal>
  );
}

export default DiscardChangesModal;
