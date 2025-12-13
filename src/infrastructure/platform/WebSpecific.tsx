import { ReactNode } from "react";
import { Platform } from "react-native";

type Props = { children: ReactNode; notIn?: boolean };

export default function WebSpecific(props: Props) {
  if (props.notIn) {
    if (Platform.OS !== "web") {
      return <>{props.children}</>;
    }
    else{
      return <></>;
    }
  }
  if (Platform.OS === "web") {
    return <>{props.children}</>;
  }
}
