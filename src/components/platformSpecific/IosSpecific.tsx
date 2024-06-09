import { ReactNode } from "react";
import { Platform } from "react-native";

type Props = { children: ReactNode, notIn?: boolean };

export default function IosSpecific(props: Props) {
  if (props.notIn) {
    if (Platform.OS !== "ios") {
      return <>{props.children}</>;
    }
    else{
      return <></>;
    }
  }
  if (Platform.OS === "ios") {
    return <>{props.children}</>;
  }
}
