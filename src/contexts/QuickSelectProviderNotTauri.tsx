import React, { createContext, ReactNode, useContext, useState } from "react";
import ModulesType from "../types/ModulesType";

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

// Falls nicht in Tauri, wird einfach das children gerendert
export const QuickSelectProvider = ({ children }: Props) => {
  const [modules, setModules] = useState<ModulesType | null>(null);
  return (
    <QuickSelectContext.Provider value={{ modules, setModules }}>
      {children}
    </QuickSelectContext.Provider>
  );
};

// Exportiere einen leeren Hook, damit die Nutzung fehlschlägt, falls aufgerufen
export const useQuickSelect = () => {
  return useContext(QuickSelectContext) as QuickSelectContextType;
};