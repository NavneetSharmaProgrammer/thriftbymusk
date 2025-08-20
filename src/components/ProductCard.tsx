import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../CartContext';
import { useSaved } from '../SavedContext';
import { formatGoogleDriveLink } from '../utils';
import { HeartIcon, EyeIcon } from './Icons';

interface ProductCardProps {
  product: Product;
  isFreshDrop?: boolean;
  onQuickView?: (product: Product) => void;
}

/**
 * A reusable component that displays a single product in a card format.
 * It now requests optimized images and uses theme variables for styling.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, isFreshDrop, onQuickView }) => {
  const { addToCart, isProductInCart } = useCart();
  const { saveItem, unsaveItem, isItemSaved } = useSaved();

  const isInCart = isProductInCart(product.id);
  const isSaved = isItemSaved(product.id);
  
  const salePrice = product.price * 0.8;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 0,
  }).format(product.price);
  
  const formattedSalePrice = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 0,
  }).format(salePrice);


  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page
    e.stopPropagation(); // Stop event bubbling
    isSaved ? unsaveItem(product.id) : saveItem(product.id);
  };
  
  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  }

  return (
    <div className="product-card bg-[var(--color-surface)] rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col">
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="product-card-image-container bg-[var(--color-surface-alt)]">
          {product.imageUrls[0] && (
            <img 
              // Request a smaller, 400px wide image for the thumbnail to improve performance.
              src={formatGoogleDriveLink(product.imageUrls[0], 'image', { width: 400 })} 
              alt={product.name} 
              loading="lazy"
              className="product-card-image front" 
            />
          )}
          {product.imageUrls[1] && (
            <img 
              src={formatGoogleDriveLink(product.imageUrls[1], 'image', { width: 400 })} 
              alt={`${product.name} alternate view`} 
              loading="lazy" 
              className="product-card-image back opacity-0" 
            />
          )}
        </div>

        <button
          onClick={handleSaveClick}
          className="absolute top-3 right-3 z-10 p-3 bg-[var(--color-surface)]/80 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-all duration-200 hover:scale-110"
          aria-label={isSaved ? 'Unsave item' : 'Save for later'}
        >
          <HeartIcon className={`w-5 h-5 ${isSaved ? 'text-[var(--color-danger)] fill-current' : 'fill-transparent'}`} />
        </button>
        
        {onQuickView && (
            <div 
                onClick={handleQuickViewClick}
                className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/60 to-transparent p-4 text-center cursor-pointer opacity-100 transition-opacity duration-300 md:opacity-0 group-hover:opacity-100"
                aria-label={`Quick view ${product.name}`}
            >
                <span className="inline-flex items-center gap-2 bg-[var(--color-surface)]/90 text-[var(--color-text-primary)] px-4 py-2 rounded-full font-semibold text-sm">
                    <EyeIcon className="w-5 h-5"/> Quick View
                </span>
            </div>
        )}
        
        {product.sold ? (
          <div className="sold-out-ribbon">
            <span>Sold Out</span>
          </div>
        ) : (
           <div className="absolute top-3 left-3 sale-badge text-xs px-3 py-1">20% OFF</div>
        )}
      </Link>
      
      <div className="p-6 text-center flex flex-col flex-grow">
        <div className="flex justify-center items-baseline gap-2 text-sm text-[var(--color-text-secondary)] mb-2">
            <span>{product.size}</span>
            <span className="text-[var(--color-border)]">&middot;</span>
            <span>{product.brand}</span>
        </div>
        <Link to={`/product/${product.id}`} className="flex-grow">
            <h3 className="font-semibold text-lg mb-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-[var(--color-text-muted)] mb-3">{product.condition}</p>
        
        <div className="flex justify-center items-baseline gap-2 mb-4 mt-auto">
            <p className="font-serif text-lg text-[var(--color-text-muted)] line-through">{formattedPrice}</p>
            <p className="font-serif text-xl text-[var(--color-primary)]">{formattedSalePrice}</p>
        </div>
        
        <div className="mt-auto">
          <button
            onClick={() => addToCart(product)}
            disabled={product.sold || isInCart}
            className="btn btn-primary w-full"
          >
            {product.sold ? 'Sold Out' : isInCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);