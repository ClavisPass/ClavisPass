import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import { useTheme } from "../../../../app/providers/ThemeProvider";

type Props = {
  value: string;
  language?: "text" | "json" | "yaml" | "env" | "shell";
};

function JsonLine({ line }: { line: string }) {
  const { theme } = useTheme();
  const match = line.match(/^(\s*)("[^"]+"\s*:)?(.*)$/);
  if (!match) return <Text style={styles.codeText}>{line}</Text>;

  const [, indent, key, rest] = match;
  return (
    <Text style={styles.codeText}>
      <Text>{indent}</Text>
      {key ? <Text style={{ color: theme.colors.primary }}>{key}</Text> : null}
      <Text>{rest}</Text>
    </Text>
  );
}

export default function NoteCodePreview({ value, language = "text" }: Props) {
  const { theme } = useTheme();
  const lines = value.length ? value.split(/\r?\n/) : [""];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      horizontal={false}
      keyboardShouldPersistTaps="handled"
    >
      {lines.map((line, index) => (
        <View key={`${index}-${line}`} style={styles.row}>
          <Text
            style={[
              styles.lineNumber,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {index + 1}
          </Text>
          <View style={styles.lineContent}>
            {language === "json" ? (
              <JsonLine line={line} />
            ) : (
              <Text style={styles.codeText}>{line || " "}</Text>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  content: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 20,
  },
  lineNumber: {
    width: 38,
    paddingRight: 8,
    textAlign: "right",
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 20,
    userSelect: "none",
  },
  lineContent: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 20,
  },
});
