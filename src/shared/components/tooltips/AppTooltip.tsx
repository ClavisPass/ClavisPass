import React from "react";
import { Tooltip } from "react-native-paper";
import type { TooltipProps } from "react-native-paper";
import { useTheme } from "../../../app/providers/ThemeProvider";

type AppTooltipProps = Omit<TooltipProps, "theme"> & {
  children: React.ReactElement;
};

function AppTooltip(props: AppTooltipProps) {
  const { theme } = useTheme();

  return (
    <Tooltip
      {...props}
      leaveTouchDelay={props.leaveTouchDelay ?? 0}
      theme={{
        roundness: 12,
        fonts: {
          labelLarge: {
            ...theme.fonts.labelLarge,
            fontSize: 13,
            lineHeight: 17,
          },
        },
      }}
    >
      {props.children}
    </Tooltip>
  );
}

export default AppTooltip;
