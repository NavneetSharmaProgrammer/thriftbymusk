

import React from 'react';
import HeroSection from './home/HeroSection';
import ValuesSection from './home/ValuesSection';
import ComingSoonSection from './home/ComingSoonSection';
import FeaturedFindsSection from './home/FeaturedFindsSection';
import InstagramFeedSection from './home/InstagramFeedSection';
import CurationProcessSection from './home/CurationProcessSection';
import WhyThriftSection from './home/WhyThriftSection';
import QualityPromiseSection from './home/QualityPromiseSection';
import AboutSection from './home/AboutSection';

/**
 * The main component for the homepage. 
 * It now acts as a layout container, assembling all the different sections
 * which have been broken out into their own components for better maintainability.
 */
const HomePage: React.FC = () => {
  return (
    <div className="space-y-16 md:space-y-24">
      <HeroSection />
      <ValuesSection />
      <ComingSoonSection />
      <FeaturedFindsSection />
      <InstagramFeedSection />
      <CurationProcessSection />
      <WhyThriftSection />
      <QualityPromiseSection />
      <AboutSection />
    </div>
  );
};

export default HomePage;