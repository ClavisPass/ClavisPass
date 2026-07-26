import React, { ReactNode, useEffect } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { IconButton, Text } from "react-native-paper";
import Constants from "expo-constants";
import FocusAwareStatusBar from "./FocusAwareStatusBar";
import { useTheme } from "../../app/providers/ThemeProvider";
import {
  TITLEBAR_CONTROLS_WIDTH,
  TITLEBAR_HEIGHT,
} from "./titlebarMetrics";

type Props = {
  children?: ReactNode;
  title?: string;
  onPress?: () => void;
  leftNode?: ReactNode;
};

function Header(props: Props) {
  const {
    theme,
    darkmode,
    setTitlebarCenterGap,
    setTitlebarOverlayDragEnabled,
  } = useTheme();
  const { width } = useWindowDimensions();
  const reserveMacControlsSpace =
    TITLEBAR_HEIGHT > 0 && width < 600;

  useEffect(() => {
    setTitlebarCenterGap(0);
    setTitlebarOverlayDragEnabled(true);
  }, [setTitlebarCenterGap, setTitlebarOverlayDragEnabled]);

  return (
    <View
      style={{
        height: 40 + Constants.statusBarHeight,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.colors?.background,
        marginBottom: 8,
        borderRadius: 12,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        boxShadow: theme.colors?.shadow,
        justifyContent: "center",
        borderWidth: StyleSheet.hairlineWidth,
        borderTopWidth: 0,
        borderColor: darkmode ? theme.colors.outlineVariant : "white",
      }}
    >
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: Constants.statusBarHeight,
          paddingLeft: reserveMacControlsSpace
            ? TITLEBAR_CONTROLS_WIDTH
            : 0,
        }}
      >
        <FocusAwareStatusBar
          animated={true}
          style={darkmode ? "light" : "dark"}
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
          {props.onPress ? (
            <IconButton
              icon={"chevron-left"}
              iconColor={theme.colors?.primary}
              size={20}
              onPress={props.onPress}
              style={{ margin: 0 }}
            />
          ) : null}
          {props.title ? (
            <Text
              style={{
                color: theme.colors?.primary,
                userSelect: "none",
                fontSize: 15,
                marginLeft: props.leftNode ? 0 : 16,
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
