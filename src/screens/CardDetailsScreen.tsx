import React, { useEffect, useRef, useState } from "react";
import { Platform, View, InteractionManager } from "react-native";

import type { StackScreenProps } from "@react-navigation/stack";
import { Icon, Text } from "react-native-paper";
import Header from "../shared/components/Header";
import AddModuleModal from "../shared/components/modals/AddModuleModal";
import { useData } from "../app/providers/DataProvider";
import TitleModule from "../features/vault/components/modules/TitleModule";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import DraggableModulesListWeb from "../features/vault/components/lists/draggableModulesList/DraggableModulesListWeb";
import DraggableModulesList from "../features/vault/components/lists/draggableModulesList/DraggableModulesList";
import FolderModal from "../shared/components/modals/FolderModal";
import { useTheme } from "../app/providers/ThemeProvider";
import DiscardChangesModal from "../shared/components/modals/DiscardChangesModal";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import ContainerButton from "../shared/components/buttons/ContainerButton";
import SquaredContainerButton from "../shared/components/buttons/SquaredContainerButton";
import DeleteModal from "../shared/components/modals/DeleteModal";
import Button from "../shared/components/buttons/Button";
import { RootStackParamList } from "../app/navigation/stacks/Stack";
import MetaInformationModule from "../features/vault/components/modules/MetaInformationModule";
import QRCode from "react-qr-code";
import Barcode from "@kichiyaki/react-native-barcode-generator";

type CardDetailsScreenProps = StackScreenProps<
  RootStackParamList,
  "CardDetails"
>;

const CardDetailsScreen: React.FC<CardDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { value: value, title: title, type: type } = route.params!;
  const { theme } = useTheme();
  const {
    globalStyles,
    headerWhite,
    setHeaderWhite,
    darkmode,
    setHeaderSpacing,
  } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      let task = InteractionManager.runAfterInteractions(() => {
        setHeaderSpacing(220);
        setHeaderWhite(false);
      });
      return () => task?.cancel?.();
    }, [])
  );

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <AnimatedContainer style={globalStyles.container}>
      <StatusBar
        animated={true}
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent={true}
      />
      <Header onPress={goBack} title={title}></Header>
      <View
        style={{
          flex: 1,
          width: "100%",
          padding: 8,
          paddingTop: 0,
          display: "flex",
          flexDirection: "row",
          gap: 8,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            padding: 16,
            backgroundColor: "white",
            borderRadius: 12,
          }}
        >
          {value !== "" ? (
            type === "QR-Code" ? (
              <QRCode value={value} size={160} />
            ) : (
              <Barcode height={120} format={type} value={value} text={value} />
            )
          ) : null}
        </View>
      </View>
    </AnimatedContainer>
  );
};

export default CardDetailsScreen;
