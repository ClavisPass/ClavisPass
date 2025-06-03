import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Text, TouchableRipple } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../../ui/linearGradient";
import { useTheme } from "../../contexts/ThemeProvider";

const styles = StyleSheet.create({
  container: {
    height: 40,
    padding: 0,
    borderRadius: 12,
    width: 200,
    margin: 0,
    overflow: "hidden",
  },
  ripple: {
    flex: 1,
    width: 200,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

type Props = {
  text?: string;
  icon?: string;
  onPress: () => void;
  disabled?: boolean;
};

function Button(props: Props) {
  const { theme } = useTheme();
  return (
    <LinearGradient
      colors={props.disabled ? [theme.colors?.surfaceDisabled, theme.colors?.surfaceDisabled] : getColors()}
      style={styles.container}
      end={{ x: 0.1, y: 0.2 }}
      dither={true}
    >
      <TouchableRipple
        disabled={props.disabled}
        style={styles.ripple}
        onPress={props.onPress}
        rippleColor="rgba(0, 0, 0, .32)"
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {props.icon && <Icon source={props.icon} size={24} color="white" />}
          {props.text && (
            <Text
              style={{ color: "white", userSelect: "none" }}
              variant="bodyMedium"
            >
              {props.text}
            </Text>
          )}
        </View>
      </TouchableRipple>
    </LinearGradient>
  );
}

export default Button;
