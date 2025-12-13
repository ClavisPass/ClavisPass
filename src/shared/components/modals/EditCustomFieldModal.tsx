import { View, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import Modal from "./Modal";
import { useEffect, useRef } from "react";
import { useTheme } from "../../../app/providers/ThemeProvider";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
};

function EditCustomFieldModal(props: Props) {
  const { globalStyles, theme } = useTheme();
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (props.visible) {
      inputRef?.current?.focus();
    }
  }, [props.visible]);
  return (
    <Modal
      top={-6}
      visible={props.visible}
      onDismiss={() => {
        props.setVisible(false);
      }}
    >
      <View
        style={{
          backgroundColor: "transparent",
          padding: 10,
          display: "flex",
          maxHeight: 60,
          borderRadius: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.outlineVariant,
        }}
      >
        <TextInput
          ref={inputRef}
          outlineStyle={[globalStyles.outlineStyle]}
          style={globalStyles.textInputStyle}
          value={props.title}
          mode="outlined"
          onChangeText={(text) => props.setTitle(text)}
          autoCapitalize="none"
          onBlur={() => {
            props.setVisible(false);
          }}
        />
      </View>
    </Modal>
  );
}

export default EditCustomFieldModal;
