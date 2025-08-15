import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../CartContext';
import { useSaved } from '../SavedContext';
import { formatGoogleDriveLink } from '../utils';
import { HeartIcon } from './Icons';

interface ProductCardProps {
  product: Product;
  isFreshDrop?: boolean;
}

/**
 * A reusable component that displays a single product in a card format.
 * It now requests optimized images and uses theme variables for styling.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, isFreshDrop }) => {
  const { addToCart, isProductInCart } = useCart();
  const { saveItem, unsaveItem, isItemSaved } = useSaved();

  const isInCart = isProductInCart(product.id);
  const isSaved = isItemSaved(product.id);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(product.price);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page
    e.stopPropagation(); // Stop event bubbling
    isSaved ? unsaveItem(product.id) : saveItem(product.id);
  };

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
        
        {product.sold ? (
          <div className="sold-out-ribbon">
            <span>Sold Out</span>
          </div>
        ) : isFreshDrop ? (
          <div className="absolute top-3 left-3 bg-[var(--color-primary)] text-[var(--color-text-inverted)] text-xs font-semibold px-3 py-1 rounded-full shadow-sm animate-fade-in">🆕 Fresh Drop</div>
        ) : (
          !isInCart && <div className="absolute top-3 left-3 bg-[var(--color-surface)]/90 text-[var(--color-primary)] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">Only 1 Available</div>
        )}
      </Link>
      
      <div className="p-4 md:p-6 text-center flex flex-col flex-grow">
        <div className="flex justify-center items-baseline gap-2 text-sm text-[var(--color-text-secondary)] mb-2">
            <span>{product.size}</span>
            <span className="text-[var(--color-border)]">&middot;</span>
            <span>{product.brand}</span>
        </div>
        <Link to={`/product/${product.id}`} className="flex-grow">
            <h3 className="font-semibold text-base md:text-lg leading-tight mb-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-[var(--color-text-muted)] mb-3">{product.condition}</p>
        <p className="font-serif text-lg md:text-xl text-[var(--color-primary)] mb-4 mt-auto">{formattedPrice}</p>
        
        <div className="mt-auto">
          <button
            onClick={() => addToCart(product)}
            disabled={product.sold || isInCart}
            className="btn btn-primary w-full py-2 text-sm md:py-3 md:text-base"
          >
            {product.sold ? 'Sold Out' : isInCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);