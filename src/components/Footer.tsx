import { View } from "react-native";
import { useTheme } from "../contexts/ThemeProvider";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../ui/linearGradient";
import Constants from "expo-constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function Footer() {
  const { theme } = useTheme();
  const appName = Constants.expoConfig?.name || Constants.manifest?.name;
  const appVersion =
    Constants.expoConfig?.version || Constants.manifest?.version;
  const year = new Date().getFullYear();
  return (
    <LinearGradient
      colors={getColors()}
      dither={true}
      end={{ x: 0.1, y: 0.2 }}
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        borderRadius: 12,
        padding: 16,
        margin: 8,
        marginTop: 0,
        
        display: "flex",
        justifyContent: "center",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          justifyContent: "space-between",
        }}
      >
        <View style={{ display: "flex", flexDirection: "row", gap: 4, alignItems: "center" }}>
          <Icon color={"white"} name="copyright" size={20} />
          <Text
            style={{ color: "white", userSelect: "none" }}
          >{`${appName} ${year}`}</Text>
        </View>
        <Text
          style={{ color: "white", userSelect: "none" }}
        >{`Version ${appVersion}`}</Text>
      </View>
    </LinearGradient>
  );
}

export default Footer;
