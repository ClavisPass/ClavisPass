import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import DataType from "../types/DataType";
import { useToken } from "./CloudProvider";

export interface DataContextType {
  data: DataType;
  setData: (data: DataType) => void;
  backup: DataType;
  showSave: boolean;
  setShowSave: (showSave: boolean) => void;
  lastUpdated: string;
  setLastUpdated: (lastUpdated: string) => void;
}

export const DataContext = createContext<DataContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const DataProvider = ({ children }: Props) => {
  const [data, setData] = useState<DataType>(null);
  const [backup, setBackup] = useState<DataType>(null);

  const [showSave, setShowSave] = useState(false);

  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    if (backup === null && data !== null) setBackup({ ...data });
  }, [data]);

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        backup,
        showSave,
        setShowSave,
        lastUpdated,
        setLastUpdated,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext) as DataContextType;
};
