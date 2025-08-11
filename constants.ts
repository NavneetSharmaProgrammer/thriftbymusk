import { GalleryItem } from './types.ts';

/**
 * =================================================================
 *  IMPORTANT: CONFIGURE YOUR STORE SETTINGS BELOW
 * =================================================================
 * This file contains the core configuration for your e-commerce application.
 * Follow the instructions carefully to link your products and order forms.
 * All image assets are now managed via Google Drive links. See USER_MANUAL.txt for details.
 */

// --- Best Practice for Production: See USER_MANUAL.txt ---


/**
 * 1. GOOGLE SHEET FOR PRODUCTS
 * -----------------------------
 * Your product catalog is dynamically managed from a public Google Sheet.
 * Instructions are in USER_MANUAL.txt
 */
export const GOOGLE_SHEET_CSV_URL: string = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vROf3telhYrMdpmSSJXQBLQYVJHuOGvJ9SAznIol-KAMxZ0p7QicCKtAPV3HXzpO41xrWF9cXiuZw6A/pub?output=csv'; // <-- PASTE YOUR GOOGLE SHEET CSV LINK HERE


/**
 * 2. GOOGLE APPS SCRIPT FOR ORDERS (Optional, but Recommended)
 * -----------------------------------------------------------
 * URL for your deployed Google Apps Script to handle automated order submissions.
 * Instructions for setup are in USER_MANUAL.txt and in the ORDER_APPS_SCRIPT.js file.
 * If left empty, this checkout method will be disabled and will fall back to the manual DM flow.
 */
export const GOOGLE_APPS_SCRIPT_URL: string = 'https://script.google.com/macros/s/AKfycbxvS46MwG2CBsfF008_i5u4IqVlyeKcL7FIX83lvP2Qn04vSeHUmy3RzjuM_hJleH1ykA/exec'; // <-- PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE


/**
 * 3. BRAND LOGO
 * -------------
 * The main logo for your website.
 * HOW TO SET UP:
 * 1.  Upload your logo (SVG or PNG format is best) to a public Google Drive folder.
 * 2.  Right-click the file > Share > "Anyone with the link" > Copy link.
 * 3.  Paste the link below.
 */
export const LOGO_URL = 'https://drive.google.com/file/d/1OZ-4vlBjZOwNplGd8crOuiqAW7o2N3gA/view?usp=sharing'; // <-- PASTE YOUR LOGO URL HERE (This is an example link)

/**
 * 4. INSTAGRAM HANDLE
 * -------------------
 * Your store's Instagram handle, used for "Order via DM" links.
 * Do not include the '@' symbol.
 */
export const INSTAGRAM_HANDLE = 'thriftbymusk';

/**
 * 5. OWNERS/FOUNDERS
 * ------------------
 * Information about the store owners for the "About Us" section.
 */
export const OWNERS = [
  {
    name: 'Muskaan Sharma',
    handle: 'Founder & Curator',
    image: 'https://drive.google.com/file/d/1DFdOO5mZ7P5DkQ6Bv8w6EwK7zLa7dl5M/view?usp=sharing',
    link: 'https://www.instagram.com/thriftbymusk/',
  }
];


/**
 * =================================================================
 *  STATIC CONTENT (Managed via Google Drive)
 * =================================================================
 */

/**
 * GALLERY IMAGES
 * ----------------
 * Images for the Gallery page. Add a new object with a unique `id` and the Google Drive share link.
 */
export const GALLERY_ITEMS: GalleryItem[] = [
    {
        id: 'gallery-1',
        url: 'https://drive.google.com/file/d/1j-mDB0T4Raka-26aLh2g_EDg0cr2e7w2/view?usp=sharing',
        caption: 'Bohemian Summer Look',
    },
    {
        id: 'gallery-2',
        url: 'https://drive.google.com/file/d/1xGq3K7X6pZ5eN8uJ1rO-vW9bC3lA8sD9/view?usp=sharing',
        caption: 'City Chic Ensemble',
    },
    {
        id: 'gallery-3',
        url: 'https://drive.google.com/file/d/1p-R_gH5jK-l_A9cT8kY7o_S6jB5dF4eW/view?usp=sharing',
        caption: 'Casual Weekend Vibes',
    },
    {
        id: 'gallery-4',
        url: 'https://drive.google.com/file/d/1X_tG_hJ7kY6o_R8iP9kL-a_W9bC8dD7e/view?usp=sharing',
        caption: 'Vintage Denim Dreams',
    },
    {
        id: 'gallery-5',
        url: 'https://drive.google.com/file/d/1sO8P_tM3cR6aT-fG2kY9pB-l_KjA9sD1/view?usp=sharing',
        caption: 'Elegant Evening Attire',
    },
    {
        id: 'gallery-6',
        url: 'https://drive.google.com/file/d/1wE7L2p5N_N-HwXyJ2K8qY7tQ8jZ9k5F4/view?usp=sharing',
        caption: 'Cozy Autumn Layers',
    },
];

/**
 * INSTAGRAM FEED IMAGES
 * ---------------------
 * Images for the Instagram feed section on the homepage.
 */
export const INSTAGRAM_FEED_IMAGES = [
    {
        imageUrl: 'https://drive.google.com/file/d/1p-R_gH5jK-l_A9cT8kY7o_S6jB5dF4eW/view?usp=sharing',
        link: 'https://www.instagram.com/thriftbymusk/',
    },
    {
        imageUrl: 'https://drive.google.com/file/d/1sO8P_tM3cR6aT-fG2kY9pB-l_KjA9sD1/view?usp=sharing',
        link: 'https://www.instagram.com/thriftbymusk/',
    },
    {
        imageUrl: 'https://drive.google.com/file/d/1X_tG_hJ7kY6o_R8iP9kL-a_W9bC8dD7e/view?usp=sharing',
        link: 'https://www.instagram.com/thriftbymusk/',
    },
    {
        imageUrl: 'https://drive.google.com/file/d/1wE7L2p5N_N-HwXyJ2K8qY7tQ8jZ9k5F4/view?usp=sharing',
        link: 'https://www.instagram.com/thriftbymusk/',
    },
    {
        imageUrl: 'https://drive.google.com/file/d/1xGq3K7X6pZ5eN8uJ1rO-vW9bC3lA8sD9/view?usp=sharing',
        link: 'https://www.instagram.com/thriftbymusk/',
    },
    {
        imageUrl: 'https://drive.google.com/file/d/1j-mDB0T4Raka-26aLh2g_EDg0cr2e7w2/view?usp=sharing',
        link: 'https://www.instagram.com/thriftbymusk/',
    },
];
