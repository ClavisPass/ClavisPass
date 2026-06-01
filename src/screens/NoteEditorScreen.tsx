import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Button, Chip, IconButton, Text } from "react-native-paper";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

import { HomeStackParamList } from "../app/navigation/model/types";
import { useTheme } from "../app/providers/ThemeProvider";
import NoteMarkdownPreview from "../features/vault/components/modules/NoteMarkdownPreview";
import NoteFullscreenEditor from "../features/vault/components/modules/NoteFullscreenEditor";
import AnimatedContainer from "../shared/components/container/AnimatedContainer";
import Header from "../shared/components/Header";
import { useTranslation } from "react-i18next";
import NoteSelector, {
  NoteSelectorOption,
} from "../features/vault/components/modules/NoteSelector";

type NoteEditorScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "NoteEditor"
>;

const NoteEditorScreen: React.FC<NoteEditorScreenProps> = ({
  route,
  navigation,
}) => {
  const {
    value: initialValue,
    title,
    setValue,
    variant: initialVariant = "plain",
    setVariant,
    language: initialLanguage = "text",
    setLanguage,
  } = route.params;
  const { t } = useTranslation();
  const { height, width } = useWindowDimensions();
  const {
    globalStyles,
    theme,
    headerWhite,
    setHeaderWhite,
    darkmode,
    setHeaderSpacing,
  } = useTheme();

  const [value, setLocalValue] = useState(initialValue);
  const [variantLocal, setVariantLocal] = useState(initialVariant);
  const [languageLocal, setLanguageLocal] = useState(initialLanguage);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [markdownPreview, setMarkdownPreview] = useState(false);

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    setVariantLocal(initialVariant);
  }, [initialVariant]);

  useEffect(() => {
    setLanguageLocal(initialLanguage);
  }, [initialLanguage]);

  useFocusEffect(
    React.useCallback(() => {
      setHeaderSpacing(40);
      setHeaderWhite(false);
    }, [setHeaderSpacing, setHeaderWhite]),
  );

  const changeValue = useCallback(
    (nextValue: string) => {
      setLocalValue(nextValue);
      setValue(nextValue);
    },
    [setValue],
  );

  const minEditorHeight = useMemo(() => Math.max(360, height - 132), [height]);
  const markdownPreviewTransition = useMemo(
    () => LinearTransition.duration(180),
    [],
  );
  const headerTitle = title
    ? `${t("modules:note")} - ${title}`
    : t("modules:note");
  const isSnippet = variantLocal === "snippet";
  const isMarkdown = variantLocal === "markdown";
  const canSplitMarkdownPreview = width >= 900;
  const markdownPreviewReplacesEditor =
    isMarkdown && markdownPreview && !canSplitMarkdownPreview;
  const showMarkdownFormatTools = isMarkdown && !markdownPreviewReplacesEditor;
  const variantOptions: NoteSelectorOption<"plain" | "markdown" | "snippet">[] =
    [
      {
        label: t("modules:notePlain"),
        value: "plain",
        icon: "text-box-outline",
      },
      {
        label: t("modules:noteMarkdown"),
        value: "markdown",
        icon: "language-markdown-outline",
      },
      { label: t("modules:noteSnippet"), value: "snippet", icon: "code-tags" },
    ];
  const languageOptions: NoteSelectorOption<
    "text" | "json" | "yaml" | "env" | "shell"
  >[] = [
    { label: t("modules:noteLanguageText"), value: "text", icon: "text-short" },
    { label: t("modules:noteLanguageJson"), value: "json", icon: "code-json" },
    {
      label: t("modules:noteLanguageYaml"),
      value: "yaml",
      icon: "code-braces",
    },
    {
      label: t("modules:noteLanguageEnv"),
      value: "env",
      icon: "code-brackets",
    },
    { label: t("modules:noteLanguageShell"), value: "shell", icon: "console" },
  ];
  const wordCount = useMemo(() => {
    const words = value.trim().match(/\S+/g);
    return words?.length ?? 0;
  }, [value]);
  const lineCount = useMemo(
    () => (value.length ? value.split(/\r?\n/).length : 1),
    [value],
  );

  const changeVariant = (nextVariant: "plain" | "markdown" | "snippet") => {
    setVariantLocal(nextVariant);
    setVariant?.(nextVariant);
  };

  const changeLanguage = (
    nextLanguage: "text" | "json" | "yaml" | "env" | "shell",
  ) => {
    setLanguageLocal(nextLanguage);
    setLanguage?.(nextLanguage);
  };

  const changeSelection = useCallback(
    (nextSelection: { start: number; end: number }) => {
      setSelection((current) =>
        current.start === nextSelection.start &&
        current.end === nextSelection.end
          ? current
          : nextSelection,
      );
    },
    [],
  );

  const getSelectionRange = () => {
    const start = Math.max(0, Math.min(selection.start, selection.end));
    const end = Math.max(0, Math.max(selection.start, selection.end));
    return { start, end };
  };

  const replaceRange = (start: number, end: number, replacement: string) => {
    const nextValue = `${value.slice(0, start)}${replacement}${value.slice(end)}`;
    changeValue(nextValue);
    const nextCursor = start + replacement.length;
    setSelection({ start: nextCursor, end: nextCursor });
  };

  const replaceSelection = (replacement: string) => {
    const { start, end } = getSelectionRange();
    replaceRange(start, end, replacement);
  };

  const getWordRangeAtCursor = (cursor: number) => {
    const isWordChar = (char: string) => /[^\s*`#()[\]{}<>.,;:!?]/.test(char);
    let start = Math.max(0, Math.min(cursor, value.length));
    let end = start;

    if (
      start > 0 &&
      !isWordChar(value[start]) &&
      isWordChar(value[start - 1])
    ) {
      start -= 1;
      end = start + 1;
    }

    while (start > 0 && isWordChar(value[start - 1])) start -= 1;
    while (end < value.length && isWordChar(value[end])) end += 1;

    return start === end ? null : { start, end };
  };

  const wrapSelection = (
    prefix: string,
    suffix = prefix,
    placeholder = "text",
  ) => {
    const range = getSelectionRange();
    const wordRange =
      range.start === range.end ? getWordRangeAtCursor(range.start) : null;
    const start = wordRange?.start ?? range.start;
    const end = wordRange?.end ?? range.end;
    const selected = value.slice(start, end) || placeholder;

    if (
      value.slice(start - prefix.length, start) === prefix &&
      value.slice(end, end + suffix.length) === suffix
    ) {
      const unwrapStart = start - prefix.length;
      const unwrapEnd = end + suffix.length;
      const nextValue = `${value.slice(0, unwrapStart)}${selected}${value.slice(unwrapEnd)}`;
      changeValue(nextValue);
      setSelection({
        start: unwrapStart,
        end: unwrapStart + selected.length,
      });
      return;
    }

    replaceRange(start, end, `${prefix}${selected}${suffix}`);
  };

  const getSelectedLineRange = () => {
    const { start, end } = getSelectionRange();
    const blockStart = value.lastIndexOf("\n", start - 1) + 1;
    const lookupEnd = end > start && value[end - 1] === "\n" ? end - 1 : end;
    const nextLineBreak = value.indexOf("\n", lookupEnd);
    const blockEnd = nextLineBreak === -1 ? value.length : nextLineBreak;
    return { blockStart, blockEnd };
  };

  const prefixCurrentLine = (prefix: string, placeholder = "Text") => {
    const { blockStart, blockEnd } = getSelectedLineRange();
    const line = value.slice(blockStart, blockEnd) || placeholder;
    const cleanedLine = line.replace(/^\s*#{1,6}\s+/, "");
    const nextValue = `${value.slice(0, blockStart)}${prefix}${cleanedLine}${value.slice(blockEnd)}`;
    changeValue(nextValue);
    const nextCursor = blockStart + prefix.length + cleanedLine.length;
    setSelection({ start: nextCursor, end: nextCursor });
  };

  const prefixListLines = (kind: "bullet" | "numbered") => {
    const { blockStart, blockEnd } = getSelectedLineRange();
    const previousText = value.slice(0, blockStart);
    const previousNumberMatches = [
      ...previousText.matchAll(/^\s*(\d+)\.\s+/gm),
    ];
    let nextNumber =
      previousNumberMatches.length > 0
        ? Number(previousNumberMatches[previousNumberMatches.length - 1][1]) + 1
        : 1;

    const lines = value.slice(blockStart, blockEnd).split("\n");
    const nextLines = lines.map((line) => {
      const match = line.match(/^(\s*)(?:[-*]|\d+\.)\s+(.*)$/);
      const indent = match?.[1] ?? line.match(/^\s*/)?.[0] ?? "";
      const content = (match?.[2] ?? line.slice(indent.length)) || "Text";
      const marker = kind === "bullet" ? "- " : `${nextNumber++}. `;
      return `${indent}${marker}${content}`;
    });
    const replacement = nextLines.join("\n");
    const nextValue = `${value.slice(0, blockStart)}${replacement}${value.slice(blockEnd)}`;
    changeValue(nextValue);
    setSelection({ start: blockStart, end: blockStart + replacement.length });
  };

  const insertCodeBlock = () => {
    replaceSelection("```\ncode\n```");
  };

  const formatJson = () => {
    try {
      changeValue(JSON.stringify(JSON.parse(value), null, 2));
    } catch {
      // Keep the current value unchanged when the snippet is not valid JSON.
    }
  };

  return (
    <AnimatedContainer style={globalStyles.container}>
      <StatusBar
        animated={true}
        style={headerWhite ? "light" : darkmode ? "light" : "dark"}
        translucent={true}
      />
      <Header onPress={() => navigation.goBack()} title={headerTitle} />
      <View
        style={[
          styles.toolbar,
          {
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <View style={styles.toolbarMainRow}>
          <View style={styles.toolbarLeft}>
            <NoteSelector
              value={variantLocal}
              options={variantOptions}
              onSelect={changeVariant}
            />
            {isSnippet ? (
              <NoteSelector
                value={languageLocal}
                options={languageOptions}
                onSelect={changeLanguage}
              />
            ) : null}
            {isMarkdown && showMarkdownFormatTools ? (
              <>
                <IconButton
                  icon="format-bold"
                  size={20}
                  iconColor={theme.colors.primary}
                  onPress={() => wrapSelection("**")}
                  accessibilityLabel={t("modules:noteBold")}
                  style={styles.iconButton}
                />
                <IconButton
                  icon="format-italic"
                  size={20}
                  iconColor={theme.colors.primary}
                  onPress={() => wrapSelection("*")}
                  accessibilityLabel={t("modules:noteItalic")}
                  style={styles.iconButton}
                />
                <IconButton
                  icon="code-tags"
                  size={20}
                  iconColor={theme.colors.primary}
                  onPress={() => wrapSelection("`")}
                  accessibilityLabel={t("modules:noteInlineCode")}
                  style={styles.iconButton}
                />
                <IconButton
                  icon="format-header-1"
                  size={20}
                  iconColor={theme.colors.primary}
                  onPress={() => prefixCurrentLine("# ", "Heading")}
                  accessibilityLabel={t("modules:noteHeading")}
                  style={styles.iconButton}
                />
                <IconButton
                  icon="format-list-bulleted"
                  size={20}
                  iconColor={theme.colors.primary}
                  onPress={() => prefixListLines("bullet")}
                  accessibilityLabel={t("modules:noteBulletList")}
                  style={styles.iconButton}
                />
                <IconButton
                  icon="format-list-numbered"
                  size={20}
                  iconColor={theme.colors.primary}
                  onPress={() => prefixListLines("numbered")}
                  accessibilityLabel={t("modules:noteNumberedList")}
                  style={styles.iconButton}
                />
                <IconButton
                  icon="code-braces"
                  size={20}
                  iconColor={theme.colors.primary}
                  onPress={insertCodeBlock}
                  accessibilityLabel={t("modules:noteCodeBlock")}
                  style={styles.iconButton}
                />
              </>
            ) : null}
            {isSnippet && languageLocal === "json" ? (
              <Chip
                compact
                icon="format-align-left"
                onPress={formatJson}
                accessibilityLabel={t("modules:noteFormatJson")}
                style={styles.formatJsonChip}
                textStyle={styles.formatJsonChipText}
              >
                {t("modules:noteFormatJson")}
              </Chip>
            ) : null}
          </View>
          <View style={styles.toolbarActions}>
            {isMarkdown ? (
              <Button
                compact
                mode="contained-tonal"
                textColor={theme.colors.primary}
                onPress={() => setMarkdownPreview(!markdownPreview)}
                accessibilityLabel={
                  markdownPreview
                    ? t("modules:noteHidePreview")
                    : t("modules:noteShowPreview")
                }
                contentStyle={styles.previewButtonContent}
                labelStyle={styles.previewButtonLabel}
                style={styles.previewButton}
              >
                {markdownPreview
                  ? t("modules:noteHidePreview")
                  : t("modules:noteShowPreview")}
              </Button>
            ) : null}
          </View>
        </View>
      </View>
      <View
        style={[
          styles.editorShell,
          {
            backgroundColor: theme.colors.elevation.level2,
          },
        ]}
      >
        {markdownPreviewReplacesEditor ? (
          <Animated.View
            entering={FadeIn.duration(140)}
            exiting={FadeOut.duration(120)}
            layout={markdownPreviewTransition}
            style={styles.markdownPreviewPane}
          >
            <NoteMarkdownPreview value={value} />
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeIn.duration(140)}
            exiting={FadeOut.duration(120)}
            layout={markdownPreviewTransition}
            style={[
              styles.editorSplit,
              canSplitMarkdownPreview && isMarkdown && markdownPreview
                ? styles.editorSplitWide
                : null,
            ]}
          >
            <Animated.View
              layout={markdownPreviewTransition}
              style={styles.editorPane}
            >
              <NoteFullscreenEditor
                value={value}
                onChangeText={changeValue}
                minHeight={minEditorHeight}
                variant={variantLocal}
                language={languageLocal}
                showLineNumbers={variantLocal !== "plain"}
                wrapLines
                onSelectionChange={changeSelection}
              />
            </Animated.View>
            {canSplitMarkdownPreview && isMarkdown && markdownPreview ? (
              <Animated.View
                entering={FadeIn.duration(160)}
                exiting={FadeOut.duration(120)}
                layout={markdownPreviewTransition}
                style={styles.markdownPreviewPane}
              >
                <NoteMarkdownPreview value={value} />
              </Animated.View>
            ) : null}
          </Animated.View>
        )}
      </View>
      <View
        style={[
          styles.footerMeta,
          {
            backgroundColor: theme.colors.elevation.level2,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <Text
          variant="labelSmall"
          style={{ color: theme.colors.onSurfaceVariant }}
          numberOfLines={1}
        >
          {`${t("modules:noteCharacters", { count: value.length })} - ${t(
            "modules:noteWords",
            { count: wordCount },
          )} - ${t("modules:noteLines", { count: lineCount })}`}
        </Text>
      </View>
    </AnimatedContainer>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    width: "100%",
    minHeight: 42,
    padding: 8,
    paddingTop: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  toolbarMainRow: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  toolbarLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
    minWidth: 0,
    flexShrink: 1,
  },
  toolbarActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    gap: 4,
  },
  editorShell: {
    flex: 1,
    width: "100%",
  },
  editorSplit: {
    flex: 1,
    width: "100%",
  },
  editorSplitWide: {
    flexDirection: "row",
    gap: 4,
  },
  editorPane: {
    flex: 1,
    minWidth: 0,
  },
  markdownPreviewPane: {
    flex: 1,
    margin: 4,
    marginTop: 0,
    borderRadius: 8,
    overflow: "hidden",
  },
  footerMeta: {
    width: "100%",
    minHeight: 24,
    paddingHorizontal: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
  },
  iconButton: {
    margin: 0,
  },
  formatJsonChip: {
    height: 32,
    margin: 0,
    borderRadius: 12,
    justifyContent: "center",
  },
  formatJsonChipText: {
    fontSize: 12,
    lineHeight: 14,
    marginVertical: 0,
  },
  previewButton: {
    margin: 0,
    borderRadius: 8,
  },
  previewButtonContent: {
    height: 34,
    minHeight: 34,
    paddingHorizontal: 8,
  },
  previewButtonLabel: {
    marginVertical: 0,
    fontSize: 12,
    lineHeight: 14,
  },
});

export default NoteEditorScreen;
