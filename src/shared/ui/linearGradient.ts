import { Platform } from "react-native";
import theme from "./theme";

const primary = theme.colors.primary
const secondary = theme.colors.secondary

function getColors(): [string, string] {
  if (Platform.OS === "web") {
    return [primary, secondary];
  } else {
    return [secondary, primary];
  }
}

export default getColors;
