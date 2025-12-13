import { ReactNode } from "react";
import { Platform } from "react-native";
import AnimatedOpacityContainerWeb from "./AnimatedOpacityContainer/AnimatedOpacityContainerWeb";
import AnimatedOpacityContainerNative from "./AnimatedOpacityContainer/AnimatedOpacityContainer";

type Props = {
  children: ReactNode;
  visible: boolean;
};
function AnimatedOpacityContainer(props: Props) {
  if (Platform.OS === "web")
    return (
      <AnimatedOpacityContainerWeb visible={props.visible}>
        {props.children}
      </AnimatedOpacityContainerWeb>
    );

  return (
    <AnimatedOpacityContainerNative visible={props.visible}>
      {props.children}
    </AnimatedOpacityContainerNative>
  );
}

export default AnimatedOpacityContainer;
