import React, { useEffect, useRef, useState } from "react";
import { Platform, View, InteractionManager } from "react-native";

import type { StackScreenProps } from "@react-navigation/stack";
import { Icon, Text } from "react-native-paper";
import Header from "../components/Header";
import AddModuleModal from "../components/modals/AddModuleModal";
import { useData } from "../contexts/DataProvider";
import TitleModule from "../components/modules/TitleModule";
import AnimatedContainer from "../components/container/AnimatedContainer";
import DraggableModulesListWeb from "../components/lists/draggableModulesList/DraggableModulesListWeb";
import DraggableModulesList from "../components/lists/draggableModulesList/DraggableModulesList";
import FolderModal from "../components/modals/FolderModal";
import { useTheme } from "../contexts/ThemeProvider";
import DiscardChangesModal from "../components/modals/DiscardChangesModal";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import ContainerButton from "../components/buttons/ContainerButton";
import SquaredContainerButton from "../components/buttons/SquaredContainerButton";
import DeleteModal from "../components/modals/DeleteModal";
import Button from "../components/buttons/Button";
import { RootStackParamList } from "../stacks/Stack";
import MetaInformationModule from "../components/modules/MetaInformationModule";
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
            backgroundColor: theme.colors.background,
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
