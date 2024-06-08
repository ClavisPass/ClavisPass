import { ReactNode } from "react";
import { Platform } from "react-native";

type Props = { children: ReactNode };

export default function AndroidSpecific(props: Props) {
  if (Platform.OS === "android") {
    return <>{props.children}</>;
  }
}
