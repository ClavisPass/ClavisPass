import { View } from "react-native";
import { Portal, TextInput, Text } from "react-native-paper";
import getColors from "../../ui/linearGradient";
import { LinearGradient } from "expo-linear-gradient";
import globalStyles from "../../ui/globalStyles";
import Modal from "react-native-modal";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
};

function EditCustomFieldModal(props: Props) {
  return (
    <Portal>
      <Modal
        isVisible={props.visible}
        onBackdropPress={() => {
          props.setVisible(false);
        }}
        style={{
          backgroundColor: "transparent",
          borderRadius: 20,
          display: "flex",
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <View>
          <LinearGradient
            colors={getColors()}
            style={{ padding: 3, width: 300, borderRadius: 20 }}
            end={{ x: 0.1, y: 0.2 }}
            dither={true}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 16,
                borderRadius: 20,
                display: "flex",
                height: 100,
              }}
            >
              <Text variant="labelLarge">Change Title:</Text>
              <TextInput
                outlineStyle={globalStyles.outlineStyle}
                style={globalStyles.textInputStyle}
                value={props.title}
                mode="outlined"
                onChangeText={(text) => props.setTitle(text)}
                autoCapitalize="none"
              />
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </Portal>
  );
}

export default EditCustomFieldModal;
