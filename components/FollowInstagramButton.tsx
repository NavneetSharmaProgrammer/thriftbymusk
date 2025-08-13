import React from 'react';
import { InstagramIcon } from './Icons.tsx';
import { INSTAGRAM_HANDLE } from '../constants.ts';

const FollowInstagramButton: React.FC = () => {
  return (
    <a
      href={`https://www.instagram.com/${INSTAGRAM_HANDLE}/`}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden md:flex fixed bottom-8 left-8 z-20 p-3 items-center gap-3 rounded-full bg-[var(--color-primary)] text-[var(--color-text-inverted)] shadow-lg hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-hover)] focus:ring-offset-2 transition-all duration-300 opacity-0 animate-slide-in-bl hover:scale-105"
      aria-label="Follow us on Instagram"
    >
      <InstagramIcon className="w-6 h-6" />
      <span className="font-semibold pr-2">Follow on Instagram</span>
    </a>
  );
};

export default FollowInstagramButton;