import { Product } from '../types.ts';
import { GOOGLE_SHEET_CSV_URL } from '../constants.ts';

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
    if (isNaN(price)) return null;

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
      isUpcoming: row.isUpcoming ? row.isUpcoming.toUpperCase() === 'TRUE' : false,
    };
  } catch (error) {
    console.error('Failed to parse a product row. Skipping row.', { row, error });
    return null;
  }
};

/**
 * The main service function to fetch and process product data.
 * It fetches the CSV from the configured Google Sheet URL via a CORS proxy.
 *
 * @returns A Promise that resolves to an array of `Product` objects.
 */
export const fetchProducts = async (): Promise<Product[]> => {
  const urlParams = new URLSearchParams(window.location.search);
  const csvUrl = urlParams.get('csv_url') || GOOGLE_SHEET_CSV_URL;

  if (!csvUrl) {
    throw new Error("Google Sheet CSV URL is not configured.");
  }
  
  // Using a CORS proxy to bypass browser security restrictions on cross-origin requests.
  // The Google Sheet is on 'docs.google.com', while the app is on a different domain.
  const proxyUrl = `https://proxy.cors.sh/${csvUrl}`;

  try {
    const response = await fetch(proxyUrl, {
      headers: {
        // A temporary public API key for the proxy service is required.
        'x-cors-api-key': 'temp_e008d5385d31542f7041a86b97036a1b',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet: ${response.status} ${response.statusText}. The CORS proxy might be down or the Sheet URL is incorrect.`);
    }
    const csvText = await response.text();
    if (!csvText) {
        return [];
    }
    const parsedData = parseCSV(csvText);
    const products = parsedData.map(mapRowToProduct).filter((p): p is Product => p !== null);
    
    return products;
  } catch (error) {
    console.error("Error fetching or processing product data:", error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        // This specific error often points to a network failure or the proxy itself being unreachable.
        throw new Error('Could not fetch product data. This is likely a network issue or a problem with the CORS proxy service. Please check your internet connection and try again.');
    }
    throw error; // Re-throw other errors
  }
};