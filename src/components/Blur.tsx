import React, { ReactNode, useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { getCurrentWebviewWindow, WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Platform, StyleSheet } from "react-native";
import isTauri from "../utils/isTauri"; // Deine Hilfsfunktion

type Props = {
  children: ReactNode;
};

function Blur(props: Props) {
  const blurValue = useSharedValue(0);
  const [appWindow, setAppWindow] = useState<WebviewWindow | null>(null);

  useEffect(() => {
  if (!isTauri()) return;

  let focusListenerUnsub: (() => void) | null = null;
  let blurListenerUnsub: (() => void) | null = null;

  async function setup() {
    try {
      const window = await getCurrentWebviewWindow();
      setAppWindow(window);

      focusListenerUnsub = await window.listen("tauri://focus", () => {
        blurValue.value = withTiming(0, { duration: 200 });
        document.removeEventListener("mouseenter", handleMouseEnter);
        document.removeEventListener("mouseleave", handleMouseLeave);
      });

      blurListenerUnsub = await window.listen("tauri://blur", () => {
        blurValue.value = withTiming(6, { duration: 200 });
        document.addEventListener("mouseenter", handleMouseEnter);
        document.addEventListener("mouseleave", handleMouseLeave);
      });
    } catch (error) {
      console.warn("Failed to getCurrentWebviewWindow or listen:", error);
    }
  }

  const handleMouseEnter = () => {
    blurValue.value = withTiming(0, { duration: 200 });
  };

  const handleMouseLeave = () => {
    blurValue.value = withTiming(6, { duration: 200 });
  };

  setup();

  return () => {
    focusListenerUnsub && focusListenerUnsub();
    blurListenerUnsub && blurListenerUnsub();
    document.removeEventListener("mouseenter", handleMouseEnter);
    document.removeEventListener("mouseleave", handleMouseLeave);
  };
}, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      filter: `blur(${blurValue.value}px)`,
      opacity: 1 - blurValue.value / 16,
    };
  });

  // Wenn kein appWindow (z.B. in Expo Go / Web ohne Tauri), render einfach ohne Animation
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
