import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/navigation/stacks/Stack";

type AddTriggerScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "AddTrigger"
>;

const AddTriggerScreen: React.FC<AddTriggerScreenProps> = ({}) => {
  return <></>;
};

export default AddTriggerScreen;
