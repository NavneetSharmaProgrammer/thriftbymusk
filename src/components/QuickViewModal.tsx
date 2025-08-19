import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../CartContext';
import { formatGoogleDriveLink } from '../utils';
import { CloseIcon } from './Icons';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
    const [activeImageUrl, setActiveImageUrl] = useState('');
    const { addToCart, isProductInCart } = useCart();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (product) {
            setActiveImageUrl(product.imageUrls[0]);
        }
    }, [product]);

    useEffect(() => {
        if (!product) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [product, onClose]);

    if (!product) return null;
    
    const isInCart = isProductInCart(product.id);
    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', minimumFractionDigits: 0
    }).format(product.price);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-page-fade" 
            onClick={onClose} 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="quick-view-heading"
        >
            <div 
                ref={modalRef}
                className="w-full max-w-4xl max-h-[90vh] bg-[var(--color-surface)] rounded-lg shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden" 
                style={{ animation: 'fadeInScale 0.3s ease-out' }} 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Image Gallery */}
                <div className="w-full md:w-1/2 flex flex-col p-4 bg-[var(--color-surface-alt)] md:sticky top-0">
                    <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3">
                         <img 
                            src={formatGoogleDriveLink(activeImageUrl, 'image', { width: 600 })} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                         />
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {product.imageUrls.slice(0, 5).map((img, index) => (
                            <button 
                                key={`thumb-${index}`}
                                onClick={() => setActiveImageUrl(img)}
                                className={`thumbnail-button ${activeImageUrl === img ? 'active' : ''}`}
                                aria-label={`View image ${index + 1}`}
                            >
                                <img src={formatGoogleDriveLink(img, 'image', { width: 100 })} alt={`thumbnail ${index + 1}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div className="w-full md:w-1/2 flex flex-col p-4 md:p-6 md:overflow-y-auto">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-[var(--color-text-secondary)]">{product.category}</p>
                            <h2 id="quick-view-heading" className="mt-1 text-2xl md:text-3xl">{product.name}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]" aria-label="Close quick view">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <p className="text-3xl font-serif text-[var(--color-primary)] my-4">{formattedPrice}</p>
                    
                    <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                        {product.description.substring(0, 150)}{product.description.length > 150 ? '...' : ''}
                    </p>

                    <div className="my-4 space-y-2 text-sm">
                        <div className="flex justify-between border-b border-[var(--color-border)] py-2"><span className="text-[var(--color-text-secondary)]">Brand:</span> <span className="font-medium">{product.brand}</span></div>
                        <div className="flex justify-between border-b border-[var(--color-border)] py-2"><span className="text-[var(--color-text-secondary)]">Size:</span> <span className="font-medium">{product.size}</span></div>
                        <div className="flex justify-between border-b border-[var(--color-border)] py-2"><span className="text-[var(--color-text-secondary)]">Condition:</span> <span className="font-medium">{product.condition}</span></div>
                    </div>

                    <div className="mt-auto pt-4 space-y-3">
                        <button
                            onClick={() => addToCart(product)}
                            disabled={product.sold || isInCart}
                            className="w-full btn btn-primary"
                        >
                            {product.sold ? 'Sold Out' : isInCart ? 'In Cart' : 'Add to Cart'}
                        </button>
                        <Link to={`/product/${product.id}`} onClick={onClose} className="w-full btn btn-secondary">
                            View Full Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;