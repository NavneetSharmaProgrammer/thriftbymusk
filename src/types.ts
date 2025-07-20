/**
 * Represents a single product in the store.
 * This interface defines the complete data structure for a product item.
 */
export interface Product {
  id: string; // Unique identifier for the product (e.g., 'vintage-cream-blouse')
  name: string; // The display name of the product
  description: string; // A detailed description of the product, can be AI-generated
  originalDescription?: string; // The original keywords from the sheet, if AI was used
  price: number; // The price of the product in the base currency (e.g., INR)
  imageUrls: string[]; // An array of Google Drive links to product images
  videoUrl?: string; // An optional Google Drive link to a product video
  category: string; // The product category (e.g., 'Tops', 'Dresses')
  brand: string; // The brand of the product (e.g., 'Zara', 'Vintage Find')
  size: string; // The size of the product (e.g., 'M', 'L')
  measurements: {
    bust: string; // Bust measurement (e.g., '36"')
    length: string; // Length measurement (e.g., '24"')
  };
  condition: string; // The condition of the item (e.g., 'Gently Used', 'New with Tags')
  sold: boolean; // Flag indicating if the product has been sold
  isUpcoming?: boolean; // Flag for products that are part of a future drop
}

/**
 * Represents an item that has been added to the shopping cart.
 * It extends the base Product type, as a cart item is essentially a product in the context of a cart.
 */
export interface CartItem extends Product {}

/**
 * Represents the customer's details collected during checkout.
 */
export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

/**
 * Defines the shape of the context provided by CartProvider.
 * This includes the cart's state and the functions to interact with it.
 */
export interface CartContextType {
  cartItems: CartItem[]; // The array of items currently in the cart
  isCartOpen: boolean; // A boolean to control the visibility of the cart modal
  notification: { message: string } | null; // Holds the message for the "Added to Cart" notification
  addToCart: (product: Product) => void; // Function to add a product to the cart
  removeFromCart: (productId: string) => void; // Function to remove a product from the cart by its ID
  clearCart: () => void; // Function to empty the cart after a successful order.
  toggleCart: () => void; // Function to open or close the cart modal
  isProductInCart: (productId:string) => boolean; // Function to check if a product is already in the cart
  getWhatsAppMessage: (customerDetails: CustomerDetails) => string; // Generates a pre-filled WhatsApp message
  getInstagramMessage: (customerDetails: CustomerDetails) => { link: string; body: string; }; // Generates a pre-filled Instagram DM
}

/**
 * Represents a single image item in the styling gallery.
 */
export interface GalleryItem {
  id: string; // A unique identifier for the gallery item
  url: string; // A Google Drive link to the image file
  caption?: string; // An optional caption for the image
}

/**
 * Defines the available theme names for the application.
 */
export type Theme = 'light' | 'dark' | 'sepia';

/**
 * Defines the shape of the context provided by ThemeProvider.
 */
export interface ThemeContextType {
  theme: Theme;
  cycleTheme: () => void;
}
