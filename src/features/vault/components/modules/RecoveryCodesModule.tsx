import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Chip, Text, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import * as Clipboard from "expo-clipboard";

import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import ModuleContainer from "../ModuleContainer";
import Props from "../../model/ModuleProps";
import { useTheme } from "../../../../app/providers/ThemeProvider";

import RecoveryCodesModuleType from "../../model/modules/RecoveryCodesModuleType";
import ModulesEnum from "../../model/ModulesEnum";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";
import { useClipboardCopy } from "../../../../shared/hooks/useClipboardCopy";

function tokenize(input: string): string[] {
  return input
    .split(/[\s,;]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitKeepingRemainder(text: string): {
  tokens: string[];
  remainder: string;
} {
  if (!/[\s,;]/.test(text)) return { tokens: [], remainder: text };

  const m = text.match(/^(.*?)[\s,;]+([^ \t\r\n,;]*)$/);
  const remainder = m ? (m[2] ?? "") : "";

  const all = tokenize(text);
  const tokens =
    remainder && all.length > 0 && all[all.length - 1] === remainder
      ? all.slice(0, -1)
      : all;

  return { tokens, remainder };
}

function RecoveryCodesModule(props: RecoveryCodesModuleType & Props) {
  const didMount = useRef(false);
  const inputRef = useRef<any>(null);

  const { t } = useTranslation();
  const { theme } = useTheme();

  const { copy } = useClipboardCopy();

  const [input, setInput] = useState("");
  const [codes, setCodes] = useState(props.codes ?? []);
  const [isFocused, setIsFocused] = useState(false);

  // steuert, ob das Input überhaupt gerendert wird (gegen "leere Zeile")
  const [showInput, setShowInput] = useState(codes.length === 0);

  // Wenn wir showInput einschalten, wollen wir anschließend sicher fokusieren
  const pendingFocusRef = useRef(false);

  // Focus animation (0..1)
  const focusSv = useSharedValue(0);

  const existingSet = useMemo(() => new Set(codes.map((c) => c.code)), [codes]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const newModule: RecoveryCodesModuleType = {
      id: props.id,
      module: props.module,
      codes,
    };
    props.changeModule(newModule);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codes]);

  // Sobald showInput true ist und ein Fokus "pending" ist, fokusieren wir sauber.
  useEffect(() => {
    if (!showInput) return;
    if (!pendingFocusRef.current) return;

    // nächster Frame: Input ist sicher im Tree
    requestAnimationFrame(() => {
      inputRef.current?.focus?.();
      pendingFocusRef.current = false;
    });
  }, [showInput]);

  const addCodes = (list: string[]) => {
    if (list.length === 0) return;

    setCodes((prev) => {
      const set = new Set(prev.map((c) => c.code));
      const next = [...prev];

      for (const code of list) {
        if (!set.has(code)) {
          next.push({ code, used: false });
          set.add(code);
        }
      }
      return next;
    });
  };

  const removeCode = (code: string) =>
    setCodes((prev) => prev.filter((c) => c.code !== code));

  const onChangeText = (text: string) => {
    const { tokens, remainder } = splitKeepingRemainder(text);
    if (tokens.length > 0) addCodes(tokens);
    setInput(remainder);
  };

  const finalizeCurrent = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (!existingSet.has(trimmed)) {
      setCodes((prev) => [...prev, { code: trimmed, used: false }]);
    }
    setInput("");
  };

  const onKeyPress = ({ nativeEvent }: any) => {
    if (
      nativeEvent.key === "Backspace" &&
      input.length === 0 &&
      codes.length > 0
    ) {
      removeCode(codes[codes.length - 1].code);
    }
  };

  const onFocus = () => {
    setIsFocused(true);
    focusSv.value = withTiming(1, { duration: 140 });
  };

  const onBlur = () => {
    finalizeCurrent();
    setInput("");
    setIsFocused(false);

    // Input verstecken, wenn nix zu tippen ist (und Vault nicht leer ist)
    setShowInput(codes.length === 0);

    focusSv.value = withTiming(0, { duration: 140 });
  };

  // Border: nur Farbe animieren, NICHT Breite
  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusSv.value,
      [0, 1],
      [theme.colors.outline, theme.colors.primary],
    );
    return { borderColor, borderWidth: 1 };
  }, [theme.colors.outline, theme.colors.primary]);

  const handleWrapperPress = () => {
    // 1) Input anzeigen
    setShowInput(true);
    // 2) Fokus nach Render "nachziehen"
    pendingFocusRef.current = true;

    // Falls Input bereits gerendert ist (z.B. showInput true), direkt fokusieren
    requestAnimationFrame(() => inputRef.current?.focus?.());
  };

  const shouldRenderInput =
    showInput || isFocused || input.length > 0 || codes.length === 0;

  const toggleUsed = (code: string) => {
    setCodes((prev) =>
      prev.map((c) => (c.code === code ? { ...c, used: !c.used } : c)),
    );
  };

  return (
    <ModuleContainer
      id={props.id}
      title={t("modules:recoveryCodes")}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={MODULE_ICON[ModulesEnum.RECOVERY_CODES]}
      fastAccess={props.fastAccess}
    >
      <View style={{ gap: 8 }}>
        <Pressable onPress={handleWrapperPress}>
          <Animated.View
            style={[
              styles.outlined,
              { backgroundColor: "transparent" },
              animatedContainerStyle,
            ]}
          >
            <Animated.View
              style={styles.inlineWrap}
              layout={LinearTransition.duration(160)}
            >
              {codes.map((c) => (
                <Animated.View
                  key={c.code}
                  entering={FadeIn.duration(140)}
                  exiting={FadeOut.duration(120)}
                  layout={LinearTransition.duration(160)}
                >
                  <Chip
                    compact
                    selected={c.used}
                    icon={() => null}
                    showSelectedOverlay={true}
                    style={styles.chip}
                    textStyle={styles.chipText}
                    onPress={() => copy(c.code)}
                    onClose={() => removeCode(c.code)}
                    closeIcon="close"
                    onLongPress={() => toggleUsed(c.code)}
                    delayLongPress={300}
                  >
                    {c.code}
                  </Chip>
                </Animated.View>
              ))}

              {shouldRenderInput ? (
                <Animated.View
                  entering={FadeIn.duration(120)}
                  exiting={FadeOut.duration(120)}
                  layout={LinearTransition.duration(160)}
                >
                  <TextInput
                    autoFocus
                    ref={inputRef}
                    mode="outlined"
                    value={input}
                    onChangeText={onChangeText}
                    onKeyPress={onKeyPress}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder={
                      codes.length === 0
                        ? t("modules:recoveryCodesPlaceholder")
                        : ""
                    }
                    autoCapitalize="none"
                    autoCorrect={false}
                    scrollEnabled={false}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    style={styles.inlineInput}
                    contentStyle={styles.inlineInputContent}
                    theme={{ colors: { background: "transparent" } }}
                    outlineStyle={{ borderWidth: 0 }}
                  />
                </Animated.View>
              ) : null}
            </Animated.View>
          </Animated.View>
        </Pressable>

        <Text variant="bodySmall" style={{ opacity: 0.7 }}>
          {t("modules:recoveryCodesHelp")}
        </Text>
      </View>
    </ModuleContainer>
  );
}

const styles = StyleSheet.create({
  outlined: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minHeight: 46,
  },
  inlineWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  chip: {
    margin: 0,
    height: 26,
    paddingHorizontal: 0,
  },
  chipText: {
    fontSize: 12,
    lineHeight: 14,
  },
  inlineInput: {
    minWidth: 110,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 0,
    margin: 0,
    height: 28,
    borderWidth: 0,
  },
  inlineInputContent: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 28,
    fontSize: 14,
    lineHeight: 18,
  },
});

export default RecoveryCodesModule;
