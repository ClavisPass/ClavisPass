const globalStyles = (background: string, tertiary: string) => ({
  container: {
    flex: 1,
    backgroundColor: background,
    alignItems: "center",
    display: "flex",
  },
  outlineStyle: {
    borderRadius: 10,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: tertiary,
    borderWidth: 2,
  },
  textInputStyle: { height: 40, lineHeight: 16, backgroundColor: tertiary, minWidth: 200, maxWidth: "100%" },
  textInputNoteStyle: { lineHeight: 16, padding: 4, backgroundColor: tertiary, marginRight: 6, marginLeft: 6 },
  moduleView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingLeft: 6

  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 26,
  },
  folderContainer: {
    backgroundColor: background,
    borderRadius: 12,
    borderWidth: 0,
    borderColor: background,
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