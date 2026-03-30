import { MD3Theme } from "react-native-paper";

export type AppColors = MD3Theme["colors"] & {
  warning: string;
  success: string;
};

export type AppTheme = Omit<MD3Theme, "colors"> & {
  colors: AppColors;
};
