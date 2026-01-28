import React from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";

import theme from "../../ui/theme";
import { useClipboardCopy } from "../../hooks/useClipboardCopy";
import { emitClipboardCopied } from "../../../infrastructure/events/clipboardBus";

type Props = {
  value: string;
  disabled?: boolean;
  margin?: number;
};

function CopyToClipboard({ value, disabled, margin }: Props) {
  const [icon, setIcon] = React.useState<"content-copy" | "check">(
    "content-copy",
  );
  const { copy } = useClipboardCopy();

  const iconTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (iconTimerRef.current) clearTimeout(iconTimerRef.current);
    };
  }, []);

  const copyToClipboard = async () => {
    if (iconTimerRef.current) clearTimeout(iconTimerRef.current);

    const { durationMs } = await copy(value);

    setIcon("check");
    iconTimerRef.current = setTimeout(() => setIcon("content-copy"), 1000);
    if (!durationMs || durationMs <= 0) return;
    emitClipboardCopied({
      durationMs,
      createdAt: Date.now(),
    });
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
