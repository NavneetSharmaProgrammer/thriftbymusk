import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../AnimatedSection';
import { LOGO_3D_URL } from '../../constants';

const HeroSection: React.FC = () => {
  return (
    <AnimatedSection as="div" id="home" className="h-[80vh] flex items-center justify-center text-center relative overflow-hidden bg-[var(--color-surface-alt)]">
        
        {/* The 3D logo is positioned in the background of the hero section. */}
        <model-viewer
            src={LOGO_3D_URL}
            alt="Thrift by Musk 3D Logo"
            auto-rotate
            camera-controls
            disable-zoom
            environment-image="neutral"
            shadow-intensity="1"
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                height: '80%',
                maxWidth: '500px',
                maxHeight: '500px',
                zIndex: 5,
                backgroundColor: 'transparent',
                '--mv-interaction-prompt-display': 'none' // Hides the default interaction prompt circle
            } as React.CSSProperties}
        ></model-viewer>

      <div className="bg-[var(--color-surface)]/50 p-8 rounded-lg z-10 backdrop-blur-sm">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-[var(--color-text-primary)]">Thrift by Musk</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-[var(--color-text-secondary)]">Handpicked luxe pieces. Zara, Ralph Lauren & rare gems.</p>
          <Link to="/shop" className="btn btn-primary">Shop Now</Link>
      </div>
    </AnimatedSection>
  );
};

export default HeroSection;
