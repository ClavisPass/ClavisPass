import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../contexts/ThemeProvider";
import { ScrollView } from "react-native-gesture-handler";

type Props = {
  pattern: string | undefined;
};

function Pattern(props: Props) {
  const { theme } = useTheme();
  const [arrayPattern, setArrayPattern] = useState<string[]>([]);
  useEffect(() => {
    if (props.pattern) {
      setArrayPattern(Array.from(props.pattern));
    }
  }, [props.pattern]);
  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        borderRadius: 12,
        padding: 12,
        display: "flex",
        justifyContent: "space-around",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.outlineVariant,
      }}
    >
      <ScrollView
        horizontal
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          width: "100%",
          //justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {arrayPattern.map((char, index) => {
          return (
            <View
              key={index}
              style={{
                marginRight: 4,
                padding: 6,
                borderRadius: 10,
                backgroundColor: theme.colors.primary,
                display: "flex",
                width: 30,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                variant="bodyLarge"
                style={{ color: "white", userSelect: "none" }}
              >
                {char}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default Pattern;
