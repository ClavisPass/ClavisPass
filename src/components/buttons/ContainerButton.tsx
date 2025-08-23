import React from "react";
import { StyleSheet, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { useTheme } from "../../contexts/ThemeProvider";

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
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors?.background,
          boxShadow: theme.colors?.shadow,
          flexGrow: props.flexGrow || 1,
        },
      ]}
    >
      <View style={{ flex: 1, backgroundColor: props.backgroundColor || undefined }}>
        <TouchableRipple
          disabled={props.disabled}
          style={styles.ripple}
          onPress={props.onPress}
          rippleColor="rgba(0, 0, 0, .32)"
        >
          {props.children}
        </TouchableRipple>
      </View>
    </View>
  );
}

export default ContainerButton;
