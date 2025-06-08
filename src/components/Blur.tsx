import React, { ReactNode, useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Platform, StyleSheet } from "react-native";

type Props = {
  children: ReactNode;
};

function Blur(props: Props) {
  const blurValue = useSharedValue(0);
  const [isFocused, setIsFocused] = useState(true); // Initial angenommen: Fenster ist fokussiert

  useEffect(() => {
    const handleFocus = () => {
      setIsFocused(true);
      blurValue.value = withTiming(0, { duration: 200 });
    };

    const handleBlur = () => {
      setIsFocused(false);
      blurValue.value = withTiming(6, { duration: 200 });
    };

    const handleMouseEnter = () => {
      // Blur nur rückgängig machen, wenn nicht fokussiert
      if (!isFocused) {
        blurValue.value = withTiming(0, { duration: 200 });
      }
    };

    const handleMouseLeave = () => {
      // Nur bluren, wenn Fenster nicht fokussiert ist
      if (!isFocused) {
        blurValue.value = withTiming(6, { duration: 200 });
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      filter: `blur(${blurValue.value}px)`,
      opacity: 1 - blurValue.value / 16,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {props.children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Blur;
