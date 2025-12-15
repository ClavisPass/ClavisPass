import React from "react";
import { View, InteractionManager } from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "../shared/components/Header";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import { useTheme } from "../app/providers/ThemeProvider";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { RootStackParamList } from "../app/navigation/stacks/Stack";
import QRCode from "react-qr-code";
import Barcode from "@kichiyaki/react-native-barcode-generator";

type CardDetailsScreenProps = NativeStackScreenProps<
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
