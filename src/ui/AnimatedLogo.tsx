import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect, Mask } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Logo from "./Logo";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export default function AnimatedLogo() {
  const x = useSharedValue(-400);

  useEffect(() => {
    x.value = withRepeat(
      withTiming(1400, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    x: x.value,
  }));

  return (
    <View style={styles.container}>
      <Svg width={100} height={100} viewBox="0 0 1080 1080">
        <Defs>
          <LinearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="white" stopOpacity={0} />
            <Stop offset="50%" stopColor="white" stopOpacity={0.5} />
            <Stop offset="100%" stopColor="white" stopOpacity={0} />
          </LinearGradient>

          <Mask id="mask">
            <Logo width="1080" height="1080" />
          </Mask>
        </Defs>

        <Logo width="1080" height="1080" />

        <AnimatedRect
          animatedProps={animatedProps}
          y="0"
          width="300"
          height="1080"
          fill="url(#shine)"
          mask="url(#mask)"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "transparent" },
});
