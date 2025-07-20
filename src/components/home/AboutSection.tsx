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
          <p className="text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto">Founded by a team with a shared passion for sustainable fashion, Thrift by Musk is on a mission to bring you timeless style without the guilt. We believe in the magic of pre-loved clothes and the stories they hold.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {OWNERS.map(owner => (
            <a href={owner.link} key={owner.name} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
              <img 
                src={formatGoogleDriveLink(owner.image, 'image', { width: 200 })} 
                alt={owner.name} 
                className="w-32 h-32 rounded-full object-cover shadow-lg mb-3 transition-transform duration-300 group-hover:scale-105 bg-[var(--color-surface-alt)]" 
              />
              <span className="font-semibold text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)]">{owner.name}</span>
            </a>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default AboutSection;
