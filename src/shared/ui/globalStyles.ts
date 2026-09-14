import type { ViewStyle, TextStyle } from "react-native";

export type GlobalStyles = {
  container: ViewStyle;
  outlineStyle: ViewStyle;
  textInputStyle: TextStyle;
  moduleView: ViewStyle;
  fab: ViewStyle;
  folderContainer: ViewStyle;
};

const globalStyles = (
  background: string,
  secondaryContainer: string,
  surfaceVariant: string,
  outlineVariant: string,
  onSurface: string
): GlobalStyles => ({
  container: {
    flex: 1,
    backgroundColor: background,
    alignItems: "center",
    display: "flex",
  },
  outlineStyle: {
    borderRadius: 12,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: outlineVariant,
    borderWidth: 1,
  },
  textInputStyle: {
    height: 40,
    lineHeight: 18,
    fontSize: 14,
    color: onSurface,
    backgroundColor: surfaceVariant,
    minWidth: 200,
    maxWidth: "100%",
  },
  moduleView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 26,
  },
  folderContainer: {
    backgroundColor: secondaryContainer,
    borderRadius: 12,
    borderWidth: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
    padding: 8,
    paddingTop: 0,
    paddingBottom: 0,
    width: "100%",
  },
});

export default globalStyles;
