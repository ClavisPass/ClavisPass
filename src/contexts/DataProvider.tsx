import React, { createContext, useState, useContext, ReactNode } from 'react';
import DataType from '../types/DataType';

interface DataContextType {
    data: DataType;
    setData: (data: DataType) => void;
}

export const DataContext = createContext<DataContextType | null>(null);

type Props = {
    children: ReactNode
}

export const DataProvider = ({ children }: Props) => {
    const [data, setData] = useState<DataType>(null);

    return (
        <DataContext.Provider value={{ data, setData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    return useContext(DataContext) as DataContextType;
};
