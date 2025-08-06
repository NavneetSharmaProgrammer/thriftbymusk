import { Product } from '../types.ts';
import { GOOGLE_SHEET_CSV_URL } from '../constants.ts';

const CACHE_KEY = 'productDataCache';
// Cache data for 15 minutes
const CACHE_DURATION_MS = 15 * 60 * 1000;

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

    const proxyUrl = `https://cors.eu.org/${csvUrl}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch Google Sheet: ${response.status} ${response.statusText}`);
    }
    const csvText = await response.text();
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
 * It uses a caching layer to improve performance and resilience.
 *
 * @returns A Promise that resolves to an array of `Product` objects.
 */
export const fetchProducts = async (): Promise<Product[]> => {
    // 1. Check cache first
    try {
        const cachedItem = localStorage.getItem(CACHE_KEY);
        if (cachedItem) {
            const { timestamp, products } = JSON.parse(cachedItem);
            // If cache is fresh, return it immediately
            if (Date.now() - timestamp < CACHE_DURATION_MS) {
                console.log("Serving products from fresh cache.");
                return products;
            }
        }
    } catch (e) {
        console.error("Failed to read from cache", e);
    }
    
    // 2. If cache is stale or missing, fetch from network
    try {
        console.log("Fetching products from network...");
        const networkProducts = await fetchAndProcessProducts();
        
        // Save fresh data to cache
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), products: networkProducts }));
            console.log("Product cache updated.");
        } catch (e) {
            console.error("Failed to write to cache", e);
        }
        
        return networkProducts;
    } catch (error) {
        console.error("Error fetching or processing product data:", error);
        
        // 3. On network error, try to serve stale cache as a fallback
        try {
            const cachedItem = localStorage.getItem(CACHE_KEY);
            if (cachedItem) {
                const { products } = JSON.parse(cachedItem);
                console.warn("Serving stale products from cache due to network error.");
                return products;
            }
        } catch (e) {
            console.error("Failed to read stale cache on network error", e);
        }

        // 4. If network fails and no cache exists, re-throw the error
        throw error;
    }
};