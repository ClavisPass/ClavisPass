import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export const STARTUP_BACKGROUND = "transparent";

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
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: STARTUP_BACKGROUND,
    flex: 1,
  },
});

export default StartupScreen;
