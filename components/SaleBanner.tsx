import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CloseIcon } from './Icons.tsx';

/**
 * A dismissible, static sales banner that is displayed sitewide.
 * It now announces the free shipping offer.
 */
const SaleBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Use a new key for the new banner to ensure it shows for all users
    const localStorageKey = 'saleBannerDismissed_v2';

    useEffect(() => {
        if (localStorage.getItem(localStorageKey) !== 'true') {
            setIsVisible(true);
        }
    }, []);

    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if the close button within the link is clicked
        setIsVisible(false);
        localStorage.setItem(localStorageKey, 'true');
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="sale-banner">
            <Link to="/shop" className="sale-banner__content">
                <p>FREE SHIPPING ON ORDERS OVER ₹999</p>
            </Link>
            <button onClick={handleClose} className="sale-banner__close" aria-label="Dismiss this announcement">
                <CloseIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default SaleBanner;