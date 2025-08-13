import { Product } from '../types.ts';
import { GOOGLE_SHEET_CSV_URL } from '../constants.ts';

const CACHE_KEY = 'productDataCache';
// Cache data for 15 minutes
const CACHE_DURATION_MS = 15 * 60 * 1000;

/**
 * Custom error class to signal that a network fetch failed,
 * but stale (cached) data is available to be used as a fallback.
 */
export class NetworkErrorWithStaleData extends Error {
  staleData: Product[];

  constructor(message: string, staleData: Product[]) {
    super(message);
    this.name = 'NetworkErrorWithStaleData';
    this.staleData = staleData;
  }
}

/**
 * A simple, lightweight CSV parser function.
 * This regex-based approach handles standard CSV formatting, including fields enclosed in
 * double quotes that may contain commas. It assumes fields do not contain newline characters.
 *
 * @param csv The raw CSV string data from the Google Sheet.
 * @returns An array of objects, where each object represents a row, keyed by header names.
 */
const parseCSV = (csv: string): Record<string, string>[] => {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].match(/(".*?"|[^",\r]+|(?<=,)(?=,)|(?<=,)$)(?=\s*,|\s*$)/g) || [];
    const cleanedValues = values.map(v => v.replace(/^"|"$/g, '').trim());

    if (cleanedValues.length === headers.length) {
      const row = headers.reduce((obj, header, index) => {
        obj[header] = cleanedValues[index];
        return obj;
      }, {} as Record<string, string>);
      rows.push(row);
    }
  }
  return rows;
};

/**
 * Maps a single row object from the parsed CSV to a structured `Product` object.
 * This function handles type conversions and structuring of nested objects.
 *
 * @param row A record object representing one row from the CSV.
 * @returns A fully typed `Product` object, or `null` if the row is invalid.
 */
const mapRowToProduct = (row: Record<string, string>): Product | null => {
  try {
    const price = parseInt(row.price, 10);
    if (isNaN(price) || !row.id) return null; // ID is mandatory

    // The sheet might have 'TRUE', 'FALSE', 'NOT' in uppercase, or be empty. Default to 'false'.
    const isUpcomingStatus = (row.isUpcoming || 'false').trim().toLowerCase();
    
    // Validate dropDate - should be a valid ISO string or undefined
    const dropDate = row.dropDate && !isNaN(new Date(row.dropDate).getTime()) ? new Date(row.dropDate).toISOString() : undefined;

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: price,
      imageUrls: row.imageUrls.split(',').map(url => url.trim()).filter(Boolean),
      videoUrl: row.videoUrl || undefined,
      category: row.category,
      brand: row.brand,
      size: row.size,
      measurements: { bust: row.bust, length: row.length },
      condition: row.condition,
      sold: row.sold.toUpperCase() === 'TRUE',
      isUpcoming: ['true', 'false', 'not'].includes(isUpcomingStatus) ? isUpcomingStatus : 'false',
      createdAt: row.createdAt || new Date(0).toISOString(),
      dropDate: dropDate,
    };
  } catch (error) {
    console.error('Failed to parse a product row. Skipping row.', { row, error });
    return null;
  }
};

/**
 * The internal fetching and processing logic.
 * @returns A Promise that resolves to an array of `Product` objects.
 */
const fetchAndProcessProducts = async (): Promise<Product[]> => {
    const urlParams = new URLSearchParams(window.location.search);
    const csvUrl = urlParams.get('csv_url') || GOOGLE_SHEET_CSV_URL;

    if (!csvUrl) {
        throw new Error("Google Sheet CSV URL is not configured.");
    }

    const response = await fetch(csvUrl, { cache: 'no-store' }); // Use no-store to bypass browser cache
    
    if (!response.ok) {
        throw new Error(`Failed to fetch Google Sheet: ${response.status} ${response.statusText}`);
    }
    const csvText = await response.text();
    // If the response is an HTML page (like a Google error page), it's not a valid CSV.
    if (csvText.trim().startsWith('<!DOCTYPE html>')) {
        throw new Error("Received an HTML page instead of a CSV. Check the Google Sheet URL and permissions.");
    }
    if (!csvText) {
        return [];
    }
    const parsedData = parseCSV(csvText);
    const products = parsedData.map(mapRowToProduct).filter((p): p is Product => p !== null);
    
    // Exclude products marked as 'not' to keep them hidden from the site.
    return products.filter(p => p.isUpcoming !== 'not');
};


/**
 * The main service function to fetch and process product data.
 * It implements a "stale-while-revalidate" caching strategy.
 *
 * @returns A Promise that resolves to an array of `Product` objects.
 */
export const fetchProducts = async (): Promise<Product[]> => {
    let cachedData: { timestamp: number; products: Product[] } | null = null;
    try {
        const cachedItem = localStorage.getItem(CACHE_KEY);
        if (cachedItem) {
            cachedData = JSON.parse(cachedItem);
        }
    } catch (e) {
        console.error("Failed to read from cache", e);
    }

    // If cache is fresh, return it immediately
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION_MS) {
        console.log("Serving products from fresh cache.");
        return cachedData.products;
    }

    // If cache is stale or missing, fetch from network
    try {
        console.log("Fetching products from network...");
        const networkProducts = await fetchAndProcessProducts();
        
        // Save fresh data to local storage
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), products: networkProducts }));
            console.log("Product cache updated.");
        } catch (e) {
            console.error("Failed to write to cache", e);
        }
        
        return networkProducts;
    } catch (networkError) {
        console.error("Network error fetching products:", networkError);
        
        // On network error, if we have ANY cached data (even stale), throw custom error with it.
        if (cachedData) {
            console.warn("Serving stale products from cache due to network error.");
            throw new NetworkErrorWithStaleData(
                `Network request failed, but stale data is available. Original error: ${networkError}`,
                cachedData.products
            );
        }

        // If network fails AND there is no cache at all, re-throw the original error.
        throw networkError;
    }
};