import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../../app/providers/ThemeProvider";
import AnimatedPressable from "../AnimatedPressable";

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    padding: 0,
    borderRadius: 12,
    margin: 0,
    overflow: "hidden",
  },
  ripple: {
    flex: 1,
    padding: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

type Props = {
  children?: React.ReactNode;
  onPress: () => void;
  backgroundColor?: string;
  disabled?: boolean;
};

function SquaredContainerButton(props: Props) {
  const { theme, darkmode } = useTheme();
  const glassBackgroundColor = darkmode
    ? "rgba(255, 255, 255, 0.075)"
    : "rgba(120, 127, 246, 0.075)";
  const glassBorderColor = darkmode
    ? "rgba(255, 255, 255, 0.11)"
    : "rgba(120, 127, 246, 0.16)";
  const glassShadow = darkmode
    ? ("rgba(0, 0, 0, 0.18) 0px 8px 22px 0px" as any)
    : ("rgba(64, 76, 120, 0.10) 0px 8px 22px 0px" as any);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: props.disabled
            ? theme.colors.surfaceDisabled
            : (props.backgroundColor ?? glassBackgroundColor),
          boxShadow: glassShadow,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: glassBorderColor,
        },
      ]}
    >
      <AnimatedPressable
        disabled={props.disabled}
        style={styles.ripple}
        onPress={props.onPress}
      >
        {props.children}
      </AnimatedPressable>
    </View>
  );
}

export default SquaredContainerButton;
