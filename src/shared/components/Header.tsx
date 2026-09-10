import React, { ReactNode } from "react";
import { Platform, View, StyleSheet, useWindowDimensions } from "react-native";
import { IconButton, Text } from "react-native-paper";
import Constants from "expo-constants";
import FocusAwareStatusBar from "./FocusAwareStatusBar";
import { useTheme } from "../../app/providers/ThemeProvider";
import { TITLEBAR_CONTROLS_WIDTH, TITLEBAR_HEIGHT } from "./titlebarMetrics";
import { useSetting } from "../../app/providers/SettingsProvider";
import { isTauriEnvironment } from "../../infrastructure/platform/isTauri";
import { resolveWindowControlsSide } from "../../infrastructure/platform/windowControls";
import { isDemoDistribution } from "../utils/distribution";

const webDragRegionProps =
  Platform.OS === "web"
    ? ({ dataSet: { tauriDragRegion: "" } } as any)
    : null;

type Props = {
  children?: ReactNode;
  title?: string;
  onPress?: () => void;
  leftNode?: ReactNode;
  leftContentDraggable?: boolean;
  marginBottom?: number;
};

function Header(props: Props) {
  const {
    theme,
    darkmode,
  } = useTheme();
  const { width } = useWindowDimensions();
  const { value: windowControlsStyle } = useSetting("WINDOW_CONTROLS_STYLE");
  const controlsLeft =
    resolveWindowControlsSide(windowControlsStyle) === "left";
  const reserveMacControlsSpace =
    !isDemoDistribution() &&
    isTauriEnvironment() &&
    TITLEBAR_HEIGHT > 0 &&
    width < 600 &&
    controlsLeft;
  const contentDraggable =
    props.leftContentDraggable ?? props.leftNode === undefined;

  return (
    <View
      style={{
        height: 40 + Constants.statusBarHeight,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.colors?.background,
        marginBottom: props.marginBottom ?? 8,
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
          paddingLeft: reserveMacControlsSpace ? TITLEBAR_CONTROLS_WIDTH : 0,
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
              {...(Platform.OS === "web"
                ? ({ className: "clavispass-cursor-pointer" } as any)
                : null)}
              icon={"chevron-left"}
              iconColor={theme.colors?.primary}
              size={20}
              onPress={props.onPress}
              style={[
                { margin: 0 },
                Platform.OS === "web" ? ({ cursor: "pointer" } as any) : null,
              ]}
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
          {contentDraggable ? (
            <View
              {...webDragRegionProps}
              style={{
                flex: 1,
                alignSelf: "stretch",
                minWidth: 24,
                cursor: Platform.OS === "web" ? "default" : undefined,
              } as any}
            />
          ) : null}
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
