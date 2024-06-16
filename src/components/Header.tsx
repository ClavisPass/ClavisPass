import React, { ReactNode } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { IconButton, Text } from "react-native-paper";
import theme from "../ui/theme";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { TitlebarHeight } from "./CustomTitlebar";

type Props = {
  children?: ReactNode;
  title: string;
  onPress: () => void;
};

function Header(props: Props) {
  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        marginBottom: 4,
        borderRadius: Platform.OS === "web" ? 12 : 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
      }}
    >
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: Constants.statusBarHeight + 4,
        }}
      >
        <StatusBar
          animated={true}
          style="dark"
          backgroundColor="transparent"
          translucent={true}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
          }}
        >
          <IconButton
            icon={"chevron-down"}
            iconColor={theme.colors.primary}
            size={20}
            onPress={props.onPress}
          />
          <Text
            style={{
              color: theme.colors.primary,
              userSelect: "none",
              fontWeight: "bold",
              fontSize: 15,
            }}
            variant="bodyMedium"
          >
            {props.title}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            paddingLeft: 16,
          }}
        >
          {props.children}
        </View>
      </View>
    </View>
  );
}

export default Header;
