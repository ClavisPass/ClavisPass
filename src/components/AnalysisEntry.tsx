import { useWindowDimensions, View } from "react-native";
import { useTheme } from "../contexts/ThemeProvider";
import CircularProgressBar from "./CircularProgressBar";
import { Text } from "react-native-paper";

type Props = {
  name: string;
  percentage: number;
  number: number;
  fixed?: boolean;
};

function AnalysisEntry(props: Props) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        flex: (width > 600) && !props.fixed ? undefined : 1,
        backgroundColor: theme.colors.background,
        borderRadius: 16,
        padding: 12,
        display: "flex",
        justifyContent: "center",
        boxShadow: theme.colors.shadow,
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
          <Text
            variant="titleLarge"
            style={{
              color: theme.colors.primary,
              fontWeight: "bold",
              userSelect: "none",
            }}
          >
            {props.number}
          </Text>
          <Text
            variant="titleSmall"
            style={{ color: theme.colors.primary, userSelect: "none" }}
          >
            {props.name}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default AnalysisEntry;
