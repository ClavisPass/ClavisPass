import React from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Button, Chip, Divider, Text, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../../../app/providers/ThemeProvider";
import Modal from "../../../../shared/components/modals/Modal";

type Props = {
  visible: boolean;
  tags: string[];
  suggestions: string[];
  setVisible: (visible: boolean) => void;
  onChangeTags: (tags: string[]) => void;
};

function tokenizeTags(input: string): string[] {
  return input
    .split(/[,\s;]+/g)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function splitKeepingRemainder(text: string): {
  tokens: string[];
  remainder: string;
} {
  if (!/[,\s;]/.test(text)) return { tokens: [], remainder: text };

  const match = text.match(/^(.*?)[,\s;]+([^ \t\r\n,;]*)$/);
  const remainder = match ? (match[2] ?? "") : "";
  const all = tokenizeTags(text);
  const tokens =
    remainder && all.length > 0 && all[all.length - 1] === remainder
      ? all.slice(0, -1)
      : all;

  return { tokens, remainder };
}

function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const next: string[] = [];

  tags.forEach((tag) => {
    const trimmed = tag.trim();
    const key = trimmed.toLocaleLowerCase();
    if (!trimmed || seen.has(key)) return;

    seen.add(key);
    next.push(trimmed);
  });

  return next;
}

function EntryTagsModal(props: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { height, width } = useWindowDimensions();
  const [input, setInput] = React.useState("");

  const selectedKeys = React.useMemo(
    () => new Set(props.tags.map((tag) => tag.toLocaleLowerCase())),
    [props.tags],
  );

  const filteredSuggestions = React.useMemo(
    () =>
      normalizeTags(props.suggestions).filter(
        (tag) => !selectedKeys.has(tag.toLocaleLowerCase()),
      ),
    [props.suggestions, selectedKeys],
  );

  React.useEffect(() => {
    if (!props.visible) setInput("");
  }, [props.visible]);

  const addTags = React.useCallback(
    (tags: string[]) => {
      const next = normalizeTags([...props.tags, ...tags]);
      props.onChangeTags(next);
    },
    [props],
  );

  const removeTag = (tag: string) => {
    props.onChangeTags(
      props.tags.filter(
        (current) =>
          current.trim().toLocaleLowerCase() !== tag.trim().toLocaleLowerCase(),
      ),
    );
  };

  const finalizeCurrent = () => {
    const nextTags = tokenizeTags(input);
    if (nextTags.length > 0) addTags(nextTags);
    setInput("");
  };

  const onChangeText = (text: string) => {
    const { tokens, remainder } = splitKeepingRemainder(text);
    if (tokens.length > 0) addTags(tokens);
    setInput(remainder);
  };

  const close = () => {
    finalizeCurrent();
    Keyboard.dismiss();
    props.setVisible(false);
  };

  const modalMaxHeight = Math.max(300, Math.min(520, height - 112));

  return (
    <Modal visible={props.visible} onDismiss={close}>
      <View
        style={{
          width: Math.min(360, width - 32),
          maxHeight: modalMaxHeight,
          borderRadius: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.outlineVariant,
          backgroundColor: theme.colors.background,
        }}
      >
        <View style={styles.header}>
          <Text variant="titleMedium" style={{ userSelect: "none" }}>
            {t("common:tags")}
          </Text>
        </View>

        <Divider />

        <ScrollView
          style={{ maxHeight: modalMaxHeight - 104 }}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator
        >
          <TextInput
            mode="outlined"
            value={input}
            onChangeText={onChangeText}
            onSubmitEditing={finalizeCurrent}
            blurOnSubmit={false}
            placeholder={t("common:tagPlaceholder")}
            autoCapitalize="none"
            autoCorrect={false}
            right={
              <TextInput.Icon icon="plus" onPress={finalizeCurrent} />
            }
            style={styles.input}
            outlineStyle={{ borderRadius: 12 }}
          />

          <View style={styles.section}>
            <Text variant="labelMedium" style={styles.sectionTitle}>
              {t("common:selectedTags")}
            </Text>
            {props.tags.length > 0 ? (
              <View style={styles.chipWrap}>
                {props.tags.map((tag) => (
                  <Chip
                    key={tag}
                    compact
                    closeIcon="close"
                    onClose={() => removeTag(tag)}
                    style={styles.chip}
                    textStyle={styles.chipText}
                  >
                    {tag}
                  </Chip>
                ))}
              </View>
            ) : (
              <Text variant="bodySmall" style={styles.emptyText}>
                {t("common:noTags")}
              </Text>
            )}
          </View>

          {filteredSuggestions.length > 0 ? (
            <View style={styles.section}>
              <Text variant="labelMedium" style={styles.sectionTitle}>
                {t("common:tagSuggestions")}
              </Text>
              <View style={styles.chipWrap}>
                {filteredSuggestions.map((tag) => (
                  <Pressable key={tag} onPress={() => addTags([tag])}>
                    <Chip
                      compact
                      icon="plus"
                      style={[styles.chip, styles.suggestionChip]}
                      textStyle={styles.chipText}
                    >
                      {tag}
                    </Chip>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>

        <Divider />

        <View style={styles.actions}>
          <Button
            compact
            mode="contained-tonal"
            style={{ borderRadius: 12, minWidth: 96 }}
            onPress={close}
          >
            {t("common:done")}
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
  },
  content: {
    gap: 14,
    padding: 14,
  },
  input: {
    minHeight: 42,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    opacity: 0.72,
    userSelect: "none",
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    margin: 0,
    minHeight: 28,
    borderRadius: 12,
  },
  suggestionChip: {
    backgroundColor: "transparent",
  },
  chipText: {
    fontSize: 12,
    lineHeight: 16,
  },
  emptyText: {
    opacity: 0.72,
    userSelect: "none",
  },
  actions: {
    alignItems: "flex-end",
    padding: 10,
  },
});

export { normalizeTags, tokenizeTags };
export default EntryTagsModal;
