import { View, StyleSheet } from "react-native";
import { TextInput, Text, Button } from "react-native-paper";
import Modal from "./Modal";
import { useState } from "react";
import { useTheme } from "../../contexts/ThemeProvider";
import { useToken } from "../../contexts/TokenProvider";
import isDropboxToken from "../../utils/regex/isDropboxToken";
import isGoogleDriveToken from "../../utils/regex/isGoogleDriveToken";
import { useTranslation } from "react-i18next";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

function EditTokenModal(props: Props) {
  const { globalStyles, theme } = useTheme();
  const { token, setToken } = useToken();

  const { t } = useTranslation();

  const [value, setValue] = useState("" + token);
  return (
    <Modal
      visible={props.visible}
      onDismiss={() => {
        props.setVisible(false);
      }}
    >
      <View
        style={{
          backgroundColor: "transparent",
          padding: 10,
          display: "flex",
          zIndex: 1,
          height: 120,
          width: "auto",
          borderRadius: 12,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.outlineVariant,
        }}
      >
        <Text>Access Token:</Text>
        <TextInput
          outlineStyle={globalStyles.outlineStyle}
          style={globalStyles.textInputStyle}
          value={value}
          mode="outlined"
          onChangeText={(text) => setValue(text)}
          autoCapitalize="none"
        />
        <Button
          disabled={
            isDropboxToken(value) ||
            isGoogleDriveToken(value) ||
            value === token
              ? false
              : true
          }
          onPress={() => {
            setToken(value);
            props.setVisible(false);
          }}
        >
          {t("common:change")}
        </Button>
      </View>
    </Modal>
  );
}

export default EditTokenModal;
