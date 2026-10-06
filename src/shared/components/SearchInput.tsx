import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {
  Platform,
  StyleSheet,
  TextInput as NativeTextInput,
  View,
} from "react-native";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { IconButton, Searchbar } from "react-native-paper";
import { useTheme } from "../../app/providers/ThemeProvider";

type SearchInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  resetLabel: string;
  height?: number;
  fontSize?: number;
  compact?: boolean;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

const webNoDragStyle =
  Platform.OS === "web"
    ? ({
        WebkitAppRegion: "no-drag",
        appRegion: "no-drag",
      } as any)
    : null;

function focusRef(ref: React.RefObject<any>) {
  requestAnimationFrame(() => {
    ref.current?.focus?.();
  });
}

const SearchInput = forwardRef<any, SearchInputProps>(
  (
    {
      value,
      onChangeText,
      placeholder,
      resetLabel,
      height = 40,
      fontSize = 14,
      compact = false,
      onBlur,
      onSubmitEditing,
      style,
      inputStyle,
    },
    ref,
  ) => {
    const { theme, darkmode } = useTheme();
    const inputRef = useRef<any>(null);

    useImperativeHandle(ref, () => inputRef.current);

    const clear = () => {
      onChangeText("");
      focusRef(inputRef);
    };

    const fieldStyle = [
      styles.field,
      {
        height,
        minHeight: height,
        borderRadius: 12,
        backgroundColor: darkmode
          ? "rgba(36, 36, 36, 0.52)"
          : "rgba(255, 255, 255, 0.72)",
        borderColor: theme.colors.outlineVariant,
      },
      webNoDragStyle,
      style,
    ];

    if (compact) {
      return (
        <View style={fieldStyle}>
          <NativeTextInput
            ref={inputRef}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={value}
            onChangeText={onChangeText}
            onBlur={onBlur}
            onSubmitEditing={onSubmitEditing}
            returnKeyType="search"
            selectionColor={theme.colors.primary}
            style={[
              {
                flex: 1,
                height,
                minHeight: height,
                padding: 0,
                paddingHorizontal: 10,
                color: theme.colors.onSurface,
                fontSize,
                lineHeight: Math.max(18, fontSize + 4),
                textAlignVertical: "center",
                includeFontPadding: false,
                outlineStyle: "none",
              } as any,
              inputStyle,
            ]}
          />
          {value ? (
            <IconButton
              accessibilityLabel={resetLabel}
              icon="close"
              iconColor={theme.colors.onSurfaceVariant}
              size={Math.min(20, height - 10)}
              onPress={clear}
              style={{
                margin: 0,
                width: Math.max(28, height - 4),
                height,
                ...webNoDragStyle,
              }}
            />
          ) : null}
        </View>
      );
    }

    return (
      <Searchbar
        ref={inputRef}
        inputStyle={[
          {
            height,
            minHeight: height,
            fontSize,
            color: theme.colors.onSurface,
            paddingVertical: 0,
          },
          inputStyle,
        ]}
        style={fieldStyle}
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
              size={Math.min(18, height - 12)}
              onPress={clear}
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
    );
  },
);

SearchInput.displayName = "SearchInput";

const styles = StyleSheet.create({
  field: {
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default SearchInput;
