import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { PaperProvider } from "react-native-paper";
import lightTheme from "../ui/theme";
import darkTheme from "../ui/theme-darkmode";
import styles from "../ui/globalStyles";

import * as store from "../utils/store";

interface ThemeContextType {
  darkmode: boolean;
  setDarkmode: (darkmode: boolean) => void;
  theme: any;
  globalStyles: any;
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
  const [darkmode, setDarkmodeState] = useState(false);
  const [theme, setTheme] = useState(lightTheme);
  const [isReady, setIsReady] = useState(false);
  const [headerWhite, setHeaderWhite] = useState(false);
  const [headerSpacing, setHeaderSpacing] = useState(0);

  const globalStyles = styles(theme.colors.elevation.level2, theme.colors.tertiary);

  useEffect(() => {
    (async () => {
      const stored = await store.get("THEME_PREFERENCE");
      if (stored === "dark") {
        setDarkmodeState(true);
        setTheme(darkTheme);
      } else {
        setDarkmodeState(false);
        setTheme(lightTheme);
      }
      setIsReady(true);
    })();
  }, []);

  const setDarkmode = (value: boolean) => {
    setDarkmodeState(value);
    store.set("THEME_PREFERENCE", value ? "dark" : "light");
    setTheme(value ? darkTheme : lightTheme);
  };

  if (!isReady) return null;

  return (
    <ThemeContext.Provider
      value={{ darkmode, setDarkmode, theme, globalStyles, headerWhite, setHeaderWhite, headerSpacing, setHeaderSpacing }}
    >
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext) as ThemeContextType;
};
