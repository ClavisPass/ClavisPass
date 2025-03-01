import React, { createContext, ReactNode, useContext, useState } from "react";
import ModulesType from "../types/ModulesType";
import FastAccessType from "../types/FastAccessType";

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

// Falls nicht in Tauri, wird einfach das children gerendert
export const QuickSelectProvider = ({ children }: Props) => {
  const [fastAccess, setFastAccess] = useState<FastAccessType>(null);
  return (
    <QuickSelectContext.Provider value={{ fastAccess, setFastAccess }}>
      {children}
    </QuickSelectContext.Provider>
  );
};

// Exportiere einen leeren Hook, damit die Nutzung fehlschlägt, falls aufgerufen
export const useQuickSelect = () => {
  return useContext(QuickSelectContext) as QuickSelectContextType;
};