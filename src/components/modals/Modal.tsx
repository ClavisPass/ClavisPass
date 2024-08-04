import { ReactNode, useEffect, useState } from "react";
import { Platform, Pressable, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../contexts/ThemeProvider";

type Props = {
  children: ReactNode;
  visible: boolean;
  onDismiss: () => void;
};
function Modal(props: Props) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  const [useScale, setUseScale] = useState(true);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const animatedOpacity = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const startAnimation = () => {
    scale.value = withTiming(
      1,
      {
        duration: 250,
        easing: Easing.out(Easing.exp),
      },
      () => {
        if (Platform.OS === "web") setUseScale(false);
      }
    );
    opacity.value = withTiming(1, {
      duration: 250,
      easing: Easing.out(Easing.exp),
    });
  };

  useEffect(() => {
    if (props.visible) {
      startAnimation();
    } else {
      scale.value = 0;
      opacity.value = 0;
      if (Platform.OS === "web") setUseScale(true);
    }
  }, [props.visible]);
  return (
    <>
      {props.visible && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={props.onDismiss}
          >
            <Pressable>
              <Animated.View
                style={[
                  {
                    overflow: "hidden",
                    backgroundColor: theme.colors?.elevation.level3,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    display: "flex",
                    flexDirection: "column",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 6,
                    elevation: 5,
                    zIndex: 1,
                  },
                  animatedStyle,
                  !useScale && { transform: undefined },
                ]}
              >
                {props.children}
              </Animated.View>
            </Pressable>
          </Pressable>
        </Animated.View>
      )}
    </>
  );
}

export default Modal;
