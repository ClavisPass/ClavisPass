import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import QuickSelect from "../components/QuickSelect";

import { getCurrentWindow, PhysicalPosition, PhysicalSize } from "@tauri-apps/api/window";
import isTauri from "../utils/isTauri";
import FastAccessType from "../types/FastAccessType";
const appWindow = getCurrentWindow();

interface QuickSelectContextType {
  fastAccess: FastAccessType;
  setFastAccess: (fastAccess: FastAccessType) => void;
}

export const QuickSelectContext = createContext<QuickSelectContextType | null>(
  null
);

type Props = {
  children: ReactNode;
};

export const QuickSelectProvider = ({ children }: Props) => {
  const [fastAccess, setFastAccess] = useState<FastAccessType>(null);
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
    if (isTauri()) {
      getInitialWindowState();
    }
  }, []);

  useEffect(() => {
    if (!isTauri()) return;
    
    if (fastAccess != null) {
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
  }, [fastAccess, width, height, positionX, positionY]);

  return (
    <QuickSelectContext.Provider value={{ fastAccess, setFastAccess }}>
      {fastAccess != null ? (
        <QuickSelect fastAccess={fastAccess} setFastAccess={setFastAccess} />
      ) : (
        children
      )}
    </QuickSelectContext.Provider>
  );
};

export const useQuickSelect = () => {
  return useContext(QuickSelectContext) as QuickSelectContextType;
};