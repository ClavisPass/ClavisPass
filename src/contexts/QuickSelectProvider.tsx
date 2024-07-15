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
  const [width, setWidth] = useState(440);
  const [height, setHeight] = useState(750);

  const [positionX, setPostionx] = useState(0);
  const [positionY, setPostionY] = useState(0);

  const getWindowSize = async () => {
    try {
      const size = await appWindow.outerSize();
      setWidth(size.width);
      setHeight(size.height);
      const position = await appWindow.outerPosition();
      console.log(position);
      setPostionx(position.x);
      setPostionY(position.y);
      appWindow.setAlwaysOnTop(true);
      appWindow.setSize(new PhysicalSize(200, 400));
      appWindow.setPosition(new PhysicalPosition(0, position.y));
    } catch (error) {
      console.error("Failed to get window size:", error);
    }
  };
  useEffect(() => {
    if (modules != null) {
      getWindowSize();
    } else {
      appWindow.setAlwaysOnTop(false);
      appWindow.setSize(new PhysicalSize(width, height));
      if (positionY !== 0) {
        appWindow.setPosition(new PhysicalPosition(positionX, positionY));
      }
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
