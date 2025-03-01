import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../contexts/ThemeProvider";

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
        height: 50,
        borderRadius: 16,
        padding: 12,
        display: "flex",
        justifyContent: "center",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 6,
          width: "100%",
          justifyContent: "center",
        }}
      >
        {arrayPattern.map((char, index) => {
          return (
            <View
              key={index}
              style={{
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
              <Text variant="bodyLarge" style={{ color: "white", userSelect: "none" }}>
                {char}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default Pattern;
