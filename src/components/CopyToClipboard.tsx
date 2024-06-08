import React from "react";
import { StyleSheet } from "react-native";
import { IconButton, Snackbar } from "react-native-paper";

import * as Clipboard from "expo-clipboard";
import theme from "../ui/theme";

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

type Props = {
  value: string;
};

function CopyToClipboard(props: Props) {
  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(props.value);
    onToggleSnackBar();
  };
  return (
    <>
      <IconButton icon="content-copy" iconColor={theme.colors.primary} size={20} onPress={copyToClipboard} />
      <Snackbar visible={visible} onDismiss={onDismissSnackBar} duration={1000}>
        Copied
      </Snackbar>
    </>
  );
}

export default CopyToClipboard;
