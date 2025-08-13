import React from 'react';
import AnimatedSection from '../AnimatedSection.tsx';
import AnimatedCheckIcon from '../AnimatedCheckIcon.tsx';

const QualityPromiseSection: React.FC = () => {
    const promises = [
        "Thoroughly cleaned",
        "Professionally inspected",
        "Freshly steamed",
        "Ready to wear & love"
    ];

    return (
        <section id="quality" className="py-16 bg-[var(--color-surface-alt)]">
            <div className="container mx-auto px-6 text-center">
                <AnimatedSection as="h2" className="mb-6">Our Promise to You</AnimatedSection>
                <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-[var(--color-text-secondary)] max-w-4xl mx-auto">
                    {promises.map((promise, index) => (
                        <AnimatedSection
                            key={index}
                            as="div"
                            className="flex items-center gap-2"
                            style={{ transitionDelay: `${100 + index * 100}ms` }}
                        >
                           <AnimatedCheckIcon className="w-6 h-6 text-[var(--color-success)] flex-shrink-0" />
                           <span>{promise}</span>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QualityPromiseSection;