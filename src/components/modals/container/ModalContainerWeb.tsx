import { ReactNode, useEffect } from "react";
import { Platform, Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../../contexts/ThemeProvider";
import React from "react";

type Props = {
  children: ReactNode;
  visible: boolean;
  onDismiss: () => void;
};

function ModalContainerWeb(props: Props) {
  const { theme } = useTheme();
  const opacity = useSharedValue(0);

  const animatedOpacity = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (props.visible) {
      opacity.value = withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.exp),
      });
    } else {
      opacity.value = withTiming(0, {
        duration: 250,
        easing: Easing.out(Easing.exp),
      });
    }
  }, [props.visible]);

  if (!props.visible) return null;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        },
        animatedOpacity,
      ]}
    >
      <Pressable
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
        onPress={props.onDismiss}
      />
      <View
        style={{
          overflow: "hidden",
          backgroundColor: theme.colors?.elevation.level3,
          borderRadius: 20,
          maxWidth: 400,
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {props.children}
      </View>
    </Animated.View>
  );
}

export default ModalContainerWeb;
