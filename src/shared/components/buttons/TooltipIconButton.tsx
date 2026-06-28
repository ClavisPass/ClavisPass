import React from "react";
import { IconButton } from "react-native-paper";

import AppTooltip from "../tooltips/AppTooltip";

type TooltipIconButtonProps = React.ComponentProps<typeof IconButton> & {
  tooltip: string;
};

function TooltipIconButton({ tooltip, ...props }: TooltipIconButtonProps) {
  return (
    <AppTooltip title={tooltip}>
      <IconButton
        {...props}
        accessibilityLabel={props.accessibilityLabel ?? tooltip}
      />
    </AppTooltip>
  );
}

export default TooltipIconButton;
