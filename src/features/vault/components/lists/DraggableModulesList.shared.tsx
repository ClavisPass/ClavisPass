import React from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { MD3Theme } from "react-native-paper";
import { Chip, IconButton, Text } from "react-native-paper";
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
  showAddModuleModal: () => void;
  fastAccess: FastAccessType | null;
  navigation: NativeStackNavigationProp<HomeStackParamList, "Edit", undefined>;
};

export const draggableModulesListStyles = StyleSheet.create({
  footer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    paddingBottom: 8,
    position: "relative",
  },
  predictionChip: {
    position: "absolute",
    left: 8,
    maxWidth: "60%",
  },
  predictionChipContent: {
    flexShrink: 1,
    minWidth: 0,
  },
});

export const reorderModules = <T,>(
  list: readonly T[],
  startIndex: number,
  endIndex: number
) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const getFooterButtonShift = (
  footerWidth: number,
  predictionChipWidth: number
) => {
  const addButtonBaseWidth = 40;
  const leftPadding = 8;
  const safetyGap = 4;
  const centeredButtonLeft = Math.max(0, (footerWidth - addButtonBaseWidth) / 2);
  const predictionChipRight = leftPadding + predictionChipWidth;

  return footerWidth > 0
    ? Math.max(0, predictionChipRight + safetyGap - centeredButtonLeft)
    : 0;
};

type FooterProps = {
  modulePrediction: ModulesEnum | null;
  onAddPredictedModule: () => void;
  onOpenAddModuleModal: () => void;
  onFooterLayout: (event: LayoutChangeEvent) => void;
  onPredictionChipLayout: (event: LayoutChangeEvent) => void;
  requiredShift: number;
  theme: MD3Theme;
  t: TFunction;
};

export function DraggableModulesFooter({
  modulePrediction,
  onAddPredictedModule,
  onOpenAddModuleModal,
  onFooterLayout,
  onPredictionChipLayout,
  requiredShift,
  theme,
  t,
}: FooterProps) {
  return (
    <View
      style={draggableModulesListStyles.footer}
      onLayout={onFooterLayout}
    >
      {modulePrediction && (
        <Chip
          icon={"plus"}
          onPress={onAddPredictedModule}
          style={draggableModulesListStyles.predictionChip}
          onLayout={onPredictionChipLayout}
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
      <IconButton
        icon={"plus"}
        iconColor={theme.colors.primary}
        style={{ margin: 0, transform: [{ translateX: requiredShift }] }}
        onPress={onOpenAddModuleModal}
        size={20}
        selected={true}
        mode="contained-tonal"
      />
    </View>
  );
}
