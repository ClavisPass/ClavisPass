import React, { EffectCallback, ReactNode, useEffect } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import globalStyles from "../ui/globalStyles";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  useFocusEffect?: (effect: EffectCallback) => void;
};

function AnimatedContainer(props: Props) {
  const opacity = useSharedValue(0);

  const config = {
    duration: 400,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, config),
    };
  });

  useEffect(() => {
    opacity.value = 1;
  }, []);

  props.useFocusEffect?.(
    React.useCallback(() => {
      opacity.value = 1;
      return () => {
        opacity.value = 0;
      };
    }, [])
  );

  return (
    <Animated.View style={[globalStyles.container, props.style, style]}>
      {props.children}
    </Animated.View>
  );
}

export default AnimatedContainer;
