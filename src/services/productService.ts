import { Product } from '../types.ts';
import { GOOGLE_SHEET_CSV_URL } from '../constants.ts';
import { GoogleGenAI } from "@google/genai";

// Safely access the API key from the environment to prevent build errors in browser-only contexts.
// The build environment (e.g., Vercel) is expected to replace `process.env.API_KEY`.
const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

// Initialize the Google GenAI client, only if an API key is provided.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

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
      originalDescription: row.description, // Store original for AI check
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
 * Generates a product description using the Gemini API if the provided description is just keywords.
 * @param product The product object.
 * @returns The same product, with an AI-enhanced description if applicable.
 */
const generateDescriptionIfNeeded = async (product: Product): Promise<Product> => {
  // Only generate if AI is enabled and the description is short (likely keywords).
  if (!ai || !product.originalDescription || product.originalDescription.length > 60) {
    return product;
  }

  try {
    const prompt = `You are a creative copywriter for "Thrift by Musk," a chic online vintage store. Your tone is stylish, warm, and highlights sustainability. Write an enticing product description (approx. 30-45 words) based on these details: Product Name: "${product.name}", Brand: "${product.brand}", Category: "${product.category}", Condition: "${product.condition}", and these keywords: "${product.originalDescription}". Do not repeat the product name.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const generatedText = response.text;

    if (generatedText) {
      return { ...product, description: generatedText.trim() };
    }
  } catch (error) {
    console.error(`Gemini API failed for product ${product.id}. Using original description.`, error);
  }
  
  // Return original product if AI fails or doesn't return text
  return product;
};

/**
 * The main service function to fetch, process, and enhance product data.
 * It fetches the CSV, parses it, and then uses AI to generate descriptions where needed.
 *
 * @returns A Promise that resolves to an array of `Product` objects.
 */
export const fetchProducts = async (): Promise<Product[]> => {
  const urlParams = new URLSearchParams(window.location.search);
  const csvUrl = urlParams.get('csv_url') || GOOGLE_SHEET_CSV_URL;

  if (!csvUrl) {
    throw new Error("Google Sheet CSV URL is not configured.");
  }
  
  try {
    // The 'allorigins.win' proxy is removed for a more direct and reliable fetch.
    // Google Sheets published as CSV are directly accessible via fetch.
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet: ${response.status} ${response.statusText}. Please ensure the sheet is published to the web and the link is correct.`);
    }
    const csvText = await response.text();
    if (!csvText) {
        return [];
    }
    const parsedData = parseCSV(csvText);
    const initialProducts = parsedData.map(mapRowToProduct).filter((p): p is Product => p !== null);

    // Enhance products with AI descriptions in parallel
    const enhancedProducts = await Promise.all(initialProducts.map(generateDescriptionIfNeeded));
    
    return enhancedProducts;
  } catch (error) {
    console.error("Error fetching or processing product data:", error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Could not fetch product data. This might be a network issue. Please check your internet connection.');
    }
    if (!ai && apiKey === undefined) {
      console.warn("AI features disabled: API_KEY environment variable is not set.");
    }
    throw error;
  }
};