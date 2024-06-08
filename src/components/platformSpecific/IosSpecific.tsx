import { ReactNode } from "react";
import { Platform } from "react-native";

type Props = { children: ReactNode };

export default function IosSpecific(props: Props) {
  if (Platform.OS === "ios") {
    return <>{props.children}</>;
  }
}
