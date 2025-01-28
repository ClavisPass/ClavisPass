import { ReactNode, useEffect, useState } from "react";
import { Animated, Easing } from "react-native";
import React from "react";

type Props = {
  children: ReactNode;
  visible: boolean;
};
function AnimatedOpacityContainer(props: Props) {
  const opacity = new Animated.Value(0);

  const animatedStyle = {
    opacity: opacity,
  };

  const startAnimation = () => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(() => {});
  };

  useEffect(() => {
    if (props.visible) {
      startAnimation();
    } else {
      opacity.setValue(0);
    }
  }, [props.visible]);
  return (
    <>
      {props.visible && (
        <Animated.View style={[animatedStyle]}>{props.children}</Animated.View>
      )}
    </>
  );
}

export default AnimatedOpacityContainer;
