import React from "react";
import { Chip } from "react-native-paper";

import AppIcon from "../icons/AppIcon";

type Props = React.ComponentProps<typeof Chip>;
type IconSource = Props["icon"];

function normalizeIcon(icon: IconSource): IconSource {
  if (typeof icon !== "string") return icon;

  return ({ color, size }: { color: string; size: number }) => (
    <AppIcon name={icon} size={size} color={color} />
  );
}

function AppChip({ icon, closeIcon, ...props }: Props) {
  return (
    <Chip
      {...props}
      icon={normalizeIcon(icon)}
      closeIcon={normalizeIcon(closeIcon)}
    />
  );
}

export default AppChip;
