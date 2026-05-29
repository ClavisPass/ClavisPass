import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import { useTheme } from "../../../../app/providers/ThemeProvider";

type Props = {
  value: string;
};

type InlinePart = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
};

function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > cursor) {
      parts.push({ text: text.slice(cursor, match.index) });
    }

    const token = match[0];
    if (token.startsWith("**")) {
      parts.push({ text: token.slice(2, -2), bold: true });
    } else if (token.startsWith("*")) {
      parts.push({ text: token.slice(1, -1), italic: true });
    } else {
      parts.push({ text: token.slice(1, -1), code: true });
    }

    cursor = match.index + token.length;
  }

  if (cursor < text.length) {
    parts.push({ text: text.slice(cursor) });
  }

  return parts.length ? parts : [{ text }];
}

function InlineText({ text }: { text: string }) {
  const { theme } = useTheme();
  return (
    <Text style={styles.inlineText}>
      {parseInline(text).map((part, index) => (
        <Text
          key={`${part.text}-${index}`}
          style={[
            part.bold ? styles.bold : null,
            part.italic ? styles.italic : null,
            part.code
              ? [
                  styles.inlineCode,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    color: theme.colors.primary,
                  },
                ]
              : null,
          ]}
        >
          {part.text}
        </Text>
      ))}
    </Text>
  );
}

export default function NoteMarkdownPreview({ value }: Props) {
  const { theme } = useTheme();
  const lines = value.split(/\r?\n/);
  const nodes: React.ReactNode[] = [];
  let codeLines: string[] = [];
  let inCodeBlock = false;

  const flushCodeBlock = (key: string) => {
    if (!codeLines.length) return;
    nodes.push(
      <View
        key={key}
        style={[
          styles.codeBlock,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <Text style={[styles.codeText, { color: theme.colors.onSurface }]}>
          {codeLines.join("\n")}
        </Text>
      </View>,
    );
    codeLines = [];
  };

  lines.forEach((line, index) => {
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock(`code-${index}`);
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLines = [];
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      nodes.push(
        <Text
          key={`heading-${index}`}
          variant={level === 1 ? "headlineSmall" : level === 2 ? "titleLarge" : "titleMedium"}
          style={styles.heading}
        >
          {heading[2]}
        </Text>,
      );
      return;
    }

    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    if (bullet) {
      nodes.push(
        <View key={`bullet-${index}`} style={styles.listRow}>
          <Text style={styles.listMarker}>-</Text>
          <View style={styles.listText}>
            <InlineText text={bullet[1]} />
          </View>
        </View>,
      );
      return;
    }

    const numbered = line.match(/^\s*(\d+)\.\s+(.*)$/);
    if (numbered) {
      nodes.push(
        <View key={`number-${index}`} style={styles.listRow}>
          <Text style={styles.listMarker}>{`${numbered[1]}.`}</Text>
          <View style={styles.listText}>
            <InlineText text={numbered[2]} />
          </View>
        </View>,
      );
      return;
    }

    if (!line.trim()) {
      nodes.push(<View key={`space-${index}`} style={styles.space} />);
      return;
    }

    nodes.push(<InlineText key={`paragraph-${index}`} text={line} />);
  });

  flushCodeBlock("code-final");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {nodes.length ? (
        nodes
      ) : (
        <Text style={{ color: theme.colors.onSurfaceVariant }}> </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  content: {
    padding: 16,
    gap: 6,
  },
  heading: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: "700",
  },
  inlineText: {
    lineHeight: 22,
  },
  bold: {
    fontWeight: "700",
  },
  italic: {
    fontStyle: "italic",
  },
  inlineCode: {
    fontFamily: "monospace",
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  codeBlock: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    marginVertical: 6,
  },
  codeText: {
    fontFamily: "monospace",
    lineHeight: 20,
  },
  listRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  listMarker: {
    width: 24,
    textAlign: "right",
  },
  listText: {
    flex: 1,
    minWidth: 0,
  },
  space: {
    height: 8,
  },
});
