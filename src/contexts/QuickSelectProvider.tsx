import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import ModulesType from "../types/ModulesType";
import QuickSelect from "../components/QuickSelect";

import {
  PhysicalSize,
  appWindow,
} from "@tauri-apps/api/window";

interface QuickSelectContextType {
  modules: ModulesType | null;
  setModules: (modules: ModulesType | null) => void;
}

export const QuickSelectContext = createContext<QuickSelectContextType | null>(
  null
);

type Props = {
  children: ReactNode;
};

export const QuickSelectProvider = ({ children }: Props) => {
  const [modules, setModules] = useState<ModulesType | null>(null);
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(800);

  const getWindowSize = async () => {
    try {
      const size = await appWindow.outerSize();
      setWidth(size.width);
      setHeight(size.height);
    } catch (error) {
      console.error("Failed to get window size:", error);
    }
  };
  useEffect(() => {
    if (modules != null) {
      getWindowSize();
      appWindow.setAlwaysOnTop(true);
      appWindow.setSize(new PhysicalSize(400, 200));
    } else {
      appWindow.setAlwaysOnTop(false);
      appWindow.setSize(new PhysicalSize(width, height));
    }
  }, [modules]);

  return (
    <QuickSelectContext.Provider value={{ modules, setModules }}>
      {modules != null ? (
        <QuickSelect modules={modules} setModules={setModules} />
      ) : (
        children
      )}
    </QuickSelectContext.Provider>
  );
};

export const useQuickSelect = () => {
  return useContext(QuickSelectContext) as QuickSelectContextType;
};
