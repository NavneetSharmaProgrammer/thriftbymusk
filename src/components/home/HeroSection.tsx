import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../AnimatedSection.tsx';

const HeroSection: React.FC = () => {
  return (
    <AnimatedSection as="div" id="home" className="h-[80vh] flex items-center justify-center text-center relative overflow-hidden bg-[var(--color-surface-alt)]">
        {/* Decorative floating shapes for visual interest. */}
        <div className="hero-shape bg-pink-200/50 w-64 h-64 top-1/4 left-1/4" style={{ animationDelay: '0s' }}></div>
        <div className="hero-shape bg-purple-200/50 w-48 h-48 top-1/2 right-1/4" style={{ animationDelay: '4s' }}></div>
        <div className="hero-shape bg-teal-200/50 w-56 h-56 bottom-1/4 left-1/3" style={{ animationDelay: '8s' }}></div>

      <div className="bg-[var(--color-surface)]/50 p-8 rounded-lg z-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-[var(--color-text-primary)]">Thrift by Musk</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-[var(--color-text-secondary)]">Handpicked luxe pieces. Zara, Ralph Lauren & rare gems.</p>
          <Link to="/shop" className="btn btn-primary">Shop Now</Link>
      </div>
    </AnimatedSection>
  );
};

export default HeroSection;
