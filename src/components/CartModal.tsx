import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { useCart } from '../CartContext.tsx';
import { CloseIcon, ShoppingBagIcon, CheckCircleIcon, WhatsAppIcon, InstagramIcon, LoadingIcon, ArrowLeftIcon } from './Icons.tsx';
import { formatGoogleDriveLink } from '../utils.ts';
import { CustomerDetails } from '../types.ts';
import { GOOGLE_APPS_SCRIPT_URL } from '../constants.ts';

type SubmissionStatus = 'idle' | 'submitting' | 'error';

/**
 * A modal component that displays the shopping cart.
 * It now features an integrated, multi-step checkout process and is fully theme-aware.
 * This component includes important accessibility features like focus trapping.
 */
const CartModal: React.FC = () => {
    const { 
        isCartOpen, toggleCart, cartItems, removeFromCart, clearCart,
        getWhatsAppMessage, getInstagramMessage, showNotification
    } = useCart();
    
    // State to manage the view within the modal ('cart', 'form', 'confirmation')
    const [view, setView] = useState('cart');
    // State for the customer details form
    const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
        name: '', phone: '', address: '', city: '', state: '', pincode: ''
    });
    // State to manage the automated form submission process.
    const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const modalRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Reset view and submission status whenever the modal is opened
    useEffect(() => {
        if (isCartOpen) {
            setView('cart');
            setSubmissionStatus('idle');
            setSubmissionError(null);
            setIsCopied(false);
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
    }, [isCartOpen, toggleCart, view, submissionStatus]);

    if (!isCartOpen) return null;

    // --- Discount & Total Calculations ---
    const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
    const DISCOUNT_THRESHOLD = 499;
    const DISCOUNT_PERCENTAGE = 0.20;
    
    let discount = 0;
    if (subtotal > DISCOUNT_THRESHOLD) {
        discount = subtotal * DISCOUNT_PERCENTAGE;
    }
    const finalTotal = subtotal - discount;

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
    
    const formattedSubtotal = formatCurrency(subtotal);
    const formattedDiscount = formatCurrency(discount);
    const formattedFinalTotal = formatCurrency(finalTotal);

    const FREE_SHIPPING_THRESHOLD = 999;
    const amountNeededForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

    // --- Event Handlers ---
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
    };
    
    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!GOOGLE_APPS_SCRIPT_URL) {
            setView('confirmation');
            return;
        }

        setSubmissionStatus('submitting');
        setSubmissionError(null);
        
        try {
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItems, customerDetails }),
            });
            
            if (response.ok) {
                 const result = await response.json();
                 if(result.result === 'success'){
                     setSubmissionStatus('idle');
                     setView('confirmation');
                 } else {
                     throw new Error(result.error || 'The script returned an unknown error.');
                 }
            } else {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Order submission failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setSubmissionError(`There was an issue submitting your details. Please try the manual options below. Error: ${errorMessage}`);
            setSubmissionStatus('error');
        }
    };


    const handleWhatsAppConfirm = () => {
        const message = getWhatsAppMessage(customerDetails);
        window.open(`https://wa.me/919760427922?text=${message}`, '_blank');
        clearCart();
        toggleCart();
        showNotification("Thank you! Please send the pre-filled message to confirm.");
    }
    
    const handleInstagramConfirm = () => {
        const { link, body } = getInstagramMessage(customerDetails);
        navigator.clipboard.writeText(body);
        setIsCopied(true);
        window.open(link, '_blank');
        showNotification("Order details copied! Paste them in your Instagram DM.");
    };

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
    
    const OrderSummary: React.FC = () => (
      <>
        <div className="flex justify-between items-center">
            <span className="font-medium">Subtotal</span>
            <span className="font-serif">{formattedSubtotal}</span>
        </div>
        {discount > 0 && (
            <div className="flex justify-between items-center text-[var(--color-success)]">
                <span className="font-medium">Discount (20%)</span>
                <span className="font-serif">- {formattedDiscount}</span>
            </div>
        )}
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--color-border)]">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-serif text-[var(--color-primary)]">{formattedFinalTotal}</span>
        </div>
      </>
    );

    // --- Main View Renderers ---
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
                                <p className="font-serif text-[var(--color-primary)] mt-1">{formatCurrency(item.price)}</p>
                                <button onClick={() => removeFromCart(item.id)} className="text-xs text-[var(--color-danger)] hover:underline mt-auto text-left w-fit">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-grow flex flex-col justify-center items-center text-center p-6">
                    <ShoppingBagIcon className="w-16 h-16 text-[var(--color-text-muted)] opacity-50 mb-4" />
                    <h3 className="font-semibold">Your bag is empty</h3>
                    <p className="text-[var(--color-text-secondary)] mt-2">Find a treasure worth collecting!</p>
                </div>
            )}
            {cartItems.length > 0 && (
                <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-alt)] space-y-4">
                    {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                        <div className="text-center text-sm text-[var(--color-text-secondary)] p-3 bg-[var(--color-surface)] rounded-md">
                            You're just <span className="font-bold text-[var(--color-primary)]">{formatCurrency(amountNeededForFreeShipping)}</span> away from free shipping!
                        </div>
                    )}
                    {subtotal >= FREE_SHIPPING_THRESHOLD && (
                        <div className="text-center text-sm font-semibold text-[var(--color-success)] p-3 bg-green-100/50 rounded-md flex items-center justify-center gap-2">
                            <CheckCircleIcon className="w-5 h-5"/>
                            Congratulations! You've qualified for free shipping.
                        </div>
                    )}
                    <OrderSummary />
                    <button onClick={() => setView('form')} className="btn btn-primary w-full">Proceed to Checkout</button>
                </div>
            )}
        </>
    );

    const renderFormView = () => (
        <>
            <ModalHeader title="Checkout" />
            <form ref={formRef} onSubmit={handleFormSubmit} className="flex-grow flex flex-col">
                <div className="overflow-y-auto p-6 space-y-4">
                    <button onClick={() => setView('cart')} type="button" className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-4">
                        <ArrowLeftIcon className="w-4 h-4" /> Back to Cart
                    </button>
                    <h3 className="font-semibold">Shipping Information</h3>
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
                <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-surface-alt)] mt-auto space-y-4">
                    <OrderSummary />
                    <button type="submit" className="btn btn-primary w-full" disabled={submissionStatus === 'submitting'}>
                        {submissionStatus === 'submitting' ? (
                            <span className="flex items-center justify-center gap-2"><LoadingIcon className="w-5 h-5"/> Saving Details...</span>
                        ) : 'Confirm & Proceed to Order'}
                    </button>
                    <p className="text-xs text-[var(--color-text-muted)] text-center">Your details will be saved, then you can confirm via DM. Shipping calculated upon confirmation. Payment via UPI/Bank Transfer.</p>
                </div>
            </form>
        </>
    );
    
    const renderConfirmationView = () => (
        <>
            <ModalHeader title="Confirm Order" />
            <div className="flex-grow flex flex-col p-6">
                <button onClick={() => setView('form')} type="button" className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-4">
                    <ArrowLeftIcon className="w-4 h-4" /> Edit Details
                </button>
                <div className="text-center flex-grow flex flex-col justify-center">
                    <CheckCircleIcon className="w-12 h-12 text-[var(--color-success)] mx-auto mb-3"/>
                    <h3 className="font-semibold">Details Saved!</h3>
                    <p className="text-[var(--color-text-secondary)] mt-1">Almost there! Just send your order on WhatsApp or Instagram to finalize.</p>
                </div>

                <div className="pt-6 space-y-4">
                    <button onClick={handleWhatsAppConfirm} className="btn w-full flex items-center justify-center gap-2" style={{backgroundColor: '#25D366', color: 'white', borderColor: '#25D366'}}>
                        <WhatsAppIcon className="w-5 h-5"/> Order via WhatsApp
                    </button>
                    <div className="text-center">
                        <button 
                            onClick={handleInstagramConfirm} 
                            className="btn w-full flex items-center justify-center gap-2" 
                            style={{background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', color: 'white', borderColor: 'transparent'}}
                        >
                           <InstagramIcon className="w-5 h-5" />
                           {isCopied ? 'Order Copied!' : 'Order via Instagram DM'}
                        </button>
                        <p className="text-xs text-[var(--color-text-muted)] mt-2">
                            {isCopied 
                                ? "We've copied your order. Paste it in your Instagram DM to confirm!" 
                                : "We'll copy your full order & open Instagram for you to paste."
                            }
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
    
    const renderSubmissionStatus = () => {
        if (submissionStatus === 'error') {
            return (
                <div className="flex flex-col items-center justify-center text-center p-6 h-full animate-fade-in">
                     <h3 className="font-serif font-bold text-[var(--color-danger)] mb-4">Order Submission Failed</h3>
                     <p className="text-[var(--color-text-secondary)] mt-2 mb-6">{submissionError}</p>
                     <div className="space-y-3 w-full max-w-xs">
                        <button onClick={handleFormSubmit} className="btn btn-primary w-full">Try Again</button>
                        <button onClick={() => setView('confirmation')} className="btn btn-secondary w-full">Order Manually Instead</button>
                     </div>
                </div>
            );
        }
        // While submitting
        return (
            <div className="flex flex-col items-center justify-center text-center p-6 h-full animate-fade-in">
                <LoadingIcon className="w-16 h-16 text-[var(--color-primary)] mb-4" />
                <h3 className="font-semibold">Submitting Your Order...</h3>
                <p className="text-[var(--color-text-secondary)]">Please wait a moment.</p>
            </div>
        );
    }

    const renderContent = () => {
        if (submissionStatus === 'submitting' || submissionStatus === 'error') {
            return (
                <>
                    <ModalHeader title={submissionStatus === 'error' ? 'Error' : 'Processing'} />
                    {renderSubmissionStatus()}
                </>
            );
        }
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