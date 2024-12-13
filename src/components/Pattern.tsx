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
        display: "flex",
        flexDirection: "row",
        gap: 8,
        width: "100%",
        justifyContent: "center",
      }}
    >
      {arrayPattern.map((char) => {
        return (
          <View
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
            <Text variant="bodyLarge" style={{ color: "white" }}>{char}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default Pattern;
