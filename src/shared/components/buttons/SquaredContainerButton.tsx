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
    ? "rgba(28, 28, 34, 0.58)"
    : "rgba(255, 255, 255, 0.72)";
  const glassBorderColor = darkmode
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(255, 255, 255, 0.82)";
  const glassShadow = darkmode
    ? ("rgba(0, 0, 0, 0.14) 0px 8px 24px 0px" as any)
    : ("rgba(64, 76, 120, 0.08) 0px 8px 26px 0px" as any);

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
