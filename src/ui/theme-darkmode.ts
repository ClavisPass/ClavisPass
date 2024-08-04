import { MD3DarkTheme as DefaultTheme, shadow } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  dark: true,
  roundness: 4,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
    primary: "#787FF6",
    primaryContainer: "rgba(120, 126, 245, 1)",
    secondary: "#69C4FF",
    secondaryContainer: "rgba(120, 126, 245, 0.09)",
    background: "#2d2d30",
    //shadowColor: "grey",
    elevation: {
      level0: "transparent",
      level1: "rgb(39, 35, 41)",
      level2: "#1e1e1e", //rgb(44, 40, 48)
      level3: "#383838",
      level4: "rgb(52, 46, 57)",
      level5: "rgb(56, 49, 62)",
    },
    tertiary: "rgba(151, 151, 151, 1)",
  },
};
export default theme;
