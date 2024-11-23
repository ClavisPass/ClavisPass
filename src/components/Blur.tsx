import React, { ReactNode, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { appWindow } from "@tauri-apps/api/window";
import { Platform, StyleSheet } from "react-native";

type Props = {
  children: ReactNode;
};

function Blur(props: Props) {
  const blurValue = useSharedValue(0);

  useEffect(() => {
    const handleMouseEnter = () => {
      blurValue.value = withTiming(0, { duration: 200 });
    };

    const handleMouseLeave = () => {
      blurValue.value = withTiming(6, { duration: 200 });
    };

    const focusListener = appWindow.listen("tauri://focus", () => {
      blurValue.value = withTiming(0, { duration: 200 });
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    });

    const blurListener = appWindow.listen("tauri://blur", () => {
      blurValue.value = withTiming(6, { duration: 200 });
      document.addEventListener("mouseenter", handleMouseEnter);
      document.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      focusListener.then((unsub) => unsub());
      blurListener.then((unsub) => unsub());
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      filter: `blur(${blurValue.value}px)`,
      opacity: 1 - blurValue.value / 16,
    };
  });

  if (Platform.OS === "web" && !appWindow) {
    return <>{props.children}</>;
  }

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