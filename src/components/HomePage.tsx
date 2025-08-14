



import React from 'react';
import HeroSection from './home/HeroSection.tsx';
import ValuesSection from './home/ValuesSection.tsx';
import ComingSoonSection from './home/ComingSoonSection.tsx';
import FeaturedFindsSection from './home/FeaturedFindsSection.tsx';
import CurationProcessSection from './home/CurationProcessSection.tsx';
import WhyThriftSection from './home/WhyThriftSection.tsx';
import QualityPromiseSection from './home/QualityPromiseSection.tsx';
import AboutSection from './home/AboutSection.tsx';
import PackagingSection from './home/PackagingSection.tsx';
import InstagramFeedSection from './home/InstagramFeedSection.tsx';

/**
 * The main component for the homepage. 
 * It now acts as a layout container, assembling all the different sections
 * which have been broken out into their own components for better maintainability.
 */
const HomePage: React.FC = () => {
  return (
    <div className="animate-page-fade">
        <div className="space-y-16 md:space-y-24">
            <HeroSection />
            <ValuesSection />
            <ComingSoonSection />
            <FeaturedFindsSection />
            <CurationProcessSection />
            <PackagingSection />
            <WhyThriftSection />
            <QualityPromiseSection />
            <AboutSection />
            <InstagramFeedSection />
        </div>
    </div>
  );
};

export default HomePage;