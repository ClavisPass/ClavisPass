import { ReactNode, useEffect } from "react";
import { Pressable, View, Animated, Easing } from "react-native";
import { useTheme } from "../../../contexts/ThemeProvider";

type Props = {
  children: ReactNode;
  visible: boolean;
  onDismiss: () => void;
  positionY: number;
};
function MenuContainer(props: Props) {
  const { theme } = useTheme();
  const translationX = new Animated.Value(-80);
  const translationY = new Animated.Value(-80);
  const scale = new Animated.Value(0);
  const positionY = props.positionY;

  const animatedStyle = {
    transform: [{ scale }],
  };

  const startAnimation = () => {
    Animated.timing(translationX, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    Animated.timing(translationY, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    Animated.timing(scale, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (props.visible) {
      startAnimation();
    } else {
      translationX.setValue(-80);
      translationY.setValue(-80);
      scale.setValue(0);
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

export default MenuContainer;
