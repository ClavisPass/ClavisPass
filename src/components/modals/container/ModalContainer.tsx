import { ReactNode, useEffect, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { Animated, Easing } from "react-native";
import { useTheme } from "../../../contexts/ThemeProvider";
import React from "react";

type Props = {
  children: ReactNode;
  visible: boolean;
  onDismiss: () => void;
};
function ModalContainer(props: Props) {
  const { theme } = useTheme();
  const scale = new Animated.Value(0);

  const [useScale, setUseScale] = useState(true);

  const animatedStyle = {
    transform: [{ scale }],
  };

  const startAnimation = () => {
    scale.setValue(0);
    Animated.timing(scale, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(() => {
      if (Platform.OS === "web") setUseScale(false);
    });
  };

  useEffect(() => {
    if (props.visible) {
      startAnimation();
    } else {
      scale.setValue(0);
    }
  }, [props.visible]);
  return (
    <>
      {props.visible && (
        <View
          style={[
            {
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            },
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
        </View>
      )}
    </>
  );
}

export default ModalContainer;
