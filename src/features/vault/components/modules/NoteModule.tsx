import React, { useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import NoteModuleType from "../../model/modules/NoteModuleType";
import ModuleContainer from "../ModuleContainer";
import Props from "../../model/ModuleProps";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import ModulesEnum from "../../model/ModulesEnum";
import CopyToClipboard from "../../../../shared/components/buttons/CopyToClipboard";
import { HomeStackParamList } from "../../../../app/navigation/model/types";
import NoteMarkdownPreview from "./NoteMarkdownPreview";
import NoteCodePreview from "./NoteCodePreview";
import NoteSelector, { NoteSelectorOption } from "./NoteSelector";

type NoteModuleNavigationProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, "Edit", undefined>;
  title: string;
};

type NoteDisplayMode = NonNullable<NoteModuleType["displayMode"]>;
type NoteVariant = NonNullable<NoteModuleType["variant"]>;
type NoteLanguage = NonNullable<NoteModuleType["language"]>;

const DISPLAY_MODES: NoteDisplayMode[] = ["compact", "normal", "large"];
const NOTE_VARIANTS: NoteVariant[] = ["plain", "markdown", "snippet"];

const VARIANT_LABELS: Record<NoteVariant, string> = {
  plain: "modules:notePlain",
  markdown: "modules:noteMarkdown",
  snippet: "modules:noteSnippet",
};

const DISPLAY_MODE_HEIGHTS: Record<
  NoteDisplayMode,
  { min: number; max: number; icon: string; labelKey: string }
