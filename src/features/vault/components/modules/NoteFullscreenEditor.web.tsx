import React from "react";
import { StyleSheet, View } from "react-native";
import Editor from "@monaco-editor/react";

import { useTheme } from "../../../../app/providers/ThemeProvider";

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  minHeight: number;
  variant?: "plain" | "markdown" | "snippet";
  language?: "text" | "json" | "yaml" | "env" | "shell";
  showLineNumbers?: boolean;
  wrapLines?: boolean;
  initialSelection?: { start: number; end: number };
  onSelectionChange?: (selection: { start: number; end: number }) => void;
};

const MONACO_LANGUAGE_BY_NOTE_LANGUAGE: Record<
  NonNullable<Props["language"]>,
  string
> = {
  text: "plaintext",
  json: "json",
  yaml: "yaml",
  env: "ini",
  shell: "shell",
};

export default function NoteFullscreenEditor({
  value,
  onChangeText,
  minHeight,
  variant = "plain",
  language = "text",
  showLineNumbers = false,
  wrapLines = true,
  initialSelection,
  onSelectionChange,
}: Props) {
  const { darkmode, theme } = useTheme();
  const isSnippet = variant === "snippet";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.tertiary,
        },
      ]}
    >
      <Editor
        height="100%"
        value={value}
        language={
          isSnippet
            ? MONACO_LANGUAGE_BY_NOTE_LANGUAGE[language]
            : variant === "markdown"
              ? "markdown"
              : "plaintext"
        }
        theme={darkmode ? "vs-dark" : "vs"}
        onChange={(nextValue) => onChangeText(nextValue ?? "")}
        onMount={(editor) => {
          const model = editor.getModel();
          if (model && initialSelection) {
            const cursor = Math.max(
              0,
              Math.min(initialSelection.start, value.length),
            );
            const position = model.getPositionAt(cursor);
            editor.setPosition(position);
            editor.revealPositionInCenterIfOutsideViewport(position);
          }

          const updateSelection = () => {
            const model = editor.getModel();
            const selection = editor.getSelection();
            if (!model || !selection) return;
            onSelectionChange?.({
              start: model.getOffsetAt(selection.getStartPosition()),
              end: model.getOffsetAt(selection.getEndPosition()),
            });
          };
          updateSelection();
          editor.onDidChangeCursorSelection(updateSelection);
          editor.focus();
        }}
        options={{
          automaticLayout: true,
          folding: isSnippet,
          showFoldingControls: isSnippet ? "mouseover" : "never",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontSize: 14,
          lineHeight: 21,
          lineNumbers: showLineNumbers ? "on" : "off",
          minimap: { enabled: false },
          overviewRulerBorder: false,
          padding: { top: 10, bottom: 8 },
          renderLineHighlight: "line",
          scrollBeyondLastLine: false,
          scrollbar: {
            alwaysConsumeMouseWheel: false,
          },
          tabSize: 2,
          wordWrap: wrapLines ? "on" : "off",
          wrappingIndent: "same",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },
});
