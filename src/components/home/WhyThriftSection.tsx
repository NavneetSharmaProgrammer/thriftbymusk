import React from 'react';
import AnimatedSection from '../AnimatedSection.tsx';
import { PlanetIcon, RecycleIcon, StyleIcon } from '../Icons.tsx';

const WhyThriftSection: React.FC = () => {
    return (
        <AnimatedSection id="why-thrifting" className="py-16 bg-[var(--color-surface)]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-serif font-bold">Why Choose Vintage?</h2><p className="text-lg text-[var(--color-text-secondary)] mt-2">Discover the beauty of giving fashion a second story.</p></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                    <div className="flex flex-col items-center p-6 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors"><div className="bg-green-100/50 p-5 rounded-full mb-4"><PlanetIcon className="w-10 h-10 text-green-700" /></div><h3 className="text-xl font-semibold font-serif mb-2">Love Our Planet</h3><p className="text-[var(--color-text-secondary)]">By choosing pre-loved, you actively reduce textile waste and lessen the environmental footprint of fast fashion, one beautiful garment at a time.</p></div>
                    <div className="flex flex-col items-center p-6 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors"><div className="bg-blue-100/50 p-5 rounded-full mb-4"><RecycleIcon className="w-10 h-10 text-blue-700" /></div><h3 className="text-xl font-semibold font-serif mb-2">Give Clothes a Second Life</h3><p className="text-[var(--color-text-secondary)]">Every piece you thrift contributes to a circular economy, extending the life of quality clothing and celebrating its enduring craftsmanship.</p></div>
                    <div className="flex flex-col items-center p-6 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors"><div className="bg-yellow-100/50 p-5 rounded-full mb-4"><StyleIcon className="w-10 h-10 text-yellow-700" /></div><h3 className="text-xl font-semibold font-serif mb-2">Define Your Own Style</h3><p className="text-[var(--color-text-secondary)]">Escape the trend cycle and curate a wardrobe that's uniquely you. Thrifting empowers self-expression with one-of-a-kind finds.</p></div>
                </div>
            </div>
        </AnimatedSection>
    );
}

export default WhyThriftSection;
