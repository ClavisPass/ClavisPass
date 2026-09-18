import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  LayoutChangeEvent,
  Platform,
  Pressable,
  View,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
} from "react-native";
import { Divider, Portal, TextInput } from "react-native-paper";

import EmailModuleType from "../../model/modules/EmailModuleType";
import ModuleContainer from "../ModuleContainer";
import Props from "../../model/ModuleProps";
import CopyToClipboard from "../../../../shared/components/buttons/CopyToClipboard";
import { useTheme } from "../../../../app/providers/ThemeProvider";
import { ValuesListType } from "../../model/ValuesType";
import ModulesEnum from "../../model/ModulesEnum";
import { ModuleType } from "../../model/ModulesType";
import validateEmail from "../../utils/regex/validateEmail";
import AnimatedPressable from "../../../../shared/components/AnimatedPressable";
import { useTranslation } from "react-i18next";
import { useVault } from "../../../../app/providers/VaultProvider";
import { MODULE_ICON } from "../../model/ModuleIconsEnum";

const ITEM_HEIGHT = 44;
const MAX_VISIBLE_ITEMS = 4;
const MIN_QUERY_LENGTH = 2;

function EmailModule(props: EmailModuleType & Props) {
  const didMount = useRef(false);

  const vault = useVault();
  const { globalStyles, theme } = useTheme();
  const { t } = useTranslation();

  const [value, setValue] = useState<string>(props.value ?? "");
  const isValid = useMemo(() => validateEmail(value ?? ""), [value]);

  const [isFocused, setIsFocused] = useState(false);
  const interactingListRef = useRef(false);
  const [inputHeight, setInputHeight] = useState<number>(40);
  const inputAnchorRef = useRef<View>(null);
  const measureTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [suggestionsAnchor, setSuggestionsAnchor] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const windowSize = useWindowDimensions();

  useEffect(() => {
    setValue(props.value ?? "");
  }, [props.value]);

  const measureSuggestionsAnchor = () => {
    inputAnchorRef.current?.measureInWindow?.((x, y, width, height) => {
      if (width <= 0) return;
      setSuggestionsAnchor({
        x,
        y,
        width,
        height: Math.max(height, inputHeight),
      });
    });
  };

  const scheduleSuggestionsMeasure = () => {
    requestAnimationFrame(measureSuggestionsAnchor);
    measureTimersRef.current.forEach(clearTimeout);
    measureTimersRef.current = [80, 220].map((delay) =>
      setTimeout(measureSuggestionsAnchor, delay),
    );
  };

  const onInputLayout = (e: LayoutChangeEvent) => {
    const h = Math.round(e.nativeEvent.layout.height);
    if (h > 0) setInputHeight(h);
    scheduleSuggestionsMeasure();
  };

  const handleEmailChange = (nextValue: string) => {
    setValue(nextValue);
    setIsFocused(true);
    scheduleSuggestionsMeasure();
  };

  useEffect(() => {
    const didShow = Keyboard.addListener(
      "keyboardDidShow",
      scheduleSuggestionsMeasure,
    );
    const didHide = Keyboard.addListener(
      "keyboardDidHide",
      scheduleSuggestionsMeasure,
    );

    return () => {
      didShow.remove();
      didHide.remove();
      measureTimersRef.current.forEach(clearTimeout);
      measureTimersRef.current = [];
    };
  }, []);

  const vaultData = useMemo(() => {
    try {
      if (!vault.isUnlocked) return null;
      return vault.exportFullData();
    } catch {
      return null;
    }
  }, [vault.isUnlocked, vault.entries, vault.folders, vault.dirty]);

  const knownEmails = useMemo(() => {
    const values = vaultData?.values;
    if (!values) return [];
    const out = new Set<string>();
    (values as ValuesListType).forEach((item) => {
      item.modules
        .filter(
          (m) => m.module === ModulesEnum.E_MAIL && typeof m.value === "string",
        )
        .forEach((m: ModuleType) => out.add(String(m.value)));
    });
    return Array.from(out);
  }, [vaultData?.values]);

  const baseItems = useMemo(
    () =>
      knownEmails
        .filter((v) => v.trim().length > 0)
        .map((v) => ({ id: v, title: v })),
    [knownEmails],
  );

  const filteredItems = useMemo(() => {
    const norm = value.trim().toLowerCase();
    if (norm.length < MIN_QUERY_LENGTH) return [];

    return baseItems
      .map((item) => {
        const title = item.title.toLowerCase();
        if (title === norm || !title.includes(norm)) return null;

        const [localPart = "", domain = ""] = title.split("@");
        const score = title.startsWith(norm)
          ? 0
          : localPart.startsWith(norm)
            ? 1
            : domain.startsWith(norm.replace(/^@/, ""))
              ? 2
              : title.includes(`@${norm}`)
                ? 3
                : 4;

        return { ...item, score };
      })
      .filter((item): item is { id: string; title: string; score: number } =>
        Boolean(item),
      )
      .sort((a, b) => a.score - b.score || a.title.localeCompare(b.title))
      .slice(0, MAX_VISIBLE_ITEMS);
  }, [baseItems, value]);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    props.changeModule({
      id: props.id,
      module: props.module,
      value: value ?? "",
    });
  }, [value]);

  useEffect(() => {
    if (!isFocused) return;
    scheduleSuggestionsMeasure();
  }, [isFocused, value, windowSize.width, windowSize.height]);

  const showSuggestions =
    isFocused && filteredItems.length > 0 && suggestionsAnchor !== null;

  const dropdownMaxHeight =
    Math.min(filteredItems.length, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT;

  const containerStyle = StyleSheet.flatten([globalStyles.moduleView]);

  const leftColumnStyle = StyleSheet.flatten([
    {
      flex: 1,
      flexDirection: "column" as const,
      minWidth: 0 as const,
      position: "relative" as const,
    },
  ]);

  const outlineStyle = StyleSheet.flatten([
    globalStyles.outlineStyle,
    !isValid ? { borderColor: theme.colors.error } : null,
  ]);

  const textInputStyle = StyleSheet.flatten([globalStyles.textInputStyle]);
  const nativeSuggestionOffset =
    Platform.OS === "web" ? 0 : Math.ceil(inputHeight / 2) + 4;

  const suggestionsOverlayStyle = StyleSheet.flatten([
    {
      position: "absolute" as const,
      top:
        (suggestionsAnchor?.y ?? 0) +
        Math.max(suggestionsAnchor?.height ?? 0, inputHeight) +
        nativeSuggestionOffset +
        4,
      left: suggestionsAnchor?.x ?? 0,
      width: suggestionsAnchor?.width ?? 0,
      borderRadius: 12,
      backgroundColor: theme.colors.background,
      elevation: 6,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      overflow: "hidden" as const,
      zIndex: 1000,
    },
  ]);

  const suggestionsList = showSuggestions ? (
    <View
      style={suggestionsOverlayStyle}
      onStartShouldSetResponderCapture={() => {
        interactingListRef.current = true;
        return false;
      }}
      {...(Platform.OS === "web"
        ? ({
            onMouseDown: () => {
              interactingListRef.current = true;
            },
          } as any)
        : {})}
    >
      <ScrollView
        style={{ maxHeight: dropdownMaxHeight }}
        keyboardShouldPersistTaps="always"
        onTouchEnd={() =>
          setTimeout(() => (interactingListRef.current = false), 120)
        }
        onScrollBeginDrag={() => (interactingListRef.current = true)}
        onScrollEndDrag={() =>
          setTimeout(() => (interactingListRef.current = false), 120)
        }
        onMomentumScrollEnd={() =>
          setTimeout(() => (interactingListRef.current = false), 120)
        }
      >
        {filteredItems.map((item, index) => (
          <View key={item.id}>
            <AnimatedPressable
              borderless={false}
              hoverBackgroundColor="rgba(120, 127, 246, 0.12)"
              rippleColor="rgba(120, 127, 246, 0.22)"
              onPressIn={() => {
                interactingListRef.current = true;
              }}
              onPress={() => {
                setValue(item.title);
                interactingListRef.current = false;
                scheduleSuggestionsMeasure();
              }}
              style={[
                styles.item,
                {
                  backgroundColor: theme.colors.background,
                },
              ]}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: theme.colors.onBackground,
                  fontSize: 14,
                  lineHeight: 20,
                }}
              >
                {item.title}
              </Text>
            </AnimatedPressable>
            {index < filteredItems.length - 1 ? <Divider /> : null}
          </View>
        ))}
      </ScrollView>
    </View>
  ) : null;

  return (
    <>
      <ModuleContainer
        id={props.id}
        title={t("modules:email")}
        onDragStart={props.onDragStart}
        deleteModule={props.deleteModule}
        icon={MODULE_ICON[ModulesEnum.E_MAIL]}
        fastAccess={props.fastAccess}
      >
        <View style={containerStyle}>
          <View style={leftColumnStyle}>
            <View
              onLayout={onInputLayout}
              style={[globalStyles.moduleView, { paddingLeft: 0 }]}
            >
              <View
                ref={inputAnchorRef}
                collapsable={false}
                style={{ height: 40, flex: 1 }}
              >
                <TextInput
                  autoFocus={props.autoFocus !== false && value === ""}
                  onFocus={() => {
                    setIsFocused(true);
                    scheduleSuggestionsMeasure();
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      if (!interactingListRef.current) setIsFocused(false);
                    }, 180);
                  }}
                  style={textInputStyle}
                  contentStyle={{ color: theme.colors.onBackground }}
                  outlineStyle={outlineStyle}
                  value={value}
                  mode="outlined"
                  onChangeText={handleEmailChange}
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  underlineColorAndroid="transparent"
                  placeholderTextColor={theme.colors.outline}
                />
              </View>
              <CopyToClipboard value={value} />
            </View>
          </View>
        </View>
      </ModuleContainer>
      <Portal>
        {Platform.OS !== "web" && showSuggestions ? (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => {
              interactingListRef.current = false;
              setIsFocused(false);
              Keyboard.dismiss();
            }}
          />
        ) : null}
        {suggestionsList}
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    height: ITEM_HEIGHT,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
});

export default EmailModule;
