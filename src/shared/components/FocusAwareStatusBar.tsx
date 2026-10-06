import React from "react";
import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import type { StatusBarProps } from "expo-status-bar";

const FocusAwareStatusBar = (props: StatusBarProps) => {
  const isFocused = useIsFocused();

  if (!isFocused) return null;

  return <StatusBar {...props} />;
};

export default FocusAwareStatusBar;
