import { ReactNode } from "react";
import { Platform } from "react-native";
import ModalContainerWeb from "./container/ModalContainerWeb";
import ModalContainer from "./container/ModalContainer";

type Props = {
  children: ReactNode;
  visible: boolean;
  onDismiss: () => void;
  top?: number;
};
function Modal(props: Props) {
  if (Platform.OS === "web")
    return (
      <ModalContainerWeb visible={props.visible} onDismiss={props.onDismiss} top={props.top}>
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
