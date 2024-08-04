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

interface ThemeContextType {
  darkmode: boolean;
  setDarkmode: (darkmode: boolean) => void;
  theme: any;
  globalStyles: any;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: Props) => {
  const [darkmode, setDarkmode] = useState(false);
  const [theme, setTheme] = useState(lightTheme);

  const globalStyles = styles(theme.colors.elevation.level2);

  useEffect(() => {
    if (darkmode) {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }
  }, [darkmode]);

  return (
    <ThemeContext.Provider
      value={{ darkmode, setDarkmode, theme, globalStyles }}
    >
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext) as ThemeContextType;
};
