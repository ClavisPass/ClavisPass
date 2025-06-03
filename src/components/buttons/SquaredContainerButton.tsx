import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, TouchableRipple } from "react-native-paper";
import { useTheme } from "../../contexts/ThemeProvider";

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
      <TouchableRipple
        style={styles.ripple}
        onPress={props.onPress}
        rippleColor="rgba(0, 0, 0, .32)"
      >
        {props.children}
      </TouchableRipple>
    </View>
  );
}

export default SquaredContainerButton;
