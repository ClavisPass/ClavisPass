import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text } from "react-native";

import { BlurView } from "expo-blur";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Button } from "react-native-paper";
import { appWindow } from "@tauri-apps/api/window";

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    padding: 16,
  },
});

type Props = {};

function Blur(props: Props) {
  const [show, setShow] = useState(false);

  const [showComponents, setShowComponents] = useState(false);
  const opacity = useSharedValue(0);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, config, () => {
        if (opacity.value === 0) {
          setShowComponents(false);
        }
      }),
    };
  });

  appWindow.listen("tauri://focus", ({ event, payload }) => {
    setShow(false);
  });
  appWindow.listen("tauri://blur", ({ event, payload }) => {
    setShow(true);
    setShowComponents(true);
  });

  useEffect(() => {
    if (show) {
      opacity.value = 1;
    } else {
      opacity.value = 0;
    }
  }, [show]);

  return (
    <>
      {showComponents ? (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
              zIndex: 6,
              backgroundColor: "white",
              borderRadius: 10,
            },
            style,
          ]}
        >
          {/*<BlurView
            intensity={40}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
          </BlurView>*/}
        </Animated.View>
      ) : null}
    </>
  );
}

export default Blur;
