import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product, SavedContextType } from './types.ts';

const SavedContext = createContext<SavedContextType | undefined>(undefined);

const SAVED_ITEMS_STORAGE_KEY = 'savedItems';

export const SavedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedItems, setSavedItems] = useState<Product[]>(() => {
    try {
      const items = localStorage.getItem(SAVED_ITEMS_STORAGE_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Error reading saved items from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(savedItems));
    } catch (error) {
      console.error("Error saving items to localStorage", error);
    }
  }, [savedItems]);

  const saveItem = (product: Product) => {
    setSavedItems(prevItems => {
      if (!prevItems.some(item => item.id === product.id)) {
        return [...prevItems, product];
      }
      return prevItems;
    });
  };

  const unsaveItem = (productId: string) => {
    setSavedItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const isItemSaved = (productId: string) => {
    return savedItems.some(item => item.id === productId);
  };

  const contextValue = {
    savedItems,
    saveItem,
    unsaveItem,
    isItemSaved,
  };

  return (
    <SavedContext.Provider value={contextValue}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = (): SavedContextType => {
  const context = useContext(SavedContext);
  if (context === undefined) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
};