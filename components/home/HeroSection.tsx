import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../AnimatedSection';
import { HERO_VIDEO_URL } from '../../constants';

const HeroSection: React.FC = () => {
  return (
    <AnimatedSection as="div" id="home" className="h-[90vh] md:h-screen flex items-center justify-center text-center relative overflow-hidden bg-black">
      {/* Background Video */}
      <video
        key={HERO_VIDEO_URL} // Add key to force re-render if URL changes
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
        }}
      >
        <source src={HERO_VIDEO_URL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black opacity-40 z-10"></div>

      {/* Content */}
      <div className="relative z-20 p-8 rounded-lg text-white">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-shadow">Thrift by Musk</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-shadow">Handpicked luxe pieces. Zara, Ralph Lauren & rare gems.</p>
          <Link to="/shop" className="btn btn-primary">Shop Now</Link>
      </div>
    </AnimatedSection>
  );
};

export default HeroSection;