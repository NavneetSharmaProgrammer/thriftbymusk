import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types.ts';
import { useCart } from '../CartContext.tsx';
import { formatGoogleDriveLink } from '../utils.ts';

interface ProductCardProps {
  product: Product;
}

/**
 * A reusable component that displays a single product in a card format.
 * It now requests optimized images and uses theme variables for styling.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isProductInCart } = useCart();
  const isInCart = isProductInCart(product.id);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(product.price);

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
        
        {product.sold ? (
          <div className="sold-out-ribbon">
            <span>Sold Out</span>
          </div>
        ) : (
          !isInCart && <div className="absolute top-3 right-3 bg-[var(--color-surface)]/90 text-[var(--color-primary)] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">Only 1 Available</div>
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
        <p className="font-serif text-xl text-[var(--color-primary)] mb-4 mt-auto">{formattedPrice}</p>
        
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