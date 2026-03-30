import { ReactNode } from "react";
import { Platform } from "react-native";
import MenuContainerWeb from "./container/MenuContainerWeb";
import MenuContainer from "./container/MenuContainer";

type Props = {
  children: ReactNode;
  visible: boolean;
  onDismiss: () => void;
  positionY: number;
  positionX?: number;
  offsetY?: number;
};
function Menu(props: Props) {
  if (Platform.OS === "web")
    return (
      <MenuContainerWeb
        visible={props.visible}
        onDismiss={props.onDismiss}
        positionY={props.positionY}
        positionX={props.positionX}
        offsetY={props.offsetY}
      >
        {props.children}
      </MenuContainerWeb>
    );

  return (
    <MenuContainer
      visible={props.visible}
      onDismiss={props.onDismiss}
      positionY={props.positionY}
      positionX={props.positionX}
      offsetY={props.offsetY}
    >
      {props.children}
    </MenuContainer>
  );
}

export default Menu;
