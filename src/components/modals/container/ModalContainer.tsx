import React from "react";
import { Modal, Portal } from "react-native-paper";
import { useTheme } from "../../../contexts/ThemeProvider";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
};

const ModalContainer = ({ visible, onDismiss, children }: Props) => {
  const { theme } = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          {
            margin: 20,
            borderRadius: 12,
            alignSelf: "center",
            boxShadow: theme.colors?.shadow,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.elevation.level3,
          },
        ]}
      >
        {children}
      </Modal>
    </Portal>
  );
};

export default ModalContainer;
