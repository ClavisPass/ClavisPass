import { TextInput } from "react-native-paper";
import { useTheme } from "../contexts/ThemeProvider";
import { useEffect, useState } from "react";
type Props = {
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
};
function PasswordTextbox(props: Props) {
  const { globalStyles, theme } = useTheme();
  const [eyeIcon, setEyeIcon] = useState("eye");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  useEffect(() => {
    if (secureTextEntry) {
      setEyeIcon("eye");
    } else {
      setEyeIcon("eye-off");
    }
  }, [secureTextEntry]);
  return (
    <TextInput
      placeholder={props.placeholder}
      outlineStyle={globalStyles.outlineStyle}
      style={globalStyles.textInputStyle}
      value={props.value}
      mode="outlined"
      onChangeText={(text) => props.setValue(text)}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
      autoComplete="password"
      textContentType="password"
      right={
        <TextInput.Icon
          icon={eyeIcon}
          color={theme.colors.primary}
          onPress={() => setSecureTextEntry(!secureTextEntry)}
        />
      }
    />
  );
}

export default PasswordTextbox;
