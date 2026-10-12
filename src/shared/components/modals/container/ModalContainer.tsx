import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { useTheme } from "../../../../app/providers/ThemeProvider";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  avoidKeyboard?: boolean;
};

const ModalContainer = ({
  visible,
  onDismiss,
  children,
  avoidKeyboard = true,
}: Props) => {
  const { theme } = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          {
            margin: 20,
            flex: 1,
            borderRadius: 12,
            alignSelf: "center",
            boxShadow: theme.colors?.shadow,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          },
        ]}
      >
        <KeyboardAvoidingView
          enabled={avoidKeyboard}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={24}
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={avoidKeyboard ? "always" : "handled"}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%" }}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
};

export default ModalContainer;
