import Constants from "expo-constants";
import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    display: "flex",
    //paddingLeft: 8,
    //paddingRight: 8,
    //marginTop: Constants.statusBarHeight,
    borderRadius: 10,
  },
  outlineStyle: {
    borderRadius: 10,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textInputStyle: { flex: 1, height: 40, lineHeight: 16 },
  textInputNoteStyle: { flex: 1, lineHeight: 16, margin: 4 },
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
