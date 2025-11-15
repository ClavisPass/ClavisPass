import { useWindowDimensions, View } from "react-native";
import { useTheme } from "../contexts/ThemeProvider";
import CircularProgressBar from "./CircularProgressBar";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../ui/linearGradient";

type Props = {
  name: string;
  percentage: number;
  number: number;
  fixed?: boolean;
};

function AnalysisEntryGradient(props: Props) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  return (
    <LinearGradient
      colors={getColors()}
      dither={true}
      end={{ x: 0.1, y: 0.2 }}
      style={{
        flex: width > 600 && !props.fixed ? undefined : 1,
        backgroundColor: theme.colors.background,
        borderRadius: 12,
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
            style={{ color: "white", fontWeight: "bold", userSelect: "none" }}
          >
            {props.number}
          </Text>
          <Text
            variant="titleSmall"
            style={{ color: "white", userSelect: "none" }}
          >
            {props.name}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

export default AnalysisEntryGradient;
