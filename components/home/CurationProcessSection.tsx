import React from 'react';
import AnimatedSection from '../AnimatedSection.tsx';
import { SourcingIcon, CleaningIcon, PackagingIcon } from '../Icons.tsx';

const CurationProcessSection: React.FC = () => {
    const steps = [
        {
            icon: <SourcingIcon className="w-10 h-10 text-[var(--color-primary)]" />,
            title: "The Hunt",
            description: "We scour thrift stores and hidden gems to find <strong>unique, high-quality pieces</strong> with character and a story to tell."
        },
        {
            icon: <CleaningIcon className="w-10 h-10 text-[var(--color-primary)]" />,
            title: "The Revival",
            description: "Every item is <strong>lovingly cleaned and professionally steamed</strong>, ensuring it's fresh and ready for its new home."
        },
        {
            icon: <PackagingIcon className="w-10 h-10 text-[var(--color-primary)]" />,
            title: "The Delivery",
            description: "Your new treasure is <strong>thoughtfully packaged and shipped</strong>, ready to begin its next chapter in your wardrobe."
        }
    ];

    return (
        <section id="how-we-curate" className="py-16">
            <div className="container mx-auto px-6">
                <AnimatedSection as="div" className="text-center mb-12">
                    <h2>Our Curation Process</h2>
                    <p className="text-[var(--color-text-secondary)] mt-2">From hidden gems to your closet—every piece is handled with love.</p>
                </AnimatedSection>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                    {steps.map((step, index) => (
                        <AnimatedSection
                            key={step.title}
                            as="div"
                            className="flex flex-col items-center"
                            style={{ transitionDelay: `${100 + index * 150}ms` }}
                        >
                            <div className="bg-[var(--color-surface-alt)] p-5 rounded-full mb-4">{step.icon}</div>
                            <h3>{step.title}</h3>
                            <p
                                className="text-[var(--color-text-secondary)] mt-2"
                                dangerouslySetInnerHTML={{ __html: step.description }}
                            />
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CurationProcessSection;