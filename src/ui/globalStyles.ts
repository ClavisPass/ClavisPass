import Constants from "expo-constants";
import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#fff",
    alignItems: "center",
    display: "flex",
    //paddingLeft: 8,
    //paddingRight: 8,
    //marginTop: Constants.statusBarHeight,
  },
  outlineStyle: { minHeight: 42, height: 42, borderRadius: 10 },
  textInputStyle: { flex: 1, minHeight: 42, height: 42 },
});

export default globalStyles;
