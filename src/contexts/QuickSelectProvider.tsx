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
  PhysicalPosition,
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
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [positionX, setPositionX] = useState<number>(0);
  const [positionY, setPositionY] = useState<number>(0);

  const getInitialWindowState = async () => {
    try {
      // Fenstergröße abrufen
      const size = await appWindow.outerSize();
      setWidth(size.width);
      setHeight(size.height);

      // Fensterposition abrufen
      const position = await appWindow.outerPosition();
      setPositionX(position.x);
      setPositionY(position.y);
    } catch (error) {
      console.error("Failed to get initial window state:", error);
    }
  };

  useEffect(() => {
    // Initiale Fenstergröße und Position laden
    getInitialWindowState();
  }, []);

  useEffect(() => {
    if (modules != null) {
      // Wenn Module aktiv sind, spezielles Fensterverhalten setzen
      appWindow.setAlwaysOnTop(true);
      appWindow.setSize(new PhysicalSize(60, 180));
      appWindow.setPosition(new PhysicalPosition(0, positionY));
    } else {
      // Wenn Module nicht aktiv sind, ursprüngliche Fenstergröße und Position wiederherstellen
      appWindow.setAlwaysOnTop(false);
      if (width > 0 && height > 0) {
        appWindow.setSize(new PhysicalSize(width, height));
      }
      if (positionX !== 0 || positionY !== 0) {
        appWindow.setPosition(new PhysicalPosition(positionX, positionY));
      }
    }
  }, [modules, width, height, positionX, positionY]);

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