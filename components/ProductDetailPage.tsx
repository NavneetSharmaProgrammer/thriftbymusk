import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types.ts';
import { useCart } from '../CartContext.tsx';
import { useProducts } from '../ProductContext.tsx';
import { ArrowLeftIcon, ShareIcon } from './Icons.tsx';
import { formatGoogleDriveLink } from '../utils.ts';
import ProductCard from './ProductCard.tsx';
import ZoomableImage from './ZoomableImage.tsx';

/**
 * The Product Detail Page, which displays all information for a single product.
 * It features a gallery of product images/videos and detailed specifications.
 * It now includes a "You Might Also Like" section to improve product discovery.
 */
const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [activeMedia, setActiveMedia] = useState<{ type: 'image' | 'video', url: string }>({ type: 'image', url: '' });
  const { addToCart, isProductInCart, showNotification } = useCart();
  const { products, isLoading } = useProducts();

  // Effect to set the current product from the global products list
  useEffect(() => {
    if (products.length > 0 && id) {
        const foundProduct = products.find(p => p.id === id);
        setProduct(foundProduct);
        if (foundProduct?.imageUrls?.length) {
          setActiveMedia({ type: 'image', url: foundProduct.imageUrls[0] });
        }
    }
  }, [id, products]);

  // Effect to update document metadata for SEO and social sharing
  useEffect(() => {
    if (!product) return;

    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription?.getAttribute('content') || '';
    
    // Set new meta information
    const newTitle = `${product.name} - Thrift by Musk`;
    const newDescription = `Shop ${product.name}, a ${product.condition.toLowerCase()} ${product.category} from ${product.brand}. Available now at Thrift by Musk.`;
    const newImage = formatGoogleDriveLink(product.imageUrls[0], 'image');

    document.title = newTitle;
    metaDescription?.setAttribute('content', newDescription);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', newTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', newDescription);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', newImage);
    document.querySelector('meta[property="twitter:title"]')?.setAttribute('content', newTitle);
    document.querySelector('meta[property="twitter:description"]')?.setAttribute('content', newDescription);
    document.querySelector('meta[property="twitter:image"]')?.setAttribute('content', newImage);

    // Cleanup function to restore original meta tags on unmount
    return () => {
      document.title = originalTitle;
      metaDescription?.setAttribute('content', originalDescription);
       document.querySelector('meta[property="og:title"]')?.setAttribute('content', originalTitle);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', originalDescription);
      // You may want to reset the OG image to a default site-wide image here
    };
  }, [product]);
  
  const relatedProducts = useMemo(() => {
    if (!product || !products) return [];
    
    const now = new Date();
    // Find other available products in the same category
    return products.filter(p => 
      p.category === product.category && // Same category
      p.id !== product.id &&             // Not the same product
      !p.sold &&                         // Must be available for purchase
      (!p.dropDate || new Date(p.dropDate) <= now) // Must be live
    ).slice(0, 4); // Show up to 4 related products
  }, [product, products]);

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
        title: product.name,
        text: `Check out this find from Thrift by Musk: ${product.name}`,
        url: window.location.href,
    };
    // Use the Web Share API if available (mobile)
    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error('Error sharing:', err);
        }
    } else {
        // Fallback to copying the link to the clipboard (desktop)
        navigator.clipboard.writeText(window.location.href);
        showNotification('Link copied to clipboard!');
    }
  };


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

  const isProductLive = !product.dropDate || new Date(product.dropDate) <= new Date();
  if (!isProductLive) {
    return (
      <div className="text-center py-20 container mx-auto px-6 animate-fade-in">
        <h2 className="text-3xl font-serif text-[var(--color-primary)]">It's on the way!</h2>
        <p className="mt-4 text-[var(--color-text-secondary)] text-lg max-w-md mx-auto">
          This exclusive piece is part of an upcoming drop. Keep an eye on the countdown on our homepage!
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
    <>
      <div className="container mx-auto px-6 py-12 animate-fade-in">
          <div className="mb-8 hidden md:block">
              <Link to="/shop" className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors w-fit font-medium">
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span>Back to Shop</span>
              </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                  <div className="main-image-container shadow-lg">
                      {activeMedia.type === 'image' ? (
                         <ZoomableImage src={formatGoogleDriveLink(activeMedia.url, 'image', { width: 800 })} alt={product.name} />
                      ) : (
                         <iframe
                            className="w-full h-full"
                            src={formatGoogleDriveLink(activeMedia.url, 'video')}
                            title={`Video for ${product.name}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                      )}
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
                            key={`img-${index}`} 
                            onClick={() => setActiveMedia({ type: 'image', url: img })}
                            className={`thumbnail-button ${activeMedia.type === 'image' && activeMedia.url === img ? 'active' : ''}`}
                            aria-label={`View image ${index + 1}`}
                          >
                            <img src={formatGoogleDriveLink(img, 'image', { width: 100 })} alt={`thumbnail ${index + 1}`} />
                          </button>
                      ))}
                      {product.videoUrl && (
                          <button 
                            key="video"
                            onClick={() => setActiveMedia({ type: 'video', url: product.videoUrl as string })}
                             className={`thumbnail-button relative ${activeMedia.type === 'video' ? 'active' : ''}`}
                             aria-label="Play video"
                          >
                            <img src={formatGoogleDriveLink(product.imageUrls[0], 'image', { width: 100 })} alt="video thumbnail" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            </div>
                          </button>
                      )}
                    </div>
                  )}
              </div>
              
              <div className="flex flex-col">
                  <p className="text-sm text-[var(--color-text-secondary)]">{product.category}</p>
                  <h1 className="text-4xl md:text-5xl font-serif font-bold mt-1">{product.name}</h1>
                  
                  <div className="flex items-center justify-between my-4">
                      <p className="text-4xl font-serif text-[var(--color-primary)]">{formattedPrice}</p>
                      <button onClick={handleShare} className="p-3 rounded-full bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-border)] transition-colors" aria-label="Share this product">
                          <ShareIcon className="w-6 h-6" />
                      </button>
                  </div>
                  
                  <div className="border-y border-[var(--color-border)] py-4 my-4">
                      <h2 className="text-lg font-semibold mb-3">Specifications</h2>
                      <table className="w-full text-sm">
                          <tbody>
                              <tr className="border-b border-[var(--color-border)]"><td className="py-2 text-[var(--color-text-secondary)]">Brand</td><td className="py-2 font-medium text-right">{product.brand}</td></tr>
                              <tr className="border-b border-[var(--color-border)]"><td className="py-2 text-[var(--color-text-secondary)]">Size</td><td className="py-2 font-medium text-right">{product.size}</td></tr>
                              <tr className="border-b border-[var(--color-border)]"><td className="py-2 text-[var(--color-text-secondary)]">Condition</td><td className="py-2 font-medium text-right">{product.condition}</td></tr>
                              <tr className="border-b border-[var(--color-border)]"><td className="py-2 text-[var(--color-text-secondary)]">Bust</td><td className="py-2 font-medium text-right">{product.measurements.bust}</td></tr>
                              <tr><td className="py-2 text-[var(--color-text-secondary)]">Length</td><td className="py-2 font-medium text-right">{product.measurements.length}</td></tr>
                          </tbody>
                      </table>
                  </div>
                  
                  <div className="space-y-4">
                      <h2 className="text-lg font-semibold">Description</h2>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {relatedProducts.map(relatedProduct => (
                        <ProductCard key={relatedProduct.id} product={relatedProduct} />
                    ))}
                </div>
            </div>
          )}
      </div>
      
      {/* Sticky "Back to Shop" button for mobile */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-20 shadow-lg">
          <Link to="/shop" className="flex items-center gap-2 text-[var(--color-text-inverted)] bg-[var(--color-text-primary)] hover:opacity-90 transition-opacity w-fit font-medium px-6 py-3 rounded-full">
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Shop</span>
          </Link>
      </div>
    </>
  );
};

export default ProductDetailPage;