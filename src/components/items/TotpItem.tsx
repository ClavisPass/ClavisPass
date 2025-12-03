import React from "react";
import { StyleSheet } from "react-native";
import ValuesType from "../../types/ValuesType";
import { useTheme } from "../../contexts/ThemeProvider";

import AnimatedPressable from "../AnimatedPressable";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Totp } from "../modules/TotpModule";

const styles = StyleSheet.create({
  container: {
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 12,
    overflow: "hidden",
    height: 80,
  },
  ripple: {
    padding: 0,
    paddingLeft: 8,
    paddingRight: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    overflow: "hidden",
  },
});

type Props = {
  value: string;
  item: ValuesType;
  onPress: () => void;
  key?: React.Key;
  index: number;
};

function TotpItem(props: Props) {
  const { theme, darkmode } = useTheme();

  if(props.value === "") {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(props.index * 50).duration(250)}
      key={props.key}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors?.background,
          boxShadow: theme.colors?.shadow,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: darkmode ? theme.colors.outlineVariant : "white",
        },
      ]}
    >
      <AnimatedPressable
        key={props.key}
        style={styles.ripple}
        onPress={props.onPress}
      >
        <Totp value={props.value} />
      </AnimatedPressable>
    </Animated.View>
  );
}

export default TotpItem;
