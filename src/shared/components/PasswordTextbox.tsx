import { TextInput } from "react-native-paper";
import { useTheme } from "../../app/providers/ThemeProvider";
import { useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useExclusiveSecretReveal } from "../hooks/useExclusiveSecretReveal";
type Props = {
  placeholder?: string;
  value: string;
  setValue?: (value: string) => void;
  autofocus?: boolean;
  errorColor?: boolean;
  onSubmitEditing?: () => void;
  textInputRef?: any;
  setCapsLock?: (capsLock: boolean) => void;
  exclusiveRevealId?: string;
};
function PasswordTextbox(props: Props) {
  const { t } = useTranslation();
  const { globalStyles, theme } = useTheme();
  const localReveal = useState(false);
  const exclusiveReveal = useExclusiveSecretReveal(
    props.exclusiveRevealId ?? "__password-textbox-disabled__",
  );
  const isExclusive = Boolean(props.exclusiveRevealId);
  const isRevealed = isExclusive ? exclusiveReveal.isRevealed : localReveal[0];
  const secureTextEntry = !isRevealed;

  const textInputRef = useRef<any>(null);

  const getTextInputRef = () => {
    return props.textInputRef ? props.textInputRef : textInputRef;
  };

  useEffect(() => {
    if (getTextInputRef().current && props.autofocus) {
      getTextInputRef().current.focus();
    }
  }, [props.autofocus]);

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      props.onSubmitEditing?.();
    }
    if (Platform.OS === "web") {
      if (e.getModifierState("CapsLock")) {
        props.setCapsLock?.(true);
      } else {
        props.setCapsLock?.(false);
      }
    }
  };

  const toggleReveal = () => {
    if (isExclusive) {
      exclusiveReveal.toggle();
      return;
    }

    localReveal[1]((current) => !current);
  };

  return (
    <View
      style={[
        { height: 40, flexGrow: 1 },
        Platform.OS === "web" ? ({ userSelect: "none" } as any) : null,
      ]}
    >
      <TextInput
        ref={getTextInputRef()}
        placeholder={props.placeholder}
        outlineStyle={[
          globalStyles.outlineStyle,
          props.errorColor ? { borderColor: theme.colors.error } : null,
        ]}
        style={[
          globalStyles.textInputStyle,
          Platform.OS === "web" ? ({ userSelect: "text" } as any) : null,
        ]}
        value={props.value}
        mode="outlined"
        onChangeText={(text) => props.setValue?.(text)}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoComplete="password"
        textContentType="password"
        onSubmitEditing={props.onSubmitEditing}
        onKeyPress={(e) => handleKeyPress(e)}
        right={
          <TextInput.Icon
            animated
            icon={secureTextEntry ? "eye" : "eye-off"}
            color={theme.colors.primary}
            accessibilityLabel={
              secureTextEntry
                ? t("common:showPassword")
                : t("common:hidePassword")
            }
            onPress={toggleReveal}
          />
        }
      />
    </View>
  );
}

export default PasswordTextbox;
