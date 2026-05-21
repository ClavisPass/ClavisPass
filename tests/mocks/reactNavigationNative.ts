export const DefaultTheme = {
  dark: false,
  colors: {
    primary: "#000",
    background: "#fff",
    card: "#fff",
    text: "#000",
    border: "#ddd",
    notification: "#000",
  },
};

export const DarkTheme = {
  ...DefaultTheme,
  dark: true,
};

export function useFocusEffect(callback: () => void | (() => void)) {
  React.useEffect(() => callback(), [callback]);
}

export function useScrollToTop() {}

export function useNavigation() {
  return {
    navigate() {},
    goBack() {},
    replace() {},
  };
}

export function useRoute() {
  return { params: {} };
}
import React from "react";
