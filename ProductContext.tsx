import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Product } from './types';
import { fetchProducts, NetworkErrorWithStaleData } from './services/productService';

/**
 * Defines the shape of the data provided by the ProductContext.
 */
interface ProductContextType {
  products: Product[];   // An array of all product objects.
  isLoading: boolean;    // True when products are being fetched, false otherwise.
  error: string | null;  // Holds an error message if the fetch fails.
  refetch: () => void; // A function to manually re-trigger the product fetch.
}

// Create the context with an initial undefined value.
const ProductContext = createContext<ProductContextType | undefined>(undefined);

/**
 * The ProductProvider component is a crucial part of the application's state management.
 * It is responsible for fetching, storing, and providing product data to the entire application.
 * It now integrates the AI description generation logic.
 */
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * The core data fetching logic, wrapped in `useCallback` for stability.
   * This function now handles the entire pipeline: fetch, parse, and AI-enhance.
   */
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null); // Reset error state on a new fetch attempt
      const fetchedProducts = await fetchProducts();

      if (fetchedProducts.length === 0 && !!new URL(window.location.href).searchParams.get("csv_url")) {
         setError("No products found. Check if the Google Sheet is empty or if the column headers are correct.");
      } else {
         setProducts(fetchedProducts);
      }
    } catch (e) {
      // If it's our custom error, we have stale data to show.
      if (e instanceof NetworkErrorWithStaleData) {
        setProducts(e.staleData);
        const errorMessage = "Couldn't refresh product list. Showing last available data.";
        setError(errorMessage); // Set a non-blocking warning
        console.warn(e.message, e);
      } else {
        // For all other errors, it's a hard failure.
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred while fetching products.';
        setError(errorMessage);
        console.error("Failed to load products:", e);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * An effect that runs once on component mount to perform the initial product load.
   */
  useEffect(() => {
    loadProducts();
  }, [loadProducts]); // The dependency array includes loadProducts.

  // The value object holds the state and the refetch function to be provided to consumers.
  const value = { products, isLoading, error, refetch: loadProducts };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

/**
 * A custom hook `useProducts` for easy consumption of the ProductContext.
 * It simplifies accessing product data and ensures the component is within a ProductProvider.
 */
export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};