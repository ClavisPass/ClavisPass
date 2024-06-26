import React from "react";
import { StyleSheet } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../ui/linearGradient";

const styles = StyleSheet.create({
  container: {
    padding: 0,
    borderRadius: 50,
    width: 200,
    margin: 4,
    overflow: "hidden",
  },
  ripple: {
    width: 200,
    padding: 14,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

type Props = {
  text: string;
  onPress: () => void;
};

function Button(props: Props) {
  return (
    <LinearGradient
      colors={getColors()}
      style={styles.container}
      end={{ x: 0.1, y: 0.2 }}
      dither={true}
    >
      <TouchableRipple
        style={styles.ripple}
        onPress={props.onPress}
        rippleColor="rgba(0, 0, 0, .32)"
      >
        <Text
          style={{ color: "white", userSelect: "none" }}
          variant="bodyMedium"
        >
          {props.text}
        </Text>
      </TouchableRipple>
    </LinearGradient>
  );
}

export default Button;
