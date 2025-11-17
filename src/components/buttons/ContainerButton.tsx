import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../contexts/ThemeProvider";
import AnimatedPressable from "../AnimatedPressable";

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexBasis: 100,
    flexShrink: 1,
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
  flexGrow?: number;
  backgroundColor?: string;
  disabled?: boolean;
};

function ContainerButton(props: Props) {
  const { theme, darkmode } = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors?.background,
          boxShadow: theme.colors?.shadow,
          flexGrow: props.flexGrow || 1,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: darkmode ? theme.colors.outlineVariant : "white",
        },
      ]}
    >
      <View style={{ flex: 1, backgroundColor: props.backgroundColor || undefined }}>
        <AnimatedPressable
          disabled={props.disabled}
          style={styles.ripple}
          onPress={props.onPress}
        >
          {props.children}
        </AnimatedPressable>
      </View>
    </View>
  );
}

export default ContainerButton;
