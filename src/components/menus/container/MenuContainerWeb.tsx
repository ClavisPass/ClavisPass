import { ReactNode, useEffect } from "react";
import { Platform, Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../../contexts/ThemeProvider";

type Props = {
  children: ReactNode;
  visible: boolean;
  onDismiss: () => void;
  positionY: number;
};
function MenuContainerWeb(props: Props) {
  const { theme } = useTheme();
  const translationX = useSharedValue(-80);
  const translationY = useSharedValue(-80);
  const scale = useSharedValue(0);
  const positionY = props.positionY;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: Platform.OS === "web" ? [{ scale: scale.value }] : undefined,
    };
  });

  const startAnimation = () => {
    translationX.value = withTiming(0, {
      duration: 250,
      easing: Easing.out(Easing.exp),
    });
    translationY.value = withTiming(0, {
      duration: 250,
      easing: Easing.out(Easing.exp),
    });
    scale.value = withTiming(1, {
      duration: 250,
      easing: Easing.out(Easing.exp),
    });
  };

  useEffect(() => {
    if (props.visible) {
      startAnimation();
    } else {
      translationX.value = -80;
      translationY.value = -80;
      scale.value = 0;
    }
  }, [props.visible]);
  return (
    <>
      {props.visible && (
        <View
          style={{
            backgroundColor: "transparent",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
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
          >
            <Pressable>
              <Animated.View
                style={[
                  {
                    overflow: "hidden",
                    position: "absolute",
                    backgroundColor: theme.colors?.elevation.level3,
                    top: positionY,
                    right: 4,
                    borderTopLeftRadius: 22,
                    borderTopRightRadius: 4,
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
                ]}
              >
                {props.children}
              </Animated.View>
            </Pressable>
          </Pressable>
        </View>
      )}
    </>
  );
}

export default MenuContainerWeb;
