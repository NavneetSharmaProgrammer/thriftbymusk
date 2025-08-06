import React from 'react';
import AnimatedSection from '../AnimatedSection.tsx';
import { CheckCircleIcon } from '../Icons.tsx';

const QualityPromiseSection: React.FC = () => {
    return (
        <AnimatedSection id="quality" className="py-16 bg-[var(--color-surface-alt)]">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Our Quality Promise</h2>
                <div className="flex justify-center items-center gap-3 text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto">
                    <CheckCircleIcon className="w-7 h-7 text-[var(--color-success)] flex-shrink-0" />
                    <p>All items are lovingly cleaned, thoroughly inspected, and carefully steamed before being shipped to their new home.</p>
                </div>
            </div>
        </AnimatedSection>
    );
};

export default QualityPromiseSection;