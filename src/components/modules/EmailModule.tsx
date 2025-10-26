import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  LayoutChangeEvent,
} from "react-native";
import { Divider, TextInput } from "react-native-paper";

import EmailModuleType from "../../types/modules/EmailModuleType";
import ModuleContainer from "../container/ModuleContainer";
import Props from "../../types/ModuleProps";
import CopyToClipboard from "../buttons/CopyToClipboard";
import ModuleIconsEnum from "../../enums/ModuleIconsEnum";
import { useTheme } from "../../contexts/ThemeProvider";
import { useData } from "../../contexts/DataProvider";
import { ValuesListType } from "../../types/ValuesType";
import ModulesEnum from "../../enums/ModulesEnum";
import { ModuleType } from "../../types/ModulesType";
import validateEmail from "../../utils/regex/validateEmail";
import AnimatedPressable from "../AnimatedPressable";

const ITEM_HEIGHT = 44;
const MAX_VISIBLE_ITEMS = 6;

function EmailModule(props: EmailModuleType & Props) {
  const didMount = useRef(false);

  const data = useData();
  const { globalStyles, theme } = useTheme();

  const [value, setValue] = useState<string>(props.value ?? "");
  const [isValid, setIsValid] = useState<boolean>(false);

  const [isFocused, setIsFocused] = useState(false);
  const interactingListRef = useRef(false);
  const [inputHeight, setInputHeight] = useState<number>(40);

  const onInputLayout = (e: LayoutChangeEvent) => {
    const h = Math.round(e.nativeEvent.layout.height);
    if (h > 0) setInputHeight(h);
  };

  const knownEmails = useMemo(() => {
    const values = data?.data?.values;
    if (!values) return [];
    const out = new Set<string>();
    (values as ValuesListType).forEach((item) => {
      item.modules
        .filter(
          (m) => m.module === ModulesEnum.E_MAIL && typeof m.value === "string"
        )
        .forEach((m: ModuleType) => out.add(String(m.value)));
    });
    return Array.from(out);
  }, [data?.data?.values]);

  const baseItems = useMemo(
    () =>
      knownEmails
        .filter((v) => v.trim().length > 0)
        .map((v) => ({ id: v, title: v })),
    [knownEmails]
  );

  const filteredItems = useMemo(() => {
    const norm = value.trim().toLowerCase();
    if (!norm) return baseItems;
    return baseItems.filter((d) => {
      const t = d.title.toLowerCase();
      return t.includes(norm) && t !== norm;
    });
  }, [baseItems, value]);

  useEffect(() => {
    setIsValid(validateEmail(value ?? ""));
  }, [value]);

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

  const showSuggestions =
    (isFocused || interactingListRef.current) && filteredItems.length > 0;

  const dropdownMaxHeight =
    Math.min(filteredItems.length, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT;

  const containerStyle = StyleSheet.flatten([
    globalStyles.moduleView,
    { position: "relative", overflow: "visible" as ViewStyle["overflow"] },
  ]);

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

  const suggestionsOverlayStyle = StyleSheet.flatten([
    {
      position: "absolute" as const,
      top: inputHeight + 4,
      left: 0,
      right: 50,
      borderRadius: 12,
      backgroundColor: theme.colors.background,
      elevation: 6,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      overflow: "hidden" as ViewStyle["overflow"],
      zIndex: 1000,
    },
  ]);

  return (
    <ModuleContainer
      id={props.id}
      title={"E-Mail"}
      onDragStart={props.onDragStart}
      deleteModule={props.deleteModule}
      icon={ModuleIconsEnum.E_MAIL}
      fastAccess={props.fastAccess}
    >
      <View style={containerStyle}>
        <View style={leftColumnStyle}>
          <View
            onLayout={onInputLayout}
            style={[globalStyles.moduleView, { paddingLeft: 0 }]}
          >
            <View style={{ height: 40, flex: 1 }}>
              <TextInput
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setTimeout(() => {
                    if (!interactingListRef.current) setIsFocused(false);
                  }, 120);
                }}
                style={textInputStyle}
                contentStyle={{ color: theme.colors.onBackground }}
                outlineStyle={outlineStyle}
                value={value}
                mode="outlined"
                onChangeText={setValue}
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

          {/* OVERLAY: schwebt über der Spalte */}
          {showSuggestions && (
            <View
              style={suggestionsOverlayStyle}
              onStartShouldSetResponderCapture={() => {
                interactingListRef.current = true;
                return false;
              }}
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
                {filteredItems.map((item) => (
                  <>
                    <AnimatedPressable
                      key={item.id}
                      onPress={() => {
                        setValue(item.title);
                        interactingListRef.current = false;
                        setIsFocused(false);
                      }}
                      style={[
                        styles.item,
                        {
                          backgroundColor: theme.colors.background,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: theme.colors.onBackground,
                          fontSize: 14,
                          lineHeight: 20,
                        }}
                      >
                        {item.title}
                      </Text>
                    </AnimatedPressable>
                    <Divider />
                  </>
                ))}
              </ScrollView>
            </View>
          )}
          <View
            style={{ height: showSuggestions ? dropdownMaxHeight + 8 : 0 }}
          />
        </View>
      </View>
    </ModuleContainer>
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
