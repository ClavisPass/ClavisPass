import React from "react";
import { Platform, ScrollView, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

import { useTheme } from "../../../../app/providers/ThemeProvider";

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  minHeight: number;
  variant?: "plain" | "markdown" | "snippet";
  language?: "text" | "json" | "yaml" | "env" | "shell";
  showLineNumbers?: boolean;
  wrapLines?: boolean;
  onSelectionChange?: (selection: { start: number; end: number }) => void;
};

export default function NoteFullscreenEditor({
  value,
  onChangeText,
  minHeight,
  variant,
  onSelectionChange,
}: Props) {
  const { globalStyles, theme } = useTheme();
  const isSnippet = variant === "snippet";

  return (
    <ScrollView
      style={styles.body}
      contentContainerStyle={styles.bodyContent}
      keyboardShouldPersistTaps="handled"
    >
      <TextInput
        autoFocus
        outlineStyle={[globalStyles.outlineStyle, styles.outline]}
        contentStyle={[styles.inputContent, { minHeight }]}
        style={[
          globalStyles.textInputNoteStyle,
          styles.input,
          {
            minHeight,
            backgroundColor: theme.colors.tertiary,
          },
        ]}
        value={value}
        mode="outlined"
        onChangeText={onChangeText}
        onSelectionChange={(event) => {
          onSelectionChange?.(event.nativeEvent.selection);
        }}
        autoCapitalize={isSnippet ? "none" : "sentences"}
        autoCorrect={!isSnippet}
        multiline
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 0,
  },
  input: {
    height: undefined,
    padding: 0,
  },
  inputContent: {
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "web" ? 10 : 8,
    lineHeight: 20,
    textAlignVertical: "top",
  },
  outline: {
    borderRadius: 0,
    borderWidth: 1,
  },
});
