import { ReactNode } from "react";
import { Platform } from "react-native";

type Props = { children: ReactNode, notIn?: boolean };

export default function AndroidSpecific(props: Props) {
  if (props.notIn) {
    if (Platform.OS !== "android") {
      return <>{props.children}</>;
    }
    else{
      return <></>;
    }
  }
  if (Platform.OS === "android") {
    return <>{props.children}</>;
  }
}
