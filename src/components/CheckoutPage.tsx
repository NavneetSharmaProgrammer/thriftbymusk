import React, { useState, FormEvent, useEffect } from 'react';
import { useCart } from '../CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { CustomerDetails } from '../types';
import { GOOGLE_APPS_SCRIPT_URL } from '../constants';
import { CheckCircleIcon, WhatsAppIcon, InstagramIcon, LoadingIcon, ArrowLeftIcon, ShoppingBagIcon } from './Icons';
import { formatGoogleDriveLink } from '../utils';

type SubmissionStatus = 'idle' | 'submitting' | 'error';

const CheckoutPage: React.FC = () => {
    const { 
        cartItems, clearCart, getWhatsAppMessage, getInstagramMessage, 
        showNotification, getOrderSummary 
    } = useCart();
    const navigate = useNavigate();

    const [view, setView] = useState<'form' | 'confirmation'>('form');
    const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
        name: '', phone: '', address: '', city: '', state: '', pincode: ''
    });
    const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    
    // Redirect to shop if cart is empty
    useEffect(() => {
        if (cartItems.length === 0 && view !== 'confirmation') {
            navigate('/shop');
        }
    }, [cartItems, navigate, view]);
    
    const { formattedSubtotal, formattedDiscount, formattedFinalTotal } = getOrderSummary();

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        
        const orderPayload = JSON.stringify({ cartItems, customerDetails });

        try {
            await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                redirect: 'follow',
                body: orderPayload,
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            });
            setSubmissionStatus('idle');
            setView('confirmation');
        } catch (error) {
            console.error('Order submission failed:', error);
            setSubmissionError('An issue occurred while saving your details. Please use one of the manual order options below to complete your purchase.');
            setSubmissionStatus('error');
        }
    };

    const handleWhatsAppConfirm = () => {
        const message = getWhatsAppMessage(customerDetails);
        window.open(`https://wa.me/919760427922?text=${message}`, '_blank');
        clearCart();
        showNotification("Thank you! Please send the pre-filled message to confirm.");
    };
    
    const handleInstagramConfirm = () => {
        const { link, body } = getInstagramMessage(customerDetails);
        navigator.clipboard.writeText(body);
        setIsCopied(true);
        window.open(link, '_blank');
        showNotification("Order details copied! Paste them in your Instagram DM.");
    };

    const OrderSummary: React.FC = () => (
        <div className="bg-[var(--color-surface-alt)] p-6 rounded-lg border border-[var(--color-border)]">
            <h2 className="font-serif text-2xl mb-4">Order Summary</h2>
            <ul className="space-y-4 mb-4">
                {cartItems.map(item => (
                    <li key={item.id} className="flex items-center gap-4">
                        <img src={formatGoogleDriveLink(item.imageUrls[0], 'image', { width: 64 })} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                        <div className="flex-grow">
                            <h3 className="font-semibold text-sm">{item.name}</h3>
                            <p className="text-sm text-[var(--color-text-secondary)]">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(item.price)}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="space-y-2 text-sm border-t border-[var(--color-border)] pt-4">
                <div className="flex justify-between"><span className="text-[var(--color-text-secondary)]">Subtotal</span><span>{formattedSubtotal}</span></div>
                <div className="flex justify-between text-[var(--color-success)]"><span>Discount (20%)</span><span>-{formattedDiscount}</span></div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-dashed border-[var(--color-border)]"><span >Total</span><span>{formattedFinalTotal}</span></div>
            </div>
        </div>
    );

    if (view === 'confirmation') {
        return (
            <div className="container mx-auto max-w-2xl text-center py-20 px-6 animate-fade-in">
                <CheckCircleIcon className="w-20 h-20 text-[var(--color-success)] mx-auto mb-4" />
                <h1 className="text-3xl font-serif">Thank you, {customerDetails.name}!</h1>
                <p className="mt-4 text-[var(--color-text-secondary)]">Your details have been saved. To finalize your order, please confirm with us via WhatsApp or Instagram DM.</p>
                <div className="mt-8 p-6 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                    <h2 className="font-semibold text-lg">Next Steps</h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-2 mb-6">Choose one of the options below. We'll reply with payment details to confirm your purchase.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={handleWhatsAppConfirm} className="btn btn-primary" style={{backgroundColor: '#25D366', borderColor: '#25D366'}}>
                            <WhatsAppIcon className="w-5 h-5" /> Order on WhatsApp
                        </button>
                        <button onClick={handleInstagramConfirm} className="btn-manual-order btn w-full">
                            <InstagramIcon className="w-5 h-5" /> 
                            <span>{isCopied ? 'Details Copied!' : 'Order on Instagram'}</span>
                        </button>
                    </div>
                </div>
                <Link to="/shop" onClick={clearCart} className="mt-8 text-sm text-[var(--color-primary)] hover:underline">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-center font-serif text-3xl md:text-4xl mb-8">Checkout</h1>
            <div className="grid lg:grid-cols-2 lg:gap-12">
                <div className="lg:order-2">
                    <div className="checkout-summary">
                        <OrderSummary />
                    </div>
                </div>
                <div className="lg:order-1 mt-8 lg:mt-0">
                    <div className="flex justify-between items-center mb-6">
                         <h2 className="font-serif text-2xl">Shipping Details</h2>
                         <Link to="/shop" className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
                            <ArrowLeftIcon className="w-4 h-4" /> Back to Shop
                         </Link>
                    </div>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <input type="text" name="name" placeholder="Full Name" value={customerDetails.name} onChange={handleFormChange} required className="w-full p-3 border border-[var(--color-border)] rounded-md bg-[var(--color-surface)]" />
                        <input type="tel" name="phone" placeholder="Phone Number" value={customerDetails.phone} onChange={handleFormChange} required className="w-full p-3 border border-[var(--color-border)] rounded-md bg-[var(--color-surface)]" />
                        <textarea name="address" placeholder="Full Address" value={customerDetails.address} onChange={handleFormChange} required rows={3} className="w-full p-3 border border-[var(--color-border)] rounded-md bg-[var(--color-surface)]" />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" name="city" placeholder="City" value={customerDetails.city} onChange={handleFormChange} required className="w-full p-3 border border-[var(--color-border)] rounded-md bg-[var(--color-surface)]" />
                            <input type="text" name="state" placeholder="State" value={customerDetails.state} onChange={handleFormChange} required className="w-full p-3 border border-[var(--color-border)] rounded-md bg-[var(--color-surface)]" />
                        </div>
                        <input type="text" name="pincode" placeholder="Pincode" value={customerDetails.pincode} onChange={handleFormChange} required className="w-full p-3 border border-[var(--color-border)] rounded-md bg-[var(--color-surface)]" />
                        
                        {submissionError && <p className="text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/10 p-3 rounded-md">{submissionError}</p>}

                        <button type="submit" className="w-full btn btn-primary text-lg" disabled={submissionStatus === 'submitting'}>
                            {submissionStatus === 'submitting' ? <LoadingIcon className="w-6 h-6" /> : 'Confirm Order'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
