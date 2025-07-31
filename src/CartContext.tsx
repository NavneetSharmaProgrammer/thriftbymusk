import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product, CartItem, CartContextType, CustomerDetails } from './types.ts';
import { INSTAGRAM_HANDLE } from './constants.ts';

// Create a React Context for the shopping cart.
// This will allow any component within its provider to access cart state and functions.
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * CartProvider is a component that wraps parts of the application
 * that need access to the shopping cart functionality.
 */
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State to hold the array of items in the cart.
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // State to control the visibility of the cart modal.
  const [isCartOpen, setIsCartOpen] = useState(false);
  // State to manage the display of a temporary notification (e.g., "Item added to bag").
  const [notification, setNotification] = useState<{ message: string } | null>(null);

  // Effect to automatically hide the notification after 3 seconds.
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      // Cleanup function to clear the timer if the component unmounts or notification changes.
      return () => clearTimeout(timer);
    }
  }, [notification]);

  /**
   * Adds a product to the cart.
   * It checks if the product is not sold and not already in the cart before adding.
   * @param product The product object to add.
   */
  const addToCart = (product: Product) => {
    if (!product.sold && !cartItems.some(item => item.id === product.id)) {
      setCartItems(prevItems => [...prevItems, { ...product }]);
      setNotification({ message: `${product.name} added to bag!` });
    }
  };

  /**
   * Removes a product from the cart by its ID.
   * @param productId The ID of the product to remove.
   */
  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  /**
   * Empties the shopping cart. Typically called after a successful order.
   */
  const clearCart = () => {
      setCartItems([]);
  };

  /**
   * Toggles the visibility of the cart modal.
   */
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  /**
   * Checks if a product is already in the cart.
   * @param productId The ID of the product to check.
   * @returns `true` if the product is in the cart, `false` otherwise.
   */
  const isProductInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId);
  };

  /**
   * Generates a detailed order summary string for all items in the cart.
   * @returns An object containing the formatted list of items and the formatted total price.
   */
  const getOrderSummary = () => {
    const itemsList = cartItems.map(item => {
        const itemPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(item.price);
        return `- Product: ${item.name}\n  ID: ${item.id}\n  Size: ${item.size}\n  Category: ${item.category}\n  Price: ${itemPrice}`;
    }).join('\n\n'); // Use double newline to separate items clearly

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    const formattedTotal = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(total);
    return { itemsList, formattedTotal };
  };
  
  /**
   * Generates a pre-filled WhatsApp message with the cart contents and customer details.
   * @returns An encoded URI component string for a WhatsApp link.
   */
  const getWhatsAppMessage = (customerDetails: CustomerDetails) => {
    const { itemsList, formattedTotal } = getOrderSummary();
    const header = "Hello Thrift by Musk! I'd like to place the following order:\n\n*ORDER SUMMARY*\n\n";
    
    const customerInfo = `\n\n*SHIPPING DETAILS*\nName: ${customerDetails.name}\nPhone: ${customerDetails.phone}\nAddress: ${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state} - ${customerDetails.pincode}`;

    const footer = `\n\n*Total:* ${formattedTotal}`;
    return encodeURIComponent(header + itemsList + customerInfo + footer);
  };
  
  /**
   * Generates a pre-filled Instagram DM text with the cart contents and customer details.
   * @returns An object with the link and the message body.
   */
  const getInstagramMessage = (customerDetails: CustomerDetails) => {
    const { itemsList, formattedTotal } = getOrderSummary();
    const header = `Hello! I'd like to place the following order:\n\nORDER SUMMARY\n\n`;
    
    const customerInfo = `\n\nSHIPPING DETAILS\nName: ${customerDetails.name}\nPhone: ${customerDetails.phone}\nAddress: ${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state} - ${customerDetails.pincode}`;
    
    const footer = `\n\nTotal: ${formattedTotal}`;
    const body = header + itemsList + customerInfo + footer;
    const link = `https://ig.me/m/${INSTAGRAM_HANDLE}`;
    return { link, body };
  };

  // The value object contains all the state and functions to be exposed by the context.
  const contextValue = { cartItems, isCartOpen, notification, addToCart, removeFromCart, clearCart, toggleCart, isProductInCart, getWhatsAppMessage, getInstagramMessage };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * A custom hook that provides a convenient way to access the CartContext.
 * It ensures that the hook is used within a component wrapped by CartProvider.
 * @returns The cart context object.
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};