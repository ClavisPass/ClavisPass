import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeProvider";

import { Text, TouchableRipple } from "react-native-paper";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  data: string[];
  setValue: (value: string) => void;
};
function Autocomplete(props: Props) {
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
      {props.visible && props.data.length > 0 && (
        <KeyboardAvoidingView>
          <Animated.View
            style={[
              {
                backgroundColor: theme.colors?.elevation.level3,
                borderRadius: 10,
                display: "flex",
                flexDirection: "column",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 6,
                elevation: 5,
                maxHeight: 200,
                paddingTop: 6,
                paddingBottom: 6,
              },
              animatedStyle,
              animatedOpacity,
              !useScale && { transform: undefined },
            ]}
          >
            <ScrollView>
              {props.data.map((item, index) => (
                <TouchableRipple
                  key={index}
                  style={{}}
                  onPress={() => {
                    props.setValue(item);
                    props.setVisible(false);
                  }}
                  rippleColor="rgba(0, 0, 0, .32)"
                >
                  <Text style={{ margin: 4 }}>{item}</Text>
                </TouchableRipple>
              ))}
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      )}
    </>
  );
}

export default Autocomplete;
