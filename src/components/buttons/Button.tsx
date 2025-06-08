import React from "react";
import { DimensionValue, StyleSheet, View } from "react-native";
import { Icon, Text, TouchableRipple } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../../ui/linearGradient";
import { useTheme } from "../../contexts/ThemeProvider";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 40,
    padding: 0,
    borderRadius: 12,
    margin: 0,
    overflow: "hidden",
    minWidth: 200,
  },
  ripple: {
    flex: 1,
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
  color?: string;
  maxWidth?: number | DimensionValue;
  white?: boolean;
};

function Button(props: Props) {
  const { theme } = useTheme();
  return (
    <>
      {props.color ? (
        <View style={[styles.container, { backgroundColor: props.color, maxWidth: props.maxWidth }]}>
          <Content
            disabled={props.disabled}
            onPress={props.onPress}
            icon={props.icon}
            text={props.text}
          />
        </View>
      ) : (
        <LinearGradient
          colors={
            props.disabled
              ? [theme.colors?.surfaceDisabled, theme.colors?.surfaceDisabled]
              : getColors()
          }
          style={[styles.container, { maxWidth: props.maxWidth }]}
          end={{ x: 0.1, y: 0.2 }}
          dither={true}
        >
          <Content
            disabled={props.disabled}
            onPress={props.onPress}
            icon={props.icon}
            text={props.text}
          />
        </LinearGradient>
      )}
    </>
  );
}

function Content({white = true, ...props}: Props) {
  return (
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
        {props.icon && <Icon source={props.icon} size={24} color={white ? "white" : undefined} />}
        {props.text && (
          <Text
            style={{ color: white ? "white" : undefined, userSelect: "none" }}
            variant="bodyMedium"
          >
            {props.text}
          </Text>
        )}
      </View>
    </TouchableRipple>
  );
}

export default Button;
