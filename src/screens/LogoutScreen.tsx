import React from "react";
import { StackScreenProps } from "@react-navigation/stack/lib/typescript/src/types";
import { RootStackParamList } from "../app/navigation/stacks/Stack";

type LogoutScreenProps = StackScreenProps<RootStackParamList, "Logout">;

const LogoutScreen: React.FC<LogoutScreenProps> = ({}) => {
  return <></>;
};

export default LogoutScreen;
