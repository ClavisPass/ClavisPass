import React, { EffectCallback, ReactNode, useEffect } from "react";
import { Platform, StyleProp, View, ViewStyle } from "react-native";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../../app/providers/ThemeProvider";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  useFocusEffect?: (effect: EffectCallback) => void;
  trigger?: boolean;
};

function AnimatedContainer(props: Props) {
  const opacity = useSharedValue(0);

  const { globalStyles, theme } = useTheme();

  if (Platform.OS !== "web") {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors?.elevation.level2,
        }}
      >
        {props.children}
      </View>
    );
  }

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
    }, [props.trigger])
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors?.elevation.level2,
      }}
    >
      <Animated.View style={[globalStyles.container, props.style, style]}>
        {props.children}
      </Animated.View>
    </View>
  );
}

export default AnimatedContainer;
