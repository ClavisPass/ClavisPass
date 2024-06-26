import React from "react";
import { StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

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

  const [icon, setIcon] = React.useState("content-copy");

  const onToggleSnackBar = () => setVisible(!visible);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(props.value);
    setIcon("check");
    setTimeout(() => {
      setIcon("content-copy");
    }, 1000);
    onToggleSnackBar();
  };
  return (
    <IconButton
      icon={icon}
      iconColor={theme.colors.primary}
      size={20}
      onPress={copyToClipboard}
    />
  );
}

export default CopyToClipboard;
