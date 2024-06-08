import { ReactNode } from "react";
import { Platform } from "react-native";

type Props = { children: ReactNode };

export default function WebSpecific(props: Props) {
  if (Platform.OS === "web") {
    return <>{props.children}</>;
  }
}
