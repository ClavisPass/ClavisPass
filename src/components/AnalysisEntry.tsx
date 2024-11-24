import { View } from "react-native";
import { useTheme } from "../contexts/ThemeProvider";
import CircularProgressBar from "./CircularProgressBar";
import { Text } from "react-native-paper";
import { number } from "zod";

type Props = {
  name: string;
  percentage: number;
  number: number;
};

function AnalysisEntry(props: Props) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        borderRadius: 16,
        padding: 12,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <View>
          <CircularProgressBar
            fill={props.percentage}
            maxValue={100}
            color={theme.colors.primary}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: "bold" }}>{props.number}</Text>
          <Text variant="titleSmall" style={{ color: theme.colors.primary }}>{props.name}</Text>
        </View>
      </View>
    </View>
  );
}

export default AnalysisEntry;
