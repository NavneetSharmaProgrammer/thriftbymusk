import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types.ts';
import { useCart } from '../CartContext.tsx';
import { useDrop } from '../DropContext.tsx';
import { useProducts } from '../ProductContext.tsx';
import { ArrowLeftIcon } from './Icons.tsx';
import { formatGoogleDriveLink } from '../utils.ts';
import ProductCard from './ProductCard.tsx';

/**
 * The Product Detail Page, which displays all information for a single product.
 * It features a gallery of product images/videos and detailed specifications.
 * It now includes a "You Might Also Like" section to improve product discovery.
 */
const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [activeImage, setActiveImage] = useState<string>('');
  const { addToCart, isProductInCart } = useCart();
  const { isDropLive } = useDrop();
  const { products, isLoading } = useProducts();

  useEffect(() => {
    if (products.length > 0 && id) {
        const foundProduct = products.find(p => p.id === id);
        setProduct(foundProduct);
        if (foundProduct?.imageUrls?.length) {
          setActiveImage(foundProduct.imageUrls[0]);
        }
    }
  }, [id, products]);
  
  const relatedProducts = useMemo(() => {
    if (!product || !products) return [];

    // Find other available products in the same category
    return products.filter(p => 
      p.category === product.category && // Same category
      p.id !== product.id &&             // Not the same product
      !p.sold                             // Must be available for purchase
    ).slice(0, 4); // Show up to 4 related products
  }, [product, products]);

  if (isLoading) {
      return (
        <div className="container mx-auto px-6 py-12 animate-pulse">
            <div className="mb-8 h-6 bg-[var(--color-surface-alt)] rounded w-32"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <div className="main-image-container bg-[var(--color-surface-alt)] shadow-lg"></div>
                    <div className="grid grid-cols-5 gap-4">
                        <div className="aspect-square bg-[var(--color-surface-alt)] rounded-lg"></div>
                        <div className="aspect-square bg-[var(--color-surface-alt)] rounded-lg"></div>
                        <div className="aspect-square bg-[var(--color-surface-alt)] rounded-lg"></div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="h-6 bg-[var(--color-surface-alt)] rounded w-1/4 mb-3"></div>
                    <div className="h-12 bg-[var(--color-surface)] rounded w-3/4 mb-4"></div>
                    <div className="h-10 bg-[var(--color-surface)] rounded w-1/3 mb-6"></div>
                    <div className="h-40 bg-[var(--color-surface-alt)] rounded mb-auto"></div>
                    <div className="h-14 bg-[var(--color-surface)] rounded w-full mt-8"></div>
                </div>
            </div>
        </div>
      )
  }

  if (!product) {
    return (
      <div className="text-center py-20 container mx-auto px-6 animate-fade-in">
        <h2 className="text-2xl text-[var(--color-text-secondary)] font-serif">Oops! Treasure not found.</h2>
        <p className="mt-4 text-[var(--color-text-secondary)]">This piece might have been snapped up already or never existed.</p>
        <Link to="/shop" className="btn btn-primary mt-8">Back to Shop</Link>
      </div>
    );
  }

  if (product.isUpcoming && !isDropLive) {
    return (
      <div className="text-center py-20 container mx-auto px-6 animate-fade-in">
        <h2 className="text-3xl font-serif text-[var(--color-primary)]">It's on the way!</h2>
        <p className="mt-4 text-[var(--color-text-secondary)] text-lg max-w-md mx-auto">
          This exclusive piece is part of our upcoming drop. Keep an eye on the countdown on our homepage!
        </p>
        <Link to="/" className="btn btn-secondary mt-8">Back to Homepage</Link>
      </div>
    );
  }
  
  const isInCart = isProductInCart(product.id);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in">
        <div className="mb-8">
            <Link to="/shop" className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors w-fit font-medium">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back to Shop</span>
            </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
                <div className="main-image-container shadow-lg">
                    {/* Request a larger, 800px wide image for the main view. */}
                    <img src={formatGoogleDriveLink(activeImage, 'image', { width: 800 })} alt={product.name} />
                     {product.sold && (
                        <div className="sold-out-ribbon rounded-lg">
                            <span>Sold Out</span>
                        </div>
                    )}
                </div>

                {(product.imageUrls.length > 1 || product.videoUrl) && (
                  <div className="grid grid-cols-5 gap-4">
                    {product.imageUrls.map((img, index) => (
                        <button 
                          key={index} 
                          onClick={() => setActiveImage(img)}
                          className={`thumbnail-button ${activeImage === img ? 'active' : ''}`}
                          aria-label={`View image ${index + 1}`}
                        >
                          {/* Request small 100px images for the thumbnails. */}
                          <img src={formatGoogleDriveLink(img, 'image', { width: 100 })} alt={`thumbnail ${index + 1}`} />
                        </button>
                    ))}
                  </div>
                )}
                
                {product.videoUrl && (
                    <div className="aspect-video bg-[var(--color-surface-alt)] rounded-lg shadow-lg overflow-hidden mt-6">
                         <iframe
                            className="w-full h-full"
                            src={formatGoogleDriveLink(product.videoUrl, 'video')}
                            title={`Video for ${product.name}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
            </div>
            
            <div className="flex flex-col">
                <p className="text-sm text-[var(--color-text-secondary)]">{product.category}</p>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mt-1">{product.name}</h1>
                <p className="text-4xl font-serif text-[var(--color-primary)] my-4">{formattedPrice}</p>
                
                <div className="border-y border-[var(--color-border)] py-4 my-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Brand</span><span className="font-medium">{product.brand}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Size</span><span className="font-medium">{product.size}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Condition</span><span className="font-medium">{product.condition}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Bust</span><span className="font-medium">{product.measurements.bust}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Length</span><span className="font-medium">{product.measurements.length}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Stock</span>
                    {product.sold 
                        ? <span className="font-medium text-[var(--color-danger)]">Sold Out</span>
                        : <span className="font-medium text-[var(--color-success)]">Only 1 Available</span>
                    }
                  </div>
                </div>
                
                <div className="bg-[var(--color-surface)] p-4 rounded-lg space-y-4 border border-[var(--color-border)]">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Description</h3>
                    <p className="text-[var(--color-text-secondary)]">{product.description}</p>
                </div>
                
                <div className="mt-auto pt-8">
                   <button
                        onClick={() => addToCart(product)}
                        disabled={product.sold || isInCart}
                        className="w-full btn btn-primary text-xl text-center"
                    >
                        {product.sold ? 'Sold Out' : isInCart ? 'In Cart' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>

        {/* You Might Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 md:mt-24 pt-16 border-t border-[var(--color-border)]">
              <h2 className="text-3xl font-serif font-bold text-center mb-8">You Might Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {relatedProducts.map(relatedProduct => (
                      <ProductCard key={relatedProduct.id} product={relatedProduct} />
                  ))}
              </div>
          </div>
        )}
    </div>
  );
};

export default ProductDetailPage;
