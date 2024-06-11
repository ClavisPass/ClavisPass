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
  outlineStyle: { borderRadius: 10, padding: 0 },
  textInputStyle: { flex: 1, maxHeight: 40, height: 40, minHeight: 40 },
  moduleView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 26,
  },
});

export default globalStyles;
