import Constants from "expo-constants";
import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    //justifyContent: "center",
    display: "flex",
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    marginTop: Constants.statusBarHeight,
  }
});

export default globalStyles;