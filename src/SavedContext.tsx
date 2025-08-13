import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';
import { Product, SavedContextType } from './types';
import { useProducts } from './ProductContext';

const SavedContext = createContext<SavedContextType | undefined>(undefined);

const SAVED_ITEMS_STORAGE_KEY = 'savedItemIds';

export const SavedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedItemIds, setSavedItemIds] = useState<string[]>(() => {
    try {
      const itemIds = localStorage.getItem(SAVED_ITEMS_STORAGE_KEY);
      return itemIds ? JSON.parse(itemIds) : [];
    } catch (error) {
      console.error("Error reading saved item IDs from localStorage", error);
      return [];
    }
  });

  const { products } = useProducts();

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(savedItemIds));
    } catch (error) {
      console.error("Error saving item IDs to localStorage", error);
    }
  }, [savedItemIds]);

  const savedItems = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }
    // Map IDs to full product objects, preserving the order of saved IDs
    return savedItemIds
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
  }, [savedItemIds, products]);

  const saveItem = (productId: string) => {
    setSavedItemIds(prevIds => {
      if (!prevIds.includes(productId)) {
        return [...prevIds, productId];
      }
      return prevIds;
    });
  };

  const unsaveItem = (productId: string) => {
    setSavedItemIds(prevIds => prevIds.filter(id => id !== productId));
  };

  const isItemSaved = (productId: string) => {
    return savedItemIds.includes(productId);
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