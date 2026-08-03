import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip, Text } from "react-native-paper";
import { TFunction } from "i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import FastAccessType from "../../../fastaccess/model/FastAccessType";
import { HomeStackParamList } from "../../../../app/navigation/model/types";
import ModulesEnum from "../../model/ModulesEnum";
import ModulesType, { ModuleType } from "../../model/ModulesType";
import ValuesType from "../../model/ValuesType";
import getModuleNameByEnum from "../../utils/getModuleNameByEnum";

export type DraggableModulesListProps = {
  value: ValuesType;
  changeModules: (data: ModulesType) => void;
  deleteModule: (id: string) => void;
  changeModule: (module: ModuleType) => void;
  addModule: (module: ModulesEnum) => void;
  fastAccess: FastAccessType | null;
  navigation: NativeStackNavigationProp<HomeStackParamList, "Edit", undefined>;
};

export const draggableModulesListStyles = StyleSheet.create({
  footer: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 8,
    paddingBottom: 4,
    position: "relative",
  },
  predictionChip: {
    maxWidth: "80%",
    borderRadius: 12,
  },
  predictionChipContent: {
    flexShrink: 1,
    minWidth: 0,
  },
});

export const reorderModules = <T,>(
  list: readonly T[],
  startIndex: number,
  endIndex: number,
) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

type FooterProps = {
  modulePrediction: ModulesEnum | null;
  onAddPredictedModule: () => void;
  t: TFunction;
};

export function DraggableModulesFooter({
  modulePrediction,
  onAddPredictedModule,
  t,
}: FooterProps) {
  return (
    <View style={draggableModulesListStyles.footer}>
      {modulePrediction && (
        <Chip
          icon={"plus"}
          onPress={onAddPredictedModule}
          style={draggableModulesListStyles.predictionChip}
          compact
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={draggableModulesListStyles.predictionChipContent}
          >
            {getModuleNameByEnum(modulePrediction, t)}
          </Text>
        </Chip>
      )}
    </View>
  );
}
