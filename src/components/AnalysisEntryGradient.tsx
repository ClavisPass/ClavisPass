import { View } from "react-native";
import { useTheme } from "../contexts/ThemeProvider";
import CircularProgressBar from "./CircularProgressBar";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../ui/linearGradient";

type Props = {
  name: string;
  percentage: number;
  number: number;
};

function AnalysisEntryGradient(props: Props) {
  const { theme } = useTheme();
  return (
    <LinearGradient
      colors={getColors()}
      dither={true}
      end={{ x: 0.1, y: 0.2 }}
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        borderRadius: 16,
        padding: 12,
        display: "flex",
        justifyContent: "center",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
      }}
    >
      <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <View>
          <CircularProgressBar
            fill={props.percentage}
            maxValue={100}
            color={"white"}
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
            style={{ color: "white", fontWeight: "bold" }}
          >
            {props.number}
          </Text>
          <Text variant="titleSmall" style={{ color: "white" }}>
            {props.name}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

export default AnalysisEntryGradient;
