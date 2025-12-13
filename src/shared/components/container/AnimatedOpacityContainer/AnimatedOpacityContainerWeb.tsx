import { ReactNode, useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import React from "react";

type Props = {
  children: ReactNode;
  visible: boolean;
};
function AnimatedOpacityContainerWeb(props: Props) {
  const opacity = useSharedValue(0);

  const animatedOpacity = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const startAnimation = () => {
    opacity.value = withTiming(1, {
      duration: 250,
      easing: Easing.out(Easing.exp),
    });
  };

  useEffect(() => {
    if (props.visible) {
      startAnimation();
    } else {
      opacity.value = 0;
    }
  }, [props.visible]);
  return (
    <>
      {props.visible && (
        <Animated.View style={[animatedOpacity]}>
          {props.children}
        </Animated.View>
      )}
    </>
  );
}

export default AnimatedOpacityContainerWeb;
