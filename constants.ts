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
 * If left empty, this checkout method will be disabled.
 */
export const GOOGLE_APPS_SCRIPT_URL: string = ''; // <-- PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE

/**
 * 3. BRAND LOGO
 * -------------
 * The main logo for your website.
 * HOW TO SET UP:
 * 1.  Upload your logo (SVG or PNG format is best) to a public Google Drive folder.
 * 2.  Right-click the file > Share > "Anyone with the link" > Copy link.
 * 3.  Paste the link below.
 */
export const LOGO_URL = 'https://drive.google.com/https://drive.google.com/file/d/1OZ-4vlBjZOwNplGd8crOuiqAW7o2N3gA/view?usp=sharing/d/1wE7L2p5N_N-HwXyJ2K8qY7tQ8jZ9k5F4/view?usp=drive_link'; // <-- PASTE YOUR LOGO URL HERE (This is an example link)

/**
 * 4. INSTAGRAM HANDLE
 * -------------------
 * Your store's Instagram handle, used for "Order via DM" links.
 * Do not include the '@' symbol.
 */
export const INSTAGRAM_HANDLE = 'thriftbymusk';

/**
 * 5. NEXT DROP LAUNCH DATE
 * ------------------------
 * Set the target date and time for your next product drop countdown timer.
 * FORMAT: 'YYYY-MM-DDTHH:MM:SSZ' (ISO 8601 format). 'Z' denotes UTC time.
 */
export const launchDate = '2025-07-31T18:30:00.000Z';


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
    id: 'gallery-image-1',
    url: 'https://drive.google.com/file/d/18DcWbQ8E27vmsNRvxLtXBGEViGXVzIiX/view?usp=drive_link',
    caption: 'Styling the Chic Denim Jacket',
  },
  { 
    id: 'gallery-image-2',
    url: 'https://drive.google.com/file/d/1_3l5t3i32NbZktptdaUp0vLiORM613-G/view?usp=drive_link', 
    caption: 'Thrifted Threads' 
  },
  { 
    id: 'gallery-image-3',
    url: 'https://drive.google.com/file/d/1VvoRYvHRvo9TDYzCvqo5xV-rvdnn9iQG/view?usp=sharing', 
    caption: 'Retro Soul' 
  },
  { 
    id: 'gallery-image-4',
    url: 'https://drive.google.com/file/d/14EjIhXtkA-X4nszVsE_LaGVKGFF241q3/view?usp=sharing', 
    caption: 'Sustainable Chic' 
  },
];

/**
 * INSTAGRAM FEED IMAGES
 * ---------------------
 * Images for the "Follow Our Feed" section.
 * Update these with your own Google Drive image links and links to your Instagram posts.
 */
export const INSTAGRAM_FEED_IMAGES = [
  { imageUrl: 'https://drive.google.com/file/d/1_3l5t3i32NbZktptdaUp0vLiORM613-G/view?usp=drive_link', link: 'https://www.instagram.com/thriftbymusk/' },
  { imageUrl: 'https://drive.google.com/file/d/18DcWbQ8E27vmsNRvxLtXBGEViGXVzIiX/view?usp=drive_link', link: 'https://www.instagram.com/thriftbymusk/' },
  { imageUrl: 'https://drive.google.com/file/d/1VvoRYvHRvo9TDYzCvqo5xV-rvdnn9iQG/view?usp=sharing', link: 'https://www.instagram.com/thriftbymusk/' },
  { imageUrl: 'https://drive.google.com/file/d/14EjIhXtkA-X4nszVsE_LaGVKGFF241q3/view?usp=sharing', link: 'https://www.instagram.com/thriftbymusk/' },
  { imageUrl: 'https://drive.google.com/file/d/1L155sUH6LUapn_-sW0yzP99pFrdVdfLr/view?usp=drive_link', link: 'https://www.instagram.com/thriftbymusk/' },
  { imageUrl: 'https://drive.google.com/file/d/1Lhf7i4_xso2U71b_8tBNPm-xbRX3lvP2/view?usp=drive_link', link: 'https://www.instagram.com/thriftbymusk/' },
];

/**
 * OWNER/FOUNDER INFORMATION
 * -------------------------
 * Details for the "About Us" section on the homepage.
 * Update with real names, Instagram links, and Google Drive image links.
 */
export const OWNERS = [
    { name: '@thatskinny.model', link: 'https://www.instagram.com/thatskinny.model/', image: 'https://drive.google.com/file/d/1rU85JO5KW0B3_I_N4_DnbWTa-qdRBKY7/view?usp=drive_link' },
    { name: '@beinggauravbisht', link: 'https://www.instagram.com/beinggauravbisht/', image: 'https://drive.google.com/file/d/1Lhf7i4_xso2U71b_8tBNPm-xbRX3lvP2/view?usp=drive_link' },
    { name: '@priyanka_bisht72200', link: 'https://www.instagram.com/priyanka_bisht72200/', image: 'https://drive.google.com/file/d/1L155sUH6LUapn_-sW0yzP99pFrdVdfLr/view?usp=drive_link' },
];