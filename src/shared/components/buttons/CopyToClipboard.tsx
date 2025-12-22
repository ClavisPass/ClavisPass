import React from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";

import theme from "../../ui/theme";
import { useClipboardCopy } from "../../hooks/useClipboardCopy";

type Props = {
  value: string;
  disabled?: boolean;
  margin?: number;
};

function CopyToClipboard({ value, disabled, margin }: Props) {
  const [visible, setVisible] = React.useState(false);
  const [icon, setIcon] = React.useState<"content-copy" | "check">(
    "content-copy"
  );

  const { copy } = useClipboardCopy();

  const iconTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const onToggleSnackBar = () => setVisible((v) => !v);

  React.useEffect(() => {
    return () => {
      if (iconTimerRef.current) clearTimeout(iconTimerRef.current);
    };
  }, []);

  const copyToClipboard = async () => {
    if (iconTimerRef.current) clearTimeout(iconTimerRef.current);

    await copy(value);

    setIcon("check");
    iconTimerRef.current = setTimeout(() => setIcon("content-copy"), 1000);

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
        disabled={disabled}
        style={{ margin: margin ?? 6 }}
      />
    </View>
  );
}

export default CopyToClipboard;
