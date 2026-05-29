import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Button, IconButton, Text } from "react-native-paper";

import { HomeStackParamList } from "../app/navigation/model/types";
import { useTheme } from "../app/providers/ThemeProvider";
import NoteMarkdownPreview from "../features/vault/components/modules/NoteMarkdownPreview";
import NoteFullscreenEditor from "../features/vault/components/modules/NoteFullscreenEditor";
import CopyToClipboard from "../shared/components/buttons/CopyToClipboard";
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
    displayMode: initialDisplayMode = "normal",
    setDisplayMode,
    language: initialLanguage = "text",
    setLanguage,
    wrapLines: initialWrapLines = true,
    setWrapLines,
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
  const [displayModeLocal, setDisplayModeLocal] = useState(initialDisplayMode);
  const [languageLocal, setLanguageLocal] = useState(initialLanguage);
  const [wrapLinesLocal, setWrapLinesLocal] = useState(initialWrapLines);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [markdownPreview, setMarkdownPreview] = useState(false);

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    setVariantLocal(initialVariant);
  }, [initialVariant]);

  useEffect(() => {
    setDisplayModeLocal(initialDisplayMode);
  }, [initialDisplayMode]);

  useEffect(() => {
    setLanguageLocal(initialLanguage);
  }, [initialLanguage]);

  useEffect(() => {
    setWrapLinesLocal(initialWrapLines);
  }, [initialWrapLines]);

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
  const headerTitle = title
    ? `${t("modules:note")} - ${title}`
    : t("modules:note");
  const isSnippet = variantLocal === "snippet";
  const isMarkdown = variantLocal === "markdown";
  const canSplitMarkdownPreview = width >= 900;
  const markdownPreviewReplacesEditor =
    isMarkdown && markdownPreview && !canSplitMarkdownPreview;
  const showMarkdownFormatTools = isMarkdown && !markdownPreviewReplacesEditor;
  const displayModeOptions: NoteSelectorOption<
    "compact" | "normal" | "large"
  >[] = [
    {
      label: t("modules:noteCompact"),
      value: "compact",
      icon: "format-align-left",
    },
    {
      label: t("modules:noteNormal"),
      value: "normal",
      icon: "text-box-outline",
    },
    {
      label: t("modules:noteLarge"),
      value: "large",
      icon: "text-box",
    },
  ];
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
  const variantLabel =
    variantLocal === "plain"
      ? t("modules:notePlain")
      : variantLocal === "markdown"
        ? t("modules:noteMarkdown")
        : t("modules:noteSnippet");
  const languageLabel =
    languageLocal === "json"
      ? t("modules:noteLanguageJson")
      : languageLocal === "yaml"
        ? t("modules:noteLanguageYaml")
        : languageLocal === "env"
          ? t("modules:noteLanguageEnv")
          : languageLocal === "shell"
            ? t("modules:noteLanguageShell")
            : t("modules:noteLanguageText");

  const changeVariant = (nextVariant: "plain" | "markdown" | "snippet") => {
    setVariantLocal(nextVariant);
    setVariant?.(nextVariant);
    if (nextVariant === "snippet") {
      setWrapLinesLocal(true);
      setWrapLines?.(true);
    }
  };

  const changeDisplayMode = (
    nextDisplayMode: "compact" | "normal" | "large",
  ) => {
    setDisplayModeLocal(nextDisplayMode);
    setDisplayMode?.(nextDisplayMode);
  };

  const changeLanguage = (
    nextLanguage: "text" | "json" | "yaml" | "env" | "shell",
  ) => {
    setLanguageLocal(nextLanguage);
    setLanguage?.(nextLanguage);
  };

  const toggleWrapLines = () => {
    const next = !wrapLinesLocal;
    setWrapLinesLocal(next);
    setWrapLines?.(next);
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

  const replaceSelection = (replacement: string) => {
    const start = Math.max(0, Math.min(selection.start, selection.end));
    const end = Math.max(0, Math.max(selection.start, selection.end));
    const nextValue = `${value.slice(0, start)}${replacement}${value.slice(end)}`;
    changeValue(nextValue);
    const nextCursor = start + replacement.length;
    setSelection({ start: nextCursor, end: nextCursor });
  };

  const wrapSelection = (
    prefix: string,
    suffix = prefix,
    placeholder = "text",
  ) => {
    const start = Math.max(0, Math.min(selection.start, selection.end));
    const end = Math.max(0, Math.max(selection.start, selection.end));
    const selected = value.slice(start, end) || placeholder;
    replaceSelection(`${prefix}${selected}${suffix}`);
  };

  const prefixCurrentLine = (prefix: string, placeholder = "Text") => {
    const cursor = Math.max(0, Math.min(selection.start, value.length));
    const lineStart = value.lastIndexOf("\n", cursor - 1) + 1;
    const lineEndIndex = value.indexOf("\n", cursor);
    const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
    const line = value.slice(lineStart, lineEnd) || placeholder;
    const nextValue = `${value.slice(0, lineStart)}${prefix}${line}${value.slice(lineEnd)}`;
    changeValue(nextValue);
    const nextCursor = lineStart + prefix.length + line.length;
    setSelection({ start: nextCursor, end: nextCursor });
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
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <View style={styles.toolbarMainRow}>
          <View style={styles.toolbarLeft}>
            <NoteSelector
              value={displayModeLocal}
              options={displayModeOptions}
              onSelect={changeDisplayMode}
            />
            <NoteSelector
              value={variantLocal}
              options={variantOptions}
              onSelect={changeVariant}
            />
          </View>
          <View style={styles.toolbarActions}>
            <CopyToClipboard
              value={value}
              disabled={value.length === 0}
              margin={0}
              sensitive
            />
          </View>
        </View>
        {isSnippet || isMarkdown ? (
          <View style={styles.toolbarModeRow}>
            {isSnippet ? (
              <>
                <NoteSelector
                  value={languageLocal}
                  options={languageOptions}
                  onSelect={changeLanguage}
                />
                <IconButton
                  icon="format-text-wrapping-wrap"
                  selected={wrapLinesLocal}
                  size={20}
                  iconColor={theme.colors.primary}
                  onPress={toggleWrapLines}
                  accessibilityLabel={t("modules:noteWrapLines")}
                  style={styles.iconButton}
                />
              </>
            ) : null}
            {isMarkdown ? (
              <>
                <Button
                  compact
                  mode={markdownPreview ? "contained-tonal" : "outlined"}
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
                {showMarkdownFormatTools ? (
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
                      onPress={() => prefixCurrentLine("- ")}
                      accessibilityLabel={t("modules:noteBulletList")}
                      style={styles.iconButton}
                    />
                    <IconButton
                      icon="format-list-numbered"
                      size={20}
                      iconColor={theme.colors.primary}
                      onPress={() => prefixCurrentLine("1. ")}
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
              </>
            ) : null}
            {isSnippet && languageLocal === "json" ? (
              <IconButton
                icon="format-align-left"
                size={20}
                iconColor={theme.colors.primary}
                onPress={formatJson}
                accessibilityLabel={t("modules:noteFormatJson")}
                style={styles.iconButton}
              />
            ) : null}
          </View>
        ) : null}
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
          <View
            style={[
              styles.markdownPreviewPane,
              {
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <NoteMarkdownPreview value={value} />
          </View>
        ) : (
          <View
            style={[
              styles.editorSplit,
              canSplitMarkdownPreview && isMarkdown && markdownPreview
                ? styles.editorSplitWide
                : null,
            ]}
          >
            <View style={styles.editorPane}>
              <NoteFullscreenEditor
                value={value}
                onChangeText={changeValue}
                minHeight={minEditorHeight}
                variant={variantLocal}
                language={languageLocal}
                showLineNumbers
                wrapLines={wrapLinesLocal}
                onSelectionChange={changeSelection}
              />
            </View>
            {canSplitMarkdownPreview && isMarkdown && markdownPreview ? (
              <View
                style={[
                  styles.markdownPreviewPane,
                  {
                    borderColor: theme.colors.outline,
                  },
                ]}
              >
                <NoteMarkdownPreview value={value} />
              </View>
            ) : null}
          </View>
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
          {`${variantLabel}${isSnippet ? ` - ${languageLabel}` : ""} - ${t(
            "modules:noteCharacters",
            { count: value.length },
          )}`}
        </Text>
      </View>
    </AnimatedContainer>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    width: "100%",
    minHeight: 42,
    marginTop: -8,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  toolbarMainRow: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  toolbarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    minWidth: 0,
    flexShrink: 1,
  },
  toolbarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  toolbarModeRow: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
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
    borderWidth: 1,
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
