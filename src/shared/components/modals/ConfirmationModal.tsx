import React from "react";
import { Button } from "react-native-paper";

import { useTheme } from "../../../app/providers/ThemeProvider";
import Modal from "./Modal";
import ModalSurface, { ModalActions } from "./ModalSurface";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
  onDismiss: () => void;
  onConfirm: () => void;
  destructive?: boolean;
  confirmButtonColor?: string;
};

function ConfirmationModal({
  visible,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onDismiss,
  onConfirm,
  destructive = false,
  confirmButtonColor,
}: Props) {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} onDismiss={onDismiss}>
      <ModalSurface
        width={300}
        minHeight={170}
        title={title}
        description={message}
        contentStyle={{ flex: 1 }}
        footer={
          <ModalActions>
            <Button
              style={{ borderRadius: 12 }}
              mode="contained-tonal"
              onPress={onDismiss}
            >
              {cancelLabel}
            </Button>
            <Button
              style={{ borderRadius: 12 }}
              buttonColor={
                confirmButtonColor ??
                (destructive ? theme.colors.error : undefined)
              }
              mode="contained"
              onPress={onConfirm}
            >
              {confirmLabel}
            </Button>
          </ModalActions>
        }
      />
    </Modal>
  );
}

export default ConfirmationModal;
