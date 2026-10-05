import React from "react";
import { StyleSheet } from "react-native";
import ValuesType from "../../model/ValuesType";
import { useTheme } from "../../../../app/providers/ThemeProvider";

import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Totp } from "../modules/TotpModule";

const styles = StyleSheet.create({
  container: {
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 8,
    borderRadius: 12,
  },
  ripple: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    overflow: "hidden",
    borderRadius: 12,
  },
});

type Props = {
  value: string;
  item: ValuesType;
  onPress: () => void;
  key?: React.Key;
  index: number;
  denseSpacing?: boolean;
  denseHorizontalInset?: number;
};

function TotpItem(props: Props) {
  const { theme, darkmode } = useTheme();

  if(props.value === "") {
    return null;
  }

  const denseHorizontalInset = props.denseHorizontalInset ?? 8;
  const identitySurfaceStyle = {
    backgroundColor: darkmode
      ? "rgba(28, 28, 34, 0.58)"
      : "rgba(255, 255, 255, 0.68)",
    borderColor: darkmode
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(255, 255, 255, 0.82)",
    boxShadow: darkmode
      ? ("rgba(0, 0, 0, 0.14) 0px 8px 24px 0px" as any)
      : ("rgba(64, 76, 120, 0.08) 0px 8px 26px 0px" as any),
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(props.index * 50).duration(250)}
      key={props.key}
      style={[
        styles.container,
        props.denseSpacing
          ? {
              marginLeft: denseHorizontalInset,
              marginRight: 0,
              marginBottom: 4,
            }
          : null,
        identitySurfaceStyle,
        {
          borderWidth: StyleSheet.hairlineWidth,
          overflow: "hidden",
        },
      ]}
    >
      <AnimatedPressable
        key={props.key}
        style={styles.ripple}
        onPress={props.onPress}
      >
        <Totp value={props.value} variant="list" />
      </AnimatedPressable>
    </Animated.View>
  );
}

export default TotpItem;
