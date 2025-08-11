import React from 'react';
import AnimatedSection from '../AnimatedSection.tsx';
import { OWNERS } from '../../constants.ts';
import { formatGoogleDriveLink } from '../../utils.ts';

const AboutSection: React.FC = () => {
  return (
    <AnimatedSection id="about" className="py-16 md:py-0 pb-16 md:pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">About Us</h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto">Thrift by Musk is the passion project of Muskaan Sharma, a Delhi-based freelance fashion model. With a mantra of "Playing Dress-up for a living," Muskaan brings her professional eye for style and love for sustainable fashion to every handpicked piece. This store is a reflection of her mission: to give timeless clothing a second story and empower you to express your unique style, guilt-free.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {OWNERS.map(owner => (
            <a href={owner.link} key={owner.name} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group text-center">
              <img 
                src={formatGoogleDriveLink(owner.image, 'image', { width: 200 })} 
                alt={owner.name} 
                className="w-32 h-32 rounded-full object-cover shadow-lg mb-4 transition-transform duration-300 group-hover:scale-105 bg-[var(--color-surface-alt)]" 
              />
              <span className="font-semibold text-lg text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{owner.name}</span>
              <span className="text-sm text-[var(--color-text-secondary)]">{owner.handle}</span>
            </a>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default AboutSection;
