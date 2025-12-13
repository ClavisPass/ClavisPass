import { Pressable, TouchableWithoutFeedback, View } from "react-native";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import getColors from "../../../shared/ui/linearGradient";
import Constants from "expo-constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRef } from "react";
import { useDevMode } from "../../../app/providers/DevModeProvider";

function SettingsFooter() {
  const { theme } = useTheme();
  const { setDevMode } = useDevMode();
  const appName =
    Constants.expoConfig && "name" in Constants.expoConfig
      ? (Constants.expoConfig as any).name
      : Constants.manifest && "name" in Constants.manifest
        ? (Constants.manifest as any).name
        : "App";
  const appVersion = Constants.expoConfig?.version ?? "unknown";
  const year = new Date().getFullYear();

  const tapCount = useRef(0);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  const handleDevModeToggle = () => {
    tapCount.current += 1;
    if (!timeout.current) {
      timeout.current = setTimeout(() => {
        tapCount.current = 0;
      }, 3000);
    }
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      clearTimeout(timeout.current);
      setDevMode(true);
    }
  };

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
          alignItems: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
          }}
        >
          <Icon color={"white"} name="copyright" size={16} />
          <Text
            style={{ color: "white", userSelect: "none" }}
          >{`${appName} ${year}`}</Text>
        </View>
        <Text
          onPress={handleDevModeToggle}
          style={{ color: "white", userSelect: "none", cursor: undefined }}
        >{`Version ${appVersion}`}</Text>
      </View>
    </LinearGradient>
  );
}

export default SettingsFooter;
