import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { CloseIcon, ShoppingBagIcon } from './Icons';
import { formatGoogleDriveLink } from '../utils';

/**
 * A modal component that displays the shopping cart.
 * It allows users to view their selected items and proceed to a dedicated checkout page.
 * This component includes important accessibility features like focus trapping.
 */
const CartModal: React.FC = () => {
    const { isCartOpen, toggleCart, cartItems, removeFromCart, getOrderSummary } = useCart();
    
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle accessibility (focus trapping, Escape key)
    useEffect(() => {
        if (!isCartOpen) return;
        const modalNode = modalRef.current;
        if (!modalNode) return;

        const previouslyFocusedElement = document.activeElement as HTMLElement;
        const focusableElements = modalNode.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        firstElement?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') toggleCart();
            if (event.key === 'Tab') {
                if (event.shiftKey) { 
                    if (document.activeElement === firstElement) { lastElement.focus(); event.preventDefault(); }
                } else { 
                    if (document.activeElement === lastElement) { firstElement.focus(); event.preventDefault(); }
                }
            }
        };

        modalNode.addEventListener('keydown', handleKeyDown);
        return () => {
            modalNode.removeEventListener('keydown', handleKeyDown);
            previouslyFocusedElement?.focus();
        };
    }, [isCartOpen, toggleCart]);

    if (!isCartOpen) return null;

    // --- Totals sourced from context ---
    const { subtotal, formattedSubtotal, formattedDiscount, formattedFinalTotal } = getOrderSummary();
    
    const FREE_SHIPPING_THRESHOLD = 999;
    const amountNeededForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

    // --- Reusable UI Components ---
    const ModalHeader: React.FC<{title: string}> = ({title}) => (
        <div className="flex justify-between items-center p-6 border-b border-[var(--color-border)]">
            <h2 id="cart-heading" className="font-serif font-bold flex items-center gap-2">
                <ShoppingBagIcon className="w-6 h-6" />
                {title}
            </h2>
            <button onClick={toggleCart} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors" aria-label="Close cart">
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>
    );

    const FreeShippingProgress: React.FC = () => (
        <div className="p-4 text-center text-sm bg-[var(--color-surface-alt)]">
            {amountNeededForFreeShipping > 0 ? (
                <p>Add <strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amountNeededForFreeShipping)}</strong> more to get <strong>FREE SHIPPING!</strong></p>
            ) : (
                <p>🎉 You've unlocked <strong>FREE SHIPPING!</strong></p>
            )}
            <div className="w-full bg-[var(--color-border)] rounded-full h-2.5 mt-2">
                <div className="bg-[var(--color-primary)] h-2.5 rounded-full" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}></div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 z-50 animate-page-fade" role="dialog" aria-modal="true" aria-labelledby="cart-heading">
            <div ref={modalRef} className="absolute inset-y-0 right-0 w-full max-w-md bg-[var(--color-surface)] shadow-2xl flex flex-col" style={{animation: 'slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'}}>
                <ModalHeader title="Your Shopping Bag" />
                {cartItems.length > 0 ? (
                    <>
                        <FreeShippingProgress />
                        <div className="flex-grow overflow-y-auto p-6">
                            <ul className="space-y-4">
                                {cartItems.map(item => (
                                    <li key={item.id} className="flex items-start gap-4">
                                        <img src={formatGoogleDriveLink(item.imageUrls[0], 'image', { width: 96 })} alt={item.name} className="w-24 h-24 object-cover rounded-md border border-[var(--color-border)]" />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold">{item.name}</h3>
                                            <p className="text-sm text-[var(--color-text-secondary)]">{item.size} / {item.brand}</p>
                                            <p className="font-serif text-lg mt-1">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(item.price)}</p>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors" aria-label={`Remove ${item.name} from cart`}>
                                            <CloseIcon className="w-5 h-5" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface)] space-y-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                                    <span>{formattedSubtotal}</span>
                                </div>
                                <div className="flex justify-between text-[var(--color-success)]">
                                    <span>Site-Wide 20% Sale Applied!</span>
                                    <span>-{formattedDiscount}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t border-dashed border-[var(--color-border)]">
                                    <span>Total</span>
                                    <span>{formattedFinalTotal}</span>
                                </div>
                            </div>
                            <Link to="/checkout" className="btn btn-primary w-full text-center" onClick={toggleCart}>
                                Proceed to Checkout
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                        <ShoppingBagIcon className="w-20 h-20 text-[var(--color-border)] mb-4" />
                        <h3 className="font-serif text-xl">Your bag is empty</h3>
                        <p className="text-[var(--color-text-secondary)] mt-2">Looks like you haven't found your treasure yet.</p>
                        <Link to="/shop" className="btn btn-primary mt-6" onClick={toggleCart}>Start Shopping</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;
