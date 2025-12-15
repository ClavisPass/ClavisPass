import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigation/stacks/Stack";

type LogoutScreenProps = NativeStackScreenProps<RootStackParamList, "Logout">;

const LogoutScreen: React.FC<LogoutScreenProps> = ({}) => {
  return <></>;
};

export default LogoutScreen;
