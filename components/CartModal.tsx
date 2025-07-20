import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { useCart } from '../CartContext.tsx';
import { CloseIcon, ShoppingBagIcon, CheckCircleIcon, WhatsAppIcon, InstagramIcon, LoadingIcon, ArrowLeftIcon } from './Icons.tsx';
import { formatGoogleDriveLink } from '../utils.ts';
import { CustomerDetails } from '../types.ts';

/**
 * A modal component that displays the shopping cart.
 * It now features an integrated, multi-step checkout process and is fully theme-aware.
 * This component includes important accessibility features like focus trapping.
 */
const CartModal: React.FC = () => {
    const { 
        isCartOpen, toggleCart, cartItems, removeFromCart, clearCart,
        getWhatsAppMessage, getInstagramMessage
    } = useCart();
    
    // State to manage the view within the modal ('cart', 'form', 'confirmation')
    const [view, setView] = useState('cart');
    // State for the customer details form
    const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
        name: '', phone: '', address: '', city: '', state: '', pincode: ''
    });

    const modalRef = useRef<HTMLDivElement>(null);

    // Reset view to 'cart' whenever the modal is opened
    useEffect(() => {
        if (isCartOpen) {
            setView('cart');
        }
    }, [isCartOpen]);

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
    }, [isCartOpen, toggleCart, view]);

    if (!isCartOpen) return null;

    const total = cartItems.reduce((acc, item) => acc + item.price, 0);
    const formattedTotal = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(total);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        setView('confirmation');
    };

    const handleWhatsAppConfirm = () => {
        const message = getWhatsAppMessage(customerDetails);
        window.open(`https://wa.me/919760427922?text=${message}`, '_blank');
        clearCart();
        toggleCart();
    }
    
    const handleInstagramConfirm = () => {
        const { link, body } = getInstagramMessage(customerDetails);
        navigator.clipboard.writeText(body);
        window.open(link, '_blank');
        clearCart();
        toggleCart();
    };

    // Reusable Header Component
    const ModalHeader: React.FC<{title: string}> = ({title}) => (
        <div className="flex justify-between items-center p-6 border-b border-[var(--color-border)]">
            <h2 id="cart-heading" className="text-2xl font-serif font-bold flex items-center gap-2">
                <ShoppingBagIcon className="w-6 h-6" />
                {title}
            </h2>
            <button onClick={toggleCart} className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors" aria-label="Close cart">
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>
    );

    const renderCartView = () => (
        <>
            <ModalHeader title="Your Bag" />
            {cartItems.length > 0 ? (
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex gap-4 animate-fade-in" style={{animationDuration: '0.5s'}}>
                            <img src={formatGoogleDriveLink(item.imageUrls[0], 'image', { width: 100 })} alt={item.name} className="w-24 h-28 object-cover rounded-md bg-[var(--color-surface-alt)]" />
                            <div className="flex-grow flex flex-col">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-[var(--color-text-secondary)]">{item.brand} / {item.size}</p>
                                <p className="font-serif text-[var(--color-primary)] mt-1">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(item.price)}</p>
                                <button onClick={() => removeFromCart(item.id)} className="text-xs text-[var(--color-danger)] hover:underline mt-auto text-left w-fit">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-grow flex flex-col justify-center items-center text-center p-6">
                    <ShoppingBagIcon className="w-16 h-16 text-[var(--color-text-muted)] opacity-50 mb-4" />
                    <h3 className="text-xl font-semibold">Your bag is empty</h3>
                    <p className="text-[var(--color-text-secondary)] mt-2">Find a treasure worth collecting!</p>
                </div>
            )}
            {cartItems.length > 0 && (
                <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-serif text-[var(--color-primary)]">{formattedTotal}</span>
                    </div>
                    <button onClick={() => setView('form')} className="btn btn-primary w-full">Proceed to Checkout</button>
                </div>
            )}
        </>
    );

    const renderFormView = () => (
        <>
            <ModalHeader title="Checkout" />
            <form onSubmit={handleFormSubmit} className="flex-grow flex flex-col">
                <div className="overflow-y-auto p-6 space-y-4">
                    <button onClick={() => setView('cart')} type="button" className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-4">
                        <ArrowLeftIcon className="w-4 h-4" /> Back to Cart
                    </button>
                    <h3 className="font-semibold text-lg">Shipping Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <input type="text" name="name" placeholder="Full Name" value={customerDetails.name} onChange={handleFormChange} required className="w-full p-2 border border-[var(--color-border)] rounded-md bg-[var(--color-surface)]" />
                        <input type="tel" name="phone" placeholder="Phone Number" value={customerDetails.phone} onChange={handleFormChange} required className="w-full p-2 border border-[var(--color-border)] rounded-md bg-[var(--color-surface)]" />
                        <input type="text" name="address" placeholder="Address (House No, Street)" value={customerDetails.address} onChange={handleFormChange} required className="w-full p-2 border border-[var(--color-border)] rounded-md bg-[var(--color-surface)]" />
                        <div className="grid grid-cols-2 gap-4">
                           <input type="text" name="city" placeholder="City" value={customerDetails.city} onChange={handleFormChange} required className="w-full p-2 border border-[var(--color-border)] rounded-md bg-[var(--color-surface)]" />
                           <input type="text" name="state" placeholder="State" value={customerDetails.state} onChange={handleFormChange} required className="w-full p-2 border border-[var(--color-border)] rounded-md bg-[var(--color-surface)]" />
                        </div>
                        <input type="text" name="pincode" placeholder="Pincode" value={customerDetails.pincode} onChange={handleFormChange} required className="w-full p-2 border border-[var(--color-border)] rounded-md bg-[var(--color-surface)]" />
                    </div>
                </div>
                <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-alt)] mt-auto">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Order Total</span>
                        <span className="text-2xl font-serif text-[var(--color-primary)]">{formattedTotal}</span>
                    </div>
                    <button type="submit" className="btn btn-primary w-full">Continue to Final Step</button>
                    <p className="text-xs text-[var(--color-text-muted)] mt-3 text-center">Shipping calculated upon confirmation. Payment via UPI/Bank Transfer.</p>
                </div>
            </form>
        </>
    );
    
    const renderConfirmationView = () => (
        <>
            <ModalHeader title="Confirm Order" />
            <div className="flex-grow flex flex-col p-6 space-y-4">
                <button onClick={() => setView('form')} type="button" className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-4">
                    <ArrowLeftIcon className="w-4 h-4" /> Edit Details
                </button>
                 <h3 className="text-xl font-semibold text-center">Final Step: Send Your Order</h3>
                 <p className="text-[var(--color-text-secondary)] text-center">Please send us your complete order details using one of the options below to finalize your purchase.</p>

                <div className="pt-6 space-y-3">
                    <button onClick={handleWhatsAppConfirm} className="btn w-full flex items-center justify-center gap-2" style={{backgroundColor: '#25D366', color: 'white', borderColor: '#25D366'}}>
                        <WhatsAppIcon className="w-5 h-5"/> Order via WhatsApp
                    </button>
                    <button onClick={handleInstagramConfirm} className="btn w-full flex items-center justify-center gap-2" style={{background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', color: 'white', borderColor: 'transparent'}}>
                       <InstagramIcon className="w-5 h-5" /> Order via Instagram DM
                    </button>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-3 text-center">For DMs, your order will be copied to clipboard.</p>
            </div>
        </>
    );

    const renderContent = () => {
        switch (view) {
            case 'form': return renderFormView();
            case 'confirmation': return renderConfirmationView();
            case 'cart':
            default:
                return renderCartView();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end" onClick={toggleCart} role="dialog" aria-modal="true" aria-labelledby="cart-heading">
            <div ref={modalRef} className="w-full max-w-md bg-[var(--color-surface)] h-full flex flex-col shadow-2xl" style={{ animation: 'slideIn 0.3s ease-out' }} onClick={(e) => e.stopPropagation()}>
                <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
                {renderContent()}
            </div>
        </div>
    );
};
export default CartModal;