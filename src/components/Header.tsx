import React, { ReactNode } from "react";
import { View, Platform } from "react-native";
import { IconButton, Text } from "react-native-paper";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../contexts/ThemeProvider";

type Props = {
  children?: ReactNode;
  title?: string;
  onPress: () => void;
  leftNode?: ReactNode;
};

function Header(props: Props) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.colors?.background,
        marginBottom: 8,
        borderRadius: Platform.OS === "web" ? 12 : 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
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
            alignItems: "center",
            flex: 1,

            width: "100%",
          }}
        >
          <IconButton
            icon={"chevron-down"}
            iconColor={theme.colors?.primary}
            size={20}
            onPress={props.onPress}
          />
          {props.title ? (
            <Text
              style={{
                color: theme.colors?.primary,
                userSelect: "none",
                fontWeight: "bold",
                fontSize: 15,
              }}
              variant="titleSmall"
            >
              {props.title}
            </Text>
          ) : null}
          {props.leftNode}
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
