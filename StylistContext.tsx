import React, { createContext, useState, useContext, ReactNode } from 'react';

interface StylistContextType {
  isStylistOpen: boolean;
  toggleStylist: () => void;
}

const StylistContext = createContext<StylistContextType | undefined>(undefined);

export const StylistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isStylistOpen, setIsStylistOpen] = useState(false);

  const toggleStylist = () => {
    setIsStylistOpen(prev => !prev);
  };

  const contextValue = { isStylistOpen, toggleStylist };

  return (
    <StylistContext.Provider value={contextValue}>
      {children}
    </StylistContext.Provider>
  );
};

export const useStylist = (): StylistContextType => {
  const context = useContext(StylistContext);
  if (context === undefined) {
    throw new Error('useStylist must be used within a StylistProvider');
  }
  return context;
};