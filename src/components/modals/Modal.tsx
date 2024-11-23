import { ReactNode } from "react";
import { Platform, Pressable, View } from "react-native";
import { Animated } from "react-native";
import { useTheme } from "../../contexts/ThemeProvider";
import ModalContainerWeb from "./container/ModalContainerWeb";
import ModalContainer from "./container/ModalContainer";

type Props = {
  children: ReactNode;
  visible: boolean;
  onDismiss: () => void;
};
function Modal(props: Props) {
  if (Platform.OS === "web")
    return (
      <ModalContainerWeb visible={props.visible} onDismiss={props.onDismiss}>
        {props.children}
      </ModalContainerWeb>
    );

  return (
    <ModalContainer visible={props.visible} onDismiss={props.onDismiss}>
      {props.children}
    </ModalContainer>
  );
}

export default Modal;
