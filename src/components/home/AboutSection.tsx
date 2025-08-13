import React from 'react';
import AnimatedSection from '../AnimatedSection.tsx';
import { OWNERS } from '../../constants.ts';
import { formatGoogleDriveLink } from '../../utils.ts';
import { InstagramIcon } from '../Icons.tsx';

const AboutSection: React.FC = () => {
  return (
    <div id="about" className="py-16 md:pb-24 bg-[var(--color-surface)]">
      <div className="container mx-auto px-6">
        <AnimatedSection as="div" className="text-center mb-12">
          <h2 className="mb-4">Meet Our Co-Founders</h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">The creative minds and driving forces behind every curated piece and styled look at Thrift by Musk.</p>
        </AnimatedSection>
        {/* Responsive grid for team members with staggered animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {OWNERS.map((owner, index) => (
            <AnimatedSection
              key={owner.name}
              as="div"
              className="flex flex-col bg-[var(--color-surface-alt)] p-6 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 team-card-hover"
              animationClass={index % 2 === 0 ? 'animate-slideInLeft' : 'animate-slideInRight'}
              style={{ transitionDelay: `${(index % 2) * 150}ms` }}
            >
              <img 
                src={formatGoogleDriveLink(owner.image, 'image', { width: 240 })} 
                alt={`Profile of ${owner.name}`}
                className="w-32 h-32 rounded-full object-cover shadow-lg mb-4 border-4 border-[var(--color-surface)] mx-auto" 
              />
              <div className="text-center flex-grow flex flex-col">
                  <h3>{owner.name}</h3>
                  <p className="text-sm font-medium text-[var(--color-primary)] mb-3">{owner.handle}</p>
                  <p className="text-sm text-[var(--color-text-secondary)] flex-grow mb-4">{owner.description}</p>
                  <a 
                    href={owner.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-auto inline-flex items-center justify-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors icon-heartbeat"
                    aria-label={`View ${owner.name}'s Instagram profile`}
                  >
                    <InstagramIcon className="w-5 h-5" />
                    <span>Instagram</span>
                  </a>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutSection;