import React from "react";
import { IconButton } from "react-native-paper";

import * as Clipboard from "expo-clipboard";
import theme from "../../ui/theme";
import { View } from "react-native";

type Props = {
  value: string;
  disabled?: boolean;
  margin?: number;
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
    <View style={{ width: 48 }}>
      <IconButton
        animated
        icon={icon}
        iconColor={theme.colors.primary}
        size={20}
        onPress={copyToClipboard}
        disabled={props.disabled}
        style={{ margin: props.margin ?? 6 }}
      />
    </View>
  );
}

export default CopyToClipboard;
