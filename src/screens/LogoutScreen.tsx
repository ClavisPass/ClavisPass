import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LogoutStackParamList } from "../app/navigation/model/types";

type LogoutScreenProps = NativeStackScreenProps<LogoutStackParamList, "Logout">;

const LogoutScreen: React.FC<LogoutScreenProps> = ({}) => {
  return <></>;
};

export default LogoutScreen;