> = {
  compact: {
    min: 88,
    max: 140,
    icon: "format-align-left",
    labelKey: "modules:noteCompact",
  },
  normal: {
    min: 150,
    max: 260,
    icon: "text-box-outline",
    labelKey: "modules:noteNormal",
  },
  large: {
    min: 240,
    max: 420,
    icon: "text-box",
    labelKey: "modules:noteLarge",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function noteModuleEquals(
  current: NoteModuleType & Props & NoteModuleNavigationProps,
  next: NoteModuleType,
) {
  return (
    current.value === next.value &&
    (current.displayMode ?? "normal") === (next.displayMode ?? "normal") &&
    (current.variant ?? "plain") === (next.variant ?? "plain") &&
    (current.language ?? "text") === (next.language ?? "text") &&
    (current.wrapLines ?? true) === (next.wrapLines ?? true)
  );
}

function NoteModule(props: NoteModuleType & Props & NoteModuleNavigationProps) {
  const didMount = useRef(false);
  const { t } = useTranslation();
  const { globalStyles, theme } = useTheme();
  const [value, setValue] = useState(props.value);
  const [displayMode, setDisplayMode] = useState<NoteDisplayMode>(
    props.displayMode ?? "normal",
  );
  const [variant, setVariant] = useState<NoteVariant>(props.variant ?? "plain");
  const [language, setLanguage] = useState<NoteLanguage>(
    props.language ?? "text",
  );
  const [wrapLines, setWrapLines] = useState(props.wrapLines ?? true);
  const [inputHeight, setInputHeight] = useState(
    DISPLAY_MODE_HEIGHTS[props.displayMode ?? "normal"].min,
  );

  const sizing = DISPLAY_MODE_HEIGHTS[displayMode];

  const displayModeOptions: NoteSelectorOption<NoteDisplayMode>[] =
    DISPLAY_MODES.map((mode) => ({
      label: t(DISPLAY_MODE_HEIGHTS[mode].labelKey),
      value: mode,
      icon: DISPLAY_MODE_HEIGHTS[mode].icon,
    }));

  const variantOptions: NoteSelectorOption<NoteVariant>[] = NOTE_VARIANTS.map(
    (noteVariant) => ({
      label: t(VARIANT_LABELS[noteVariant]),
      value: noteVariant,
      icon: noteVariant === "snippet" ? "code-tags" : "text-box-outline",
    }),
  );

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setDisplayMode(props.displayMode ?? "normal");
  }, [props.displayMode]);

  useEffect(() => {
    setVariant(props.variant ?? "plain");
  }, [props.variant]);

  useEffect(() => {
    setLanguage(props.language ?? "text");
  }, [props.language]);

  useEffect(() => {
    setWrapLines(props.wrapLines ?? true);
  }, [props.wrapLines]);

  useEffect(() => {
    setInputHeight((current) => clamp(current, sizing.min, sizing.max));
  }, [sizing.max, sizing.min]);

  useEffect(() => {
    if (didMount.current) {
      const newModule: NoteModuleType = {
        id: props.id,
        module: props.module,
        value,
        displayMode,
        variant,
        language,
        wrapLines,
      };
      if (!noteModuleEquals(props, newModule)) {
        props.changeModule(newModule);
      }
    } else {
      didMount.current = true;
    }
  }, [value, displayMode, variant, language, wrapLines]);

  const isSnippet = variant === "snippet";
  const isMarkdown = variant === "markdown";

  const openEditor = () => {
    props.navigation.navigate("NoteEditor", {
      value,
      title: props.title,
      setValue,
      variant,
      setVariant,
      displayMode,
      setDisplayMode,
      language,
      setLanguage,
      showLineNumbers: true,
      wrapLines,
      setWrapLines,
    });
  };

  const editor = (
    <TextInput
      autoFocus={value === ""}
      outlineStyle={[globalStyles.outlineStyle, styles.outline]}
      contentStyle={styles.inputContent}
      style={[
        globalStyles.textInputNoteStyle,
        styles.input,
        {
          minHeight: sizing.min,
          height: inputHeight,
          maxHeight: sizing.max,
          backgroundColor: theme.colors.tertiary,
        },
      ]}
      value={value}
      mode="outlined"
      onChangeText={setValue}
      autoCapitalize={isSnippet ? "none" : "sentences"}
      autoCorrect={!isSnippet}
      multiline
      scrollEnabled={inputHeight >= sizing.max}
      onContentSizeChange={(event) => {
        const nextHeight = clamp(
          Math.ceil(event.nativeEvent.contentSize.height) + 24,
          sizing.min,
          sizing.max,
        );
        setInputHeight((current) =>
          current === nextHeight ? current : nextHeight,
        );
      }}
    />
  );

  return (
    <ModuleContainer
      id={props.id}
      title={t("modules:note")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.NOTE]}
      fastAccess={props.fastAccess}
    >
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <View style={styles.toolbarLeft}>
            <NoteSelector
              value={displayMode}
              options={displayModeOptions}
              onSelect={setDisplayMode}
            />
            <NoteSelector
              value={variant}
              options={variantOptions}
              onSelect={(next) => {
                setVariant(next);
                if (next === "snippet") {
                  setWrapLines(true);
                }
              }}
            />
            {!isMarkdown && !isSnippet ? (
              <IconButton
                icon="arrow-expand"
                size={18}
                iconColor={theme.colors.primary}
                onPress={openEditor}
                accessibilityLabel={t("modules:noteExpand")}
                style={styles.iconButton}
              />
            ) : null}
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

        {isMarkdown ? (
          <Pressable
            onPress={openEditor}
            style={[
              styles.preview,
              {
                minHeight: sizing.min,
                height: inputHeight,
                maxHeight: sizing.max,
                backgroundColor: theme.colors.tertiary,
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <NoteMarkdownPreview value={value} />
          </Pressable>
        ) : isSnippet ? (
          <Pressable
            onPress={openEditor}
            style={[
              styles.preview,
              {
                minHeight: sizing.min,
                height: inputHeight,
                maxHeight: sizing.max,
                backgroundColor: theme.colors.tertiary,
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <NoteCodePreview value={value} language={language} />
          </Pressable>
        ) : (
          editor
        )}
      </View>
    </ModuleContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  toolbar: {
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
  iconButton: {
    margin: 0,
  },
  input: {
    padding: 0,
  },
  inputContent: {
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "web" ? 10 : 8,
    lineHeight: 20,
    textAlignVertical: "top",
  },
  outline: {
    borderRadius: 8,
    borderWidth: 1,
  },
  preview: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
});

export default NoteModule;
