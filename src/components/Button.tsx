import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import {
  Text,
  TouchableRipple,
} from "react-native-paper";
import ValuesType from "../types/ValuesType";
import theme from "../ui/theme";
import { LinearGradient } from "expo-linear-gradient";

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 50,
    width: 200,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  ripple: {
    padding: 0,
    margin: 4,
    borderRadius: 50,
  },
});

type Props = {
  text: string;
  onPress: () => void;
};

function Button(props: Props) {
  return (
    <TouchableRipple style={styles.ripple} onPress={props.onPress} rippleColor="rgba(0, 0, 0, .32)">
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.container}
        end={{ x: 0.1, y: 0.2 }}
      >
        <Text style={{ color: "white" }} variant="bodyMedium">
          {props.text}
        </Text>
      </LinearGradient>
    </TouchableRipple>
  );
}

export default Button;
