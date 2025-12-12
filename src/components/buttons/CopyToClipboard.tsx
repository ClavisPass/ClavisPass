import React from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import * as Clipboard from "expo-clipboard";

import theme from "../../ui/theme";
import { useSetting } from "../../contexts/SettingsProvider";

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

  const { value: copyDurationSeconds } = useSetting("COPY_DURATION");

  const iconTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const lastCopiedRef = React.useRef<string | null>(null);

  const onToggleSnackBar = () => setVisible((v) => !v);

  React.useEffect(() => {
    return () => {
      if (iconTimerRef.current) clearTimeout(iconTimerRef.current);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  const copyToClipboard = async () => {
    if (iconTimerRef.current) clearTimeout(iconTimerRef.current);
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);

    const durationMs = Math.max(
      0,
      Math.floor((copyDurationSeconds ?? 0) * 1000)
    );

    await Clipboard.setStringAsync(value);
    lastCopiedRef.current = value;

    setIcon("check");
    iconTimerRef.current = setTimeout(() => setIcon("content-copy"), 1000);

    if (durationMs > 0) {
      clearTimerRef.current = setTimeout(async () => {
        try {
          const current = await Clipboard.getStringAsync();
          if (current === lastCopiedRef.current) {
            await Clipboard.setStringAsync("");
          }
        } catch {}
      }, durationMs);
    }

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
      {/* SnackBar nutzt du aktuell nicht; falls du eine hast, hier rendern. */}
    </View>
  );
}

export default CopyToClipboard;
