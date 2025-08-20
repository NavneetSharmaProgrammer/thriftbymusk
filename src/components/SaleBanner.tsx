import React, { useState, useEffect } from 'react';
import { CloseIcon } from './Icons.tsx';

/**
 * A dismissible sales banner with a smooth marquee effect.
 * It aligns with the site's theme and dynamically adjusts page layout when visible.
 */
const SaleBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    // Increment version number in the key to force re-display of the banner for all users after an update.
    const localStorageKey = 'saleBannerDismissed_v6'; 

    useEffect(() => {
        // Check if the user has previously dismissed this version of the banner.
        if (localStorage.getItem(localStorageKey) !== 'true') {
            setIsVisible(true);
        }
    }, [localStorageKey]);

    /**
     * This effect manages a CSS custom property on the root element.
     * This allows other components (like the sticky sidebar on the Shop page)
     * to dynamically adjust their layout based on the banner's visibility without prop drilling.
     */
    useEffect(() => {
        if (isVisible) {
            document.documentElement.style.setProperty('--sale-banner-height', '41px');
        } else {
            document.documentElement.style.removeProperty('--sale-banner-height');
        }

        // Cleanup function to remove the property when the component unmounts.
        return () => {
            document.documentElement.style.removeProperty('--sale-banner-height');
        };
    }, [isVisible]);

    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsVisible(false);
        try {
            localStorage.setItem(localStorageKey, 'true');
        } catch (error) {
            console.error("Could not write to localStorage", error);
        }
    };

    if (!isVisible) {
        return null;
    }

    const bannerText = "SITE-WIDE 20% SALE NOW LIVE! • FREE SHIPPING ON ORDERS OVER ₹999";

    return (
        <div className="sale-banner">
            <div className="sale-banner__content-wrapper">
                <span className="sale-banner__content">{bannerText}</span>
                <span className="sale-banner__content" aria-hidden="true">{bannerText}</span>
            </div>
            <button onClick={handleClose} className="sale-banner__close" aria-label="Dismiss this announcement">
                <CloseIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default SaleBanner;