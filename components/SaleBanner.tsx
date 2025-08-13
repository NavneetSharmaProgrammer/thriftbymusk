import React, { useState, useEffect } from 'react';
import { CloseIcon } from './Icons.tsx';

/**
 * A dismissible, scrolling marquee sales banner.
 * It displays key promotions in an infinite loop.
 */
const SaleBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const localStorageKey = 'saleBannerDismissed_v4'; // Increment version to show new banner

    useEffect(() => {
        if (localStorage.getItem(localStorageKey) !== 'true') {
            setIsVisible(true);
        }
    }, []);

    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsVisible(false);
        localStorage.setItem(localStorageKey, 'true');
    };

    if (!isVisible) {
        return null;
    }

    const bannerText = "✨ 20% OFF on orders above ₹499 • Complimentary Shipping on orders above ₹999 ✨";

    return (
        <div className="sale-banner">
            <div className="sale-banner__content-wrapper">
                {/* Repeat content to create a seamless loop */}
                <span className="sale-banner__content">{bannerText}</span>
                <span className="sale-banner__content">{bannerText}</span>
                <span className="sale-banner__content" aria-hidden="true">{bannerText}</span>
                <span className="sale-banner__content" aria-hidden="true">{bannerText}</span>
            </div>
            <button onClick={handleClose} className="sale-banner__close" aria-label="Dismiss this announcement">
                <CloseIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default SaleBanner;