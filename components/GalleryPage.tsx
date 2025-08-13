import React from 'react';
import { Link } from 'react-router-dom';
import { GALLERY_ITEMS } from '../constants';
import { ArrowLeftIcon } from './Icons';
import { formatGoogleDriveLink } from '../utils';

/**
 * The Gallery Page component.
 * It displays a grid of images sourced from the `GALLERY_ITEMS` array in `constants.ts`.
 * This page is intended to showcase customer photos or styled product shots.
 */
const GalleryPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="container mx-auto px-6 py-12">
        {/* "Back to Home" link for easy navigation. */}
        <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors w-fit font-medium">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back to Home</span>
            </Link>
        </div>

        {/* Page header */}
        <div className="text-center mb-12">
          <h1>Styled by You. Loved Forever.</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">Our community bringing thrifted treasures to life.</p>
        </div>
        
        {/* Responsive grid for the gallery images. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square block overflow-hidden rounded-lg shadow-lg bg-[var(--color-surface-alt)]"
            >
              <img 
                  // The utility function formats the Google Drive link for direct embedding.
                  src={formatGoogleDriveLink(item.url, 'image', { width: 400 })}
                  alt={item.caption || `Styled by a customer`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                  loading="lazy" // Lazy load images for better performance.
              />
              {/* Display a caption overlay if one is provided for the image. */}
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                    <p className="text-white text-sm font-semibold truncate">{item.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;