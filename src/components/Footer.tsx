import React from 'react';
import { InstagramIcon, UserIcon, WhatsAppIcon, LinkedInIcon, YouTubeIcon } from './Icons.tsx';
import { Link } from 'react-router-dom';
import { LOGO_URL, OWNERS } from '../constants.ts';
import { formatGoogleDriveLink } from '../utils.ts';

/**
 * The Footer component displayed at the bottom of every page.
 * It contains branding, navigation links, contact information, and social media links.
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--color-text-primary)] text-[var(--color-text-inverted)]">
      <div className="container mx-auto px-6 py-12">
        {/* The main content of the footer is structured in a responsive grid. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Column 1: Brand Information */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-3">
              <img src={formatGoogleDriveLink(LOGO_URL, 'image', { width: 32 })} alt="Thrift by Musk Logo" className="h-8 w-auto rounded-md no-theme-filter" />
              <span className="text-xl font-serif font-bold">Thrift by Musk</span>
            </div>
            <p className="text-[var(--color-text-muted)] text-center md:text-left">Handpicked luxe pieces. Timeless style, guilt-free fashion.</p>
          </div>
          
          {/* Column 2: Quick Navigation Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-lg mb-3">Navigate</h4>
            <div className="space-y-2 text-[var(--color-text-secondary)]">
                <Link to="/shop" className="block hover:text-[var(--color-text-inverted)] transition-colors">Shop</Link>
                <Link to="/saved" className="block hover:text-[var(--color-text-inverted)] transition-colors">Saved Items</Link>
                <Link to="/gallery" className="block hover:text-[var(--color-text-inverted)] transition-colors">Styling Gallery</Link>
                {/* These links point to sections on the homepage. */}
                <Link to="/#about" className="block hover:text-[var(--color-text-inverted)] transition-colors">About Us</Link>
                <Link to="/#quality" className="block hover:text-[var(--color-text-inverted)] transition-colors">Our Promise</Link>
            </div>
          </div>

          {/* Column 3: Contact Details and Founder Information */}
           <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-lg mb-3">Connect & Info</h4>
            <div className="space-y-3 text-[var(--color-text-secondary)]">
               <p className="text-[var(--color-text-muted)]">DM to shop on Instagram*</p>
               <p className="text-[var(--color-text-muted)]">Ships PAN India</p>
               {/* Social media and contact links with appropriate ARIA labels for accessibility. */}
               <div className="flex justify-center md:justify-start space-x-4 pt-2">
                <a href="https://www.instagram.com/thriftbymusk/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-inverted)] hover:text-[var(--color-text-secondary)] transition-colors" aria-label="Thrift by Musk Instagram">
                  <InstagramIcon className="h-6 w-6" />
                </a>
                <a href="https://wa.me/919760427922" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-inverted)] hover:text-[var(--color-text-secondary)] transition-colors" aria-label="WhatsApp">
                    <WhatsAppIcon className="h-6 w-6" />
                </a>
              </div>
              {/* Links to founders' Instagram profiles are now dynamically rendered. */}
              <div className="flex flex-col items-center md:items-start space-y-2 pt-2">
                {OWNERS.map((owner) => (
                  <a key={owner.name} href={owner.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--color-text-inverted)] hover:text-[var(--color-text-secondary)] transition-colors">
                      <UserIcon className="h-5 w-5" />
                      <span className="text-sm">{owner.handle}</span>
                  </a>
                ))}
              </div>
              
            </div>
          </div>
        </div>

        {/* Copyright notice at the very bottom of the footer. */}
        <div className="border-t border-[var(--color-border)] opacity-50 mt-10 pt-6 text-center text-[var(--color-text-muted)] text-sm">
          <p>© {new Date().getFullYear()} Thrift by Musk. All Rights Reserved.</p>
        </div>

        {/* Developer Credit Section */}
        <div className="mt-8 pt-6 border-t border-[var(--color-border)] opacity-50 text-center text-[var(--color-text-muted)] text-sm">
            <p className="mb-4">
                Developed by <a href="https://www.linkedin.com/in/navneet-sharma-590862241/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-inverted)] transition-colors">Navneet Sharma</a>
            </p>
            <div className="flex justify-center items-center space-x-5">
                <a href="https://www.linkedin.com/in/navneet-sharma-590862241/" target="_blank" rel="noopener noreferrer" aria-label="Navneet Sharma on LinkedIn" className="hover:text-[var(--color-text-inverted)] transition-colors">
                    <LinkedInIcon className="w-5 h-5" />
                </a>
                
                <a href="http://www.youtube.com/@codingwithnavneet" target="_blank" rel="noopener noreferrer" aria-label="Navneet Sharma on YouTube" className="hover:text-[var(--color-text-inverted)] transition-colors">
                    <YouTubeIcon className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/navneet_py/" target="_blank" rel="noopener noreferrer" aria-label="Navneet Sharma on Instagram" className="hover:text-[var(--color-text-inverted)] transition-colors">
                    <InstagramIcon className="w-5 h-5" />
                </a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
