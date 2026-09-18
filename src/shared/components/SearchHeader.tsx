import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import Constants from "expo-constants";
import { IconButton, Searchbar, Text } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import Animated, {
  Easing,
  FadeInLeft,
  FadeOutLeft,
  Layout,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "../../app/providers/ThemeProvider";
import { useSetting } from "../../app/providers/SettingsProvider";
import {
  TITLEBAR_CONTROLS_WIDTH,
  TITLEBAR_HEIGHT,
} from "./titlebarMetrics";
import { resolveWindowControlsSide } from "../../infrastructure/platform/windowControls";

const searchTransition = Easing.out(Easing.cubic);

const compactSearchEnter = () => {
  "worklet";
  return {
    initialValues: {
      opacity: 0,
      transform: [{ translateX: 96 }, { scaleX: 0.72 }],
    },
    animations: {
      opacity: withTiming(1, { duration: 190, easing: searchTransition }),
      transform: [
        {
          translateX: withTiming(0, {
            duration: 190,
            easing: searchTransition,
          }),
        },
        {
          scaleX: withTiming(1, {
            duration: 190,
            easing: searchTransition,
          }),
        },
      ],
    },
  };
};

const compactSearchExit = () => {
  "worklet";
  return {
    initialValues: {
      opacity: 1,
      transform: [{ translateX: 0 }, { scaleX: 1 }],
    },
    animations: {
      opacity: withTiming(0, { duration: 140, easing: searchTransition }),
      transform: [
        {
          translateX: withTiming(96, {
            duration: 140,
            easing: searchTransition,
          }),
        },
        {
          scaleX: withTiming(0.72, {
            duration: 140,
            easing: searchTransition,
          }),
        },
      ],
    },
  };
};

const webNoDragStyle =
  Platform.OS === "web"
    ? ({
        WebkitAppRegion: "no-drag",
        appRegion: "no-drag",
      } as any)
    : null;

const webDragStyle =
  Platform.OS === "web"
    ? ({
        WebkitAppRegion: "drag",
        appRegion: "drag",
        cursor: "default",
      } as any)
    : null;

const webDragRegionProps =
  Platform.OS === "web" ? ({ dataSet: { tauriDragRegion: "" } } as any) : null;

type SearchHeaderProps = {
  idPrefix: string;
  title: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  onBack?: () => void;
  resetLabel?: string;
  marginBottom?: number;
};

export default function SearchHeader({
  idPrefix,
  title,
  placeholder,
  value,
  onChangeText,
  onBack,
  resetLabel = "Reset",
  marginBottom = 4,
}: SearchHeaderProps) {
  const { theme, darkmode } = useTheme();
  const { width } = useWindowDimensions();
  const isFocused = useIsFocused();
  const searchRef = useRef<any>(null);
  const suppressNextCompactSearchOpenRef = useRef(false);
  const [searchHeaderVisible, setSearchHeaderVisible] = useState(false);
  const { value: windowControlsStyle } = useSetting("WINDOW_CONTROLS_STYLE");

  const isCompactHeader = width < 600;
  const controlsLeft =
    resolveWindowControlsSide(windowControlsStyle) === "left";
  const wideSearchWidth = Math.min(340, Math.max(200, width * 0.32));

  useEffect(() => {
    if (!isCompactHeader) {
      setSearchHeaderVisible(false);
      return;
    }

    if (value.trim() !== "") setSearchHeaderVisible(true);
  }, [isCompactHeader, value]);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const styleId = `clavispass-${idPrefix}-search-selection-style`;
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      #${idPrefix}-compact-search,
      #${idPrefix}-compact-search *,
      #${idPrefix}-wide-search,
      #${idPrefix}-wide-search * {
        -webkit-user-select: none;
        user-select: none;
      }

      #${idPrefix}-compact-search input,
      #${idPrefix}-compact-search textarea,
      #${idPrefix}-wide-search input,
      #${idPrefix}-wide-search textarea {
        -webkit-user-select: text;
        user-select: text;
      }

      #${idPrefix}-compact-search input::placeholder,
      #${idPrefix}-compact-search textarea::placeholder,
      #${idPrefix}-wide-search input::placeholder,
      #${idPrefix}-wide-search textarea::placeholder {
        -webkit-user-select: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);
  }, [idPrefix]);

  const closeCompactSearchIfEmpty = useCallback(() => {
    if (!isCompactHeader) return;
    if (!isFocused) return;
    if (value.trim() !== "") return;

    if (Platform.OS === "web" && searchHeaderVisible) {
      suppressNextCompactSearchOpenRef.current = true;
      requestAnimationFrame(() => {
        suppressNextCompactSearchOpenRef.current = false;
      });
    }

    searchRef.current?.blur?.();
    setSearchHeaderVisible(false);
  }, [isCompactHeader, isFocused, searchHeaderVisible, value]);

  const openHeaderSearch = useCallback(() => {
    if (suppressNextCompactSearchOpenRef.current) {
      suppressNextCompactSearchOpenRef.current = false;
      return;
    }

    setSearchHeaderVisible(true);
    requestAnimationFrame(() => {
      searchRef.current?.focus?.();
    });
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const handleSearchShortcut = (event: KeyboardEvent) => {
      if (!isFocused) return;
      if (event.key === "Escape" && isCompactHeader && searchHeaderVisible) {
        event.preventDefault();
        event.stopPropagation();

        if (value.trim() === "") {
          setSearchHeaderVisible(false);
          return;
        }

        onChangeText("");
        requestAnimationFrame(() => {
          searchRef.current?.focus?.();
        });
        return;
      }

      if (!(event.ctrlKey || event.metaKey)) return;
      if (event.altKey) return;
      if (event.key.toLowerCase() !== "f") return;

      event.preventDefault();
      event.stopPropagation();

      if (isCompactHeader) {
        openHeaderSearch();
        return;
      }

      requestAnimationFrame(() => {
        searchRef.current?.focus?.();
      });
    };

    document.addEventListener("keydown", handleSearchShortcut, true);
    return () => {
      document.removeEventListener("keydown", handleSearchShortcut, true);
    };
  }, [
    isCompactHeader,
    isFocused,
    onChangeText,
    openHeaderSearch,
    searchHeaderVisible,
    value,
  ]);

  return (
    <View
      style={{
        height: 40 + Constants.statusBarHeight,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.colors?.background,
        marginBottom,
        borderRadius: 12,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        boxShadow: theme.colors?.shadow,
        justifyContent: "center",
        borderWidth: StyleSheet.hairlineWidth,
        borderTopWidth: 0,
        borderColor: darkmode ? theme.colors.outlineVariant : "white",
      }}
    >
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: Constants.statusBarHeight,
          paddingLeft:
            (Platform.OS === "web" &&
            TITLEBAR_HEIGHT > 0 &&
            isCompactHeader &&
            controlsLeft
              ? TITLEBAR_CONTROLS_WIDTH
              : 0) + (isCompactHeader && searchHeaderVisible ? 4 : 0),
          paddingRight:
            (Platform.OS === "web" && TITLEBAR_HEIGHT > 0 && !controlsLeft
              ? 104
              : 0) + (isCompactHeader && searchHeaderVisible ? 4 : 0),
          gap: 8,
          position: "relative",
          zIndex: 4,
        }}
      >
        {isCompactHeader && searchHeaderVisible ? (
          <Animated.View
            id={`${idPrefix}-compact-search`}
            entering={compactSearchEnter}
            exiting={compactSearchExit}
            layout={Layout.duration(180).easing(searchTransition)}
            style={[
              {
                flex: 1,
                height: 32,
                marginLeft: 0,
                overflow: "hidden",
                position: "relative",
                zIndex: 5,
              },
              webNoDragStyle,
            ]}
          >
            <View
              style={{
                height: 32,
                maxHeight: 32,
                flex: 1,
                borderRadius: 10,
                backgroundColor: darkmode
                  ? theme.colors.surfaceVariant
                  : theme.colors.surface,
                flexDirection: "row",
                alignItems: "center",
                overflow: "hidden",
                ...webNoDragStyle,
              }}
            >
              <TextInput
                ref={searchRef}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={value}
                onChangeText={onChangeText}
                onBlur={closeCompactSearchIfEmpty}
                returnKeyType="search"
                selectionColor={theme.colors.primary}
                style={
                  {
                    flex: 1,
                    height: 32,
                    minHeight: 32,
                    padding: 0,
                    paddingHorizontal: 8,
                    color: theme.colors.onSurface,
                    fontSize: 16,
                    lineHeight: 18,
                    textAlignVertical: "center",
                    includeFontPadding: false,
                    outlineStyle: "none",
                  } as any
                }
              />
              {value ? (
                <IconButton
                  accessibilityLabel={resetLabel}
                  icon="close"
                  iconColor={theme.colors.onSurfaceVariant}
                  size={20}
                  onPress={() => {
                    onChangeText("");
                    searchRef.current?.focus?.();
                  }}
                  style={{
                    margin: 0,
                    width: 28,
                    height: 32,
                    ...webNoDragStyle,
                  }}
                />
              ) : null}
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            id={`${idPrefix}-header-title-drag-region`}
            {...(isFocused && !searchHeaderVisible ? webDragRegionProps : null)}
            entering={FadeInLeft.duration(180).easing(searchTransition)}
            exiting={FadeOutLeft.duration(120).easing(searchTransition)}
            layout={Layout.duration(180).easing(searchTransition)}
            style={[
              {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                minWidth: 0,
                position: "relative",
                zIndex: 5,
              },
              isFocused && !searchHeaderVisible ? webDragStyle : null,
            ]}
          >
            {onBack ? (
              <IconButton
                icon="chevron-left"
                iconColor={theme.colors.primary}
                size={20}
                onPress={onBack}
                style={[
                  { margin: 0 },
                  webNoDragStyle,
                  Platform.OS === "web" ? ({ cursor: "pointer" } as any) : null,
                ]}
              />
            ) : null}
            <Text
              style={{
                color: theme.colors?.primary,
                userSelect: "none",
                fontSize: 15,
                marginLeft: onBack ? 0 : 16,
              }}
              variant="titleSmall"
              numberOfLines={1}
            >
              {title}
            </Text>
          </Animated.View>
        )}

        {!isCompactHeader ? (
          <View
            id={`${idPrefix}-wide-search`}
            style={{
              height: 34,
              width: wideSearchWidth,
              position: "relative",
              zIndex: 5,
              ...webNoDragStyle,
            }}
          >
            <Searchbar
              ref={searchRef}
              inputStyle={{
                height: 34,
                minHeight: 34,
                fontSize: 13,
                color: theme.colors.onSurface,
              }}
              style={{
                height: 34,
                width: "100%",
                borderRadius: 12,
                backgroundColor: darkmode
                  ? theme.colors.surfaceVariant
                  : theme.colors.surface,
                borderWidth: 1,
                borderColor: darkmode
                  ? theme.colors.outlineVariant
                  : theme.colors.outline,
                ...webNoDragStyle,
              }}
              placeholder={placeholder}
              onChangeText={onChangeText}
              value={value}
              loading={false}
              iconColor={theme.colors.onSurfaceVariant}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              right={() =>
                value ? (
                  <IconButton
                    accessibilityLabel={resetLabel}
                    icon="close"
                    iconColor={theme.colors.onSurfaceVariant}
                    size={18}
                    onPress={() => {
                      onChangeText("");
                      searchRef.current?.focus?.();
                    }}
                    style={{
                      marginVertical: 0,
                      marginLeft: 0,
                      marginRight: 1,
                      ...webNoDragStyle,
                    }}
                  />
                ) : null
              }
            />
          </View>
        ) : null}

        {isCompactHeader ? (
          !searchHeaderVisible ? (
            <IconButton
              accessibilityLabel={placeholder}
              icon="magnify"
              iconColor={theme.colors.primary}
              size={22}
              onPress={openHeaderSearch}
              style={{
                margin: 0,
                marginRight: 8,
                width: 36,
                height: 32,
                position: "relative",
                zIndex: 5,
                ...webNoDragStyle,
              }}
            />
          ) : null
        ) : (
          <View
            id={`${idPrefix}-header-right-drag-region`}
            {...(isFocused ? webDragRegionProps : null)}
            style={[
              {
                flex: 1,
                alignSelf: "stretch",
                minHeight: 34,
              },
              isFocused ? webDragStyle : null,
            ]}
          />
        )}
      </View>
    </View>
  );
}
