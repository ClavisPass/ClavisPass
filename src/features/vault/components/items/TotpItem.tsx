import React from "react";
import { StyleSheet } from "react-native";
import ValuesType from "../../model/ValuesType";
import { useTheme } from "../../../../app/providers/ThemeProvider";

import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Totp } from "../modules/TotpModule";
import { getItemSurfaceStyle } from "../../../../shared/ui/glass";

const styles = StyleSheet.create({
  container: {
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 8,
    borderRadius: 14,
  },
  rippleClip: {
    borderRadius: 14,
    overflow: "hidden",
  },
  ripple: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
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
  const { theme } = useTheme();

  if(props.value === "") {
    return null;
  }

  const denseHorizontalInset = props.denseHorizontalInset ?? 8;
  const itemSurfaceStyle = getItemSurfaceStyle(theme);

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
              marginBottom: 8,
            }
          : null,
        itemSurfaceStyle,
        {
          borderWidth: StyleSheet.hairlineWidth,
          overflow: "visible",
        },
      ]}
    >
      <Animated.View style={styles.rippleClip}>
        <AnimatedPressable
          key={props.key}
          style={styles.ripple}
          onPress={props.onPress}
        >
          <Totp value={props.value} variant="list" />
        </AnimatedPressable>
      </Animated.View>
    </Animated.View>
  );
}

export default TotpItem;
