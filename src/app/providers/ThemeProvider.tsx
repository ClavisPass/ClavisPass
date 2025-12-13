import React, { createContext, useState, useContext, ReactNode, useMemo } from "react";
import { MD3Theme, PaperProvider } from "react-native-paper";
import lightTheme from "../../shared/ui/theme";
import darkTheme from "../../shared/ui/theme-darkmode";
import styles, { GlobalStyles } from "../../shared/ui/globalStyles";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  type Theme as NavigationTheme,
} from "@react-navigation/native";

import { useSetting } from "./SettingsProvider";

interface ThemeContextType {
  darkmode: boolean;
  setDarkmode: (darkmode: boolean) => void;
  theme: MD3Theme;
  navigationTheme: NavigationTheme;
  globalStyles: GlobalStyles;
  headerWhite: boolean;
  setHeaderWhite: (headerWhite: boolean) => void;
  headerSpacing: number;
  setHeaderSpacing: (headerSpacing: number) => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: Props) => {
  const {
    value: themePref,
    setValue: setThemePref,
    isReady,
  } = useSetting("THEME_PREFERENCE");

  const [headerWhite, setHeaderWhite] = useState(false);
  const [headerSpacing, setHeaderSpacing] = useState(0);

  const darkmode = themePref === "dark";
  const theme = darkmode ? darkTheme : lightTheme;

  const navigationTheme: NavigationTheme = useMemo(() => {
    const base = darkmode ? NavigationDarkTheme : NavigationLightTheme;
    return {
      ...base,
      dark: darkmode,
      colors: {
        ...base.colors,
        primary: theme.colors.primary,
        background: theme.colors.elevation.level2,
      },
    };
  }, [darkmode, theme]);

  const globalStyles = styles(
    theme.colors.elevation.level2,
    theme.colors.tertiary,
    theme.colors.secondaryContainer
  );

  const setDarkmode = (value: boolean) => {
    setThemePref(value ? "dark" : "light");
  };

  if (!isReady) return null;

  return (
    <ThemeContext.Provider
      value={{
        darkmode,
        setDarkmode,
        theme,
        navigationTheme,
        globalStyles,
        headerWhite,
        setHeaderWhite,
        headerSpacing,
        setHeaderSpacing,
      }}
    >
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
