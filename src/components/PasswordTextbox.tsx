import { TextInput } from "react-native-paper";
import { useTheme } from "../contexts/ThemeProvider";
import { useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
type Props = {
  placeholder?: string;
  value: string;
  setValue?: (value: string) => void;
  autofocus?: boolean;
  errorColor?: boolean;
  onSubmitEditing?: () => void;
  textInputRef?: any;
  setCapsLock?: (capsLock: boolean) => void;
};
function PasswordTextbox(props: Props) {
  const { globalStyles, theme } = useTheme();
  const [eyeIcon, setEyeIcon] = useState("eye");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const textInputRef = useRef<any>(null);

  const getTextInputRef = () => {
    return props.textInputRef ? props.textInputRef : textInputRef;
  };

  useEffect(() => {
    if (getTextInputRef().current && props.autofocus) {
      getTextInputRef().current.focus();
    }
  }, [props.autofocus]);

  useEffect(() => {
    if (secureTextEntry) {
      setEyeIcon("eye");
    } else {
      setEyeIcon("eye-off");
    }
  }, [secureTextEntry]);

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

  return (
    <View style={{ height: 40, flexGrow: 1 }}>
      <TextInput
        ref={getTextInputRef()}
        placeholder={props.placeholder}
        outlineStyle={[
          globalStyles.outlineStyle,
          props.errorColor ? { borderColor: theme.colors.error } : null,
        ]}
        style={globalStyles.textInputStyle}
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
            icon={eyeIcon}
            color={theme.colors.primary}
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          />
        }
      />
    </View>
  );
}

export default PasswordTextbox;
