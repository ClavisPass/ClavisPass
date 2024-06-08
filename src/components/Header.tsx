import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, Text } from "react-native-paper";
import theme from "../ui/theme";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  children?: ReactNode;
  title: string;
  onPress: () => void;
};

function Header(props: Props) {
  return (
    <LinearGradient
      colors={["#fff", "#fff"]}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
      }}
      end={{ x: 0.1, y: 0.2 }}
    >
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
        <Text style={{ color: theme.colors.primary }} variant="bodyMedium">
          {props.title}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
        }}
      >
        {props.children}
      </View>
    </LinearGradient>
  );
}

export default Header;
