import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export const STARTUP_BACKGROUND = "#0D0D0D";

export function applyStartupDocumentBackground() {
  if (Platform.OS !== "web") return;

  const doc = globalThis.document;
  if (!doc) return;

  doc.documentElement.style.backgroundColor = STARTUP_BACKGROUND;
  doc.body.style.backgroundColor = STARTUP_BACKGROUND;
  doc.body.style.margin = "0";
  doc.body.style.overflow = "hidden";

  const root = doc.getElementById("root");
  if (root) {
    root.style.backgroundColor = STARTUP_BACKGROUND;
    root.style.minHeight = "100vh";
  }
}

function StartupScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.mark}>
        <View style={styles.markInner} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: STARTUP_BACKGROUND,
    flex: 1,
    justifyContent: "center",
  },
  mark: {
    alignItems: "center",
    backgroundColor: "#787FF6",
    borderRadius: 18,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  markInner: {
    backgroundColor: "#69C4FF",
    borderRadius: 10,
    height: 22,
    width: 22,
  },
});

export default StartupScreen;
