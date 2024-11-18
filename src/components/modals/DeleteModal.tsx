import Modal from "./Modal";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onDelete: () => void;
};

function DeleteModal(props: Props) {
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
        }}
      >
        <View style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Text variant="headlineSmall" style={{ userSelect: "none" }}>
            Delete?
          </Text>
          <Text variant="bodyMedium" style={{ userSelect: "none" }}>
            Do you want to delete this entry?
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
            mode="contained-tonal"
            onPress={() => {
              props.setVisible(false);
            }}
          >
            Cancel
          </Button>
          <Button
            buttonColor="#D2222D"
            mode="contained"
            onPress={props.onDelete}
          >
            Delete
          </Button>
        </View>
      </View>
    </Modal>
  );
}

export default DeleteModal;
