const globalStyles = (background: string) => ({
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
    width: "100%",
    flexGrow: 1,
  },
  textInputStyle: { height: 40, lineHeight: 16, flex: 1 },
  textInputNoteStyle: { lineHeight: 16, padding: 4 },
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
    backgroundColor: background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: background,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
    marginBottom: 4,
  },
});

export default globalStyles;
