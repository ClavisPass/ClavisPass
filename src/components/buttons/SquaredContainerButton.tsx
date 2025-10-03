import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../contexts/ThemeProvider";
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
};

function SquaredContainerButton(props: Props) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: props.backgroundColor ? props.backgroundColor : theme.colors?.background,
          boxShadow: theme.colors?.shadow,
        },
      ]}
    >
      <AnimatedPressable
        style={styles.ripple}
        onPress={props.onPress}
      >
        {props.children}
      </AnimatedPressable>
    </View>
  );
}

export default SquaredContainerButton;
