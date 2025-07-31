import React from 'react';
import AnimatedSection from '../AnimatedSection.tsx';
import { INSTAGRAM_FEED_IMAGES } from '../../constants.ts';
import { InstagramIcon } from '../Icons.tsx';
import { formatGoogleDriveLink } from '../../utils.ts';

const InstagramFeedSection: React.FC = () => {
  return (
    <AnimatedSection id="instagram-feed" className="py-16 bg-[var(--color-surface)]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Follow Our Feed</h2>
          <p className="text-lg text-[var(--color-text-secondary)] mt-2">Get daily style inspiration and drop sneak peeks on our Instagram.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
          {INSTAGRAM_FEED_IMAGES.map((item, index) => (
            <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="group relative aspect-square block overflow-hidden rounded-lg shadow-sm bg-[var(--color-surface-alt)]">
              <img 
                src={formatGoogleDriveLink(item.imageUrl, 'image', { width: 300 })} 
                alt={`Instagram post ${index + 1}`} 
                loading="lazy" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/40 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity"><InstagramIcon className="w-8 h-8 text-white" /></div>
            </a>
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="https://www.instagram.com/thriftbymusk/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Follow on Instagram</a>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default InstagramFeedSection;