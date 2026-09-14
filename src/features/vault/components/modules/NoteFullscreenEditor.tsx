import React, { useEffect, useRef, useState } from "react";
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
  initialSelection?: { start: number; end: number };
  onSelectionChange?: (selection: { start: number; end: number }) => void;
  bottomPadding?: number;
};

export default function NoteFullscreenEditor({
  value,
  onChangeText,
  minHeight,
  variant,
  initialSelection,
  onSelectionChange,
  bottomPadding = 88,
}: Props) {
  const { globalStyles } = useTheme();
  const isSnippet = variant === "snippet";
  const scrollRef = useRef<ScrollView>(null);
  const didApplyInitialScrollRef = useRef(false);
  const [selectionOverride, setSelectionOverride] = useState(initialSelection);

  useEffect(() => {
    if (!initialSelection) return;
    if (didApplyInitialScrollRef.current) return;
    didApplyInitialScrollRef.current = true;

    const cursor = Math.max(0, Math.min(initialSelection.start, value.length));
    const lineIndex = value.slice(0, cursor).split(/\r?\n/).length - 1;
    const y = Math.max(0, lineIndex * 20 - 88);
    const timeout = setTimeout(() => {
      scrollRef.current?.scrollTo({ y, animated: false });
      setSelectionOverride(undefined);
    }, 80);

    return () => clearTimeout(timeout);
  }, [initialSelection, value]);

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.body}
      contentContainerStyle={[
        styles.bodyContent,
        { paddingBottom: bottomPadding },
      ]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
    >
      <TextInput
        autoFocus
        outlineStyle={[globalStyles.outlineStyle, styles.outline]}
        contentStyle={[styles.inputContent, { minHeight }]}
        style={[
          globalStyles.textInputStyle,
          styles.input,
          {
            minHeight,
          },
        ]}
        value={value}
        selection={selectionOverride}
        mode="outlined"
        onChangeText={onChangeText}
        onSelectionChange={(event) => {
          if (selectionOverride) setSelectionOverride(undefined);
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
    paddingTop: 6,
  },
  input: {
    height: undefined,
    padding: 0,
    minWidth: 0,
    width: "100%",
  },
  inputContent: {
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "web" ? 14 : 12,
    paddingBottom: Platform.OS === "web" ? 10 : 8,
    lineHeight: 20,
    textAlignVertical: "top",
  },
  outline: {
    borderWidth: 1,
  },
});
