import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../../app/providers/ThemeProvider";
import AnimatedPressable from "../AnimatedPressable";
import { getItemSurfaceStyle } from "../../ui/glass";

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
  const { theme } = useTheme();
  const itemSurfaceStyle = getItemSurfaceStyle(theme);

  return (
    <View
      style={[
        styles.container,
        itemSurfaceStyle,
        {
          backgroundColor: props.disabled
            ? theme.colors.surfaceDisabled
            : (props.backgroundColor ?? itemSurfaceStyle.backgroundColor),
          borderWidth: StyleSheet.hairlineWidth,
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
