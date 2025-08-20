import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { Product, RecentlyViewedContextType } from './types';
import { useProducts } from './ProductContext';

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const RECENTLY_VIEWED_STORAGE_KEY = 'recentlyViewedProductIds';
const MAX_RECENTLY_VIEWED = 8;

export const RecentlyViewedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewedItemIds, setViewedItemIds] = useState<string[]>(() => {
    try {
      const itemIds = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
      return itemIds ? JSON.parse(itemIds) : [];
    } catch (error) {
      console.error("Error reading recently viewed item IDs from localStorage", error);
      return [];
    }
  });

  const { products } = useProducts();

  useEffect(() => {
    try {
      localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(viewedItemIds));
    } catch (error) {
      console.error("Error saving recently viewed item IDs to localStorage", error);
    }
  }, [viewedItemIds]);
  
  const addRecentlyViewed = useCallback((productId: string) => {
    setViewedItemIds(prevIds => {
      // Remove the id if it already exists to move it to the front
      const filteredIds = prevIds.filter(id => id !== productId);
      // Add the new id to the front and cap the list length
      const newIds = [productId, ...filteredIds].slice(0, MAX_RECENTLY_VIEWED);
      return newIds;
    });
  }, []);

  const recentlyViewedProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }
    // Map IDs to full product objects, preserving the order of viewed IDs
    return viewedItemIds
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
  }, [viewedItemIds, products]);


  const contextValue = {
    recentlyViewedProducts,
    addRecentlyViewed,
  };

  return (
    <RecentlyViewedContext.Provider value={contextValue}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = (): RecentlyViewedContextType => {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};