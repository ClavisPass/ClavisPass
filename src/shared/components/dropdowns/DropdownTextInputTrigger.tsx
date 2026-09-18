import React from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { TextInput } from "react-native-paper";

import { useTheme } from "../../../app/providers/ThemeProvider";
import AnimatedPressable from "../AnimatedPressable";

type Props = {
  value: string;
  onPress: () => void;
  outlineStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export default function DropdownTextInputTrigger({
  value,
  onPress,
  outlineStyle,
  inputStyle,
}: Props) {
  const { theme } = useTheme();
  const flattenedInputStyle = StyleSheet.flatten(inputStyle);
  const backgroundColor =
    flattenedInputStyle?.backgroundColor ?? theme.colors.surfaceVariant;

  return (
    <AnimatedPressable
      onPress={onPress}
      hoverBackgroundColor="rgba(120, 127, 246, 0.12)"
      rippleColor="rgba(120, 127, 246, 0.22)"
      style={{
        width: "100%",
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor,
        cursor: "pointer",
      }}
    >
      <View pointerEvents="none">
        <TextInput
          outlineStyle={outlineStyle}
          style={[
            inputStyle,
            {
              minWidth: 0,
              width: "100%",
              backgroundColor: "transparent",
              cursor: "pointer",
            } as any,
          ]}
          mode="outlined"
          value={value}
          editable={false}
          showSoftInputOnFocus={false}
          right={<TextInput.Icon icon="menu-down" />}
        />
      </View>
    </AnimatedPressable>
  );
}
