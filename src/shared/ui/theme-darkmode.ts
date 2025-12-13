import { MD3DarkTheme as DefaultTheme, MD3Theme } from "react-native-paper";

const theme: MD3Theme = {
  ...DefaultTheme,
  dark: true,
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    primary: "#787FF6",
    primaryContainer: "rgba(120, 126, 245, 1)",
    secondary: "#69C4FF",
    secondaryContainer: "rgba(120, 126, 245, 0.09)",
    background: "#1A1A1A",
    elevation: {
      level0: "transparent",
      level1: "rgb(39, 35, 41)",
      level2: "#0D0D0D", //rgb(44, 40, 48)
      level3: "#262626",
      level4: "rgb(52, 46, 57)",
      level5: "rgb(56, 49, 62)",
    },
    tertiary: "rgba(51, 51, 51, 1)",
    shadow: "",
    surface: "#292929ff",
    surfaceDisabled: "rgba(231, 225, 229, 0.12)",
    onSurfaceDisabled: "rgba(231, 225, 229, 0.38)",
    inversePrimary: "rgb(120, 69, 172)",
  },
};
export default theme;
