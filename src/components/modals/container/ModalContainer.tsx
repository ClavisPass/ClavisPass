import React from "react";
import { View, StyleSheet } from "react-native";
import { Modal, Portal, useTheme } from "react-native-paper";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
};

const ModalContainer = ({ visible, onDismiss, children }: Props) => {
  const theme = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.elevation.level3 },
        ]}
      >
        {children}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 20,
    alignSelf: "center",
    //maxWidth: 500,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    overflow: "hidden",
  },
});

export default ModalContainer;