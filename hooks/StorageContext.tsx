import React, { createContext, useState, useContext, useEffect } from "react";

interface StorageContextType {
  triggerReload: number;
  refreshStorage: () => void;
}

const StorageContext = createContext<StorageContextType>({
  triggerReload: 0,
  refreshStorage: () => {},
});

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [triggerReload, setTriggerReload] = useState(0);

  const refreshStorage = () => {
    setTriggerReload(prev => prev + 1);
  };

  return (
    <StorageContext.Provider value={{ triggerReload, refreshStorage }}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => useContext(StorageContext);
