import React from "react";
import { IconButton } from "react-native-paper";

import AppIcon from "../icons/AppIcon";
import AppTooltip from "../tooltips/AppTooltip";

type TooltipIconButtonProps = React.ComponentProps<typeof IconButton> & {
  tooltip: string;
};

function TooltipIconButton({ tooltip, ...props }: TooltipIconButtonProps) {
  const icon =
    typeof props.icon === "string"
      ? ({ color, size }: { color: string; size: number }) => (
          <AppIcon name={props.icon as string} size={size} color={color} />
        )
      : props.icon;

  return (
    <AppTooltip title={tooltip}>
      <IconButton
        {...props}
        icon={icon}
        accessibilityLabel={props.accessibilityLabel ?? tooltip}
      />
    </AppTooltip>
  );
}

export default TooltipIconButton;
