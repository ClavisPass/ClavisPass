import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AddTriggerStackParamList } from "../app/navigation/model/types";


type AddTriggerScreenProps = NativeStackScreenProps<
  AddTriggerStackParamList,
  "AddTrigger"
>;

const AddTriggerScreen: React.FC<AddTriggerScreenProps> = ({}) => {
  return <></>;
};

export default AddTriggerScreen;
