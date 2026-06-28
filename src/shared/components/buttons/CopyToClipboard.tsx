import React from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import theme from "../../ui/theme";
import { useClipboardCopy } from "../../hooks/useClipboardCopy";
import { emitClipboardCopied } from "../../../infrastructure/events/clipboardBus";
import { ClipboardContentKind } from "../../../infrastructure/clipboard/clipboardOwnership";
import TooltipIconButton from "./TooltipIconButton";

type Props = {
  value: string;
  disabled?: boolean;
  margin?: number;
  kind?: ClipboardContentKind;
  sensitive?: boolean;
  compact?: boolean;
};

function CopyToClipboard({
  value,
  disabled,
  margin,
  kind,
  sensitive,
  compact,
}: Props) {
  const { t } = useTranslation();
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

    const { durationMs } = await copy(value, { kind, sensitive });

    setIcon("check");
    iconTimerRef.current = setTimeout(() => setIcon("content-copy"), 1000);
    if (!durationMs || durationMs <= 0) return;
    emitClipboardCopied({
      durationMs,
      createdAt: Date.now(),
    });
  };

  return (
    <View style={{ width: compact ? 32 : 48 }}>
      <TooltipIconButton
        tooltip={t("common:copy")}
        animated
        icon={icon}
        iconColor={theme.colors.primary}
        size={20}
        onPress={copyToClipboard}
        disabled={disabled}
        style={{
          margin: margin ?? 6,
          ...(compact ? { width: 32, height: 32 } : null),
        }}
      />
    </View>
  );
}

export default CopyToClipboard;
