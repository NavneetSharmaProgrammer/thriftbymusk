import React from 'react';
import AnimatedSection from '../AnimatedSection.tsx';
import { SourcingIcon, CleaningIcon, PackagingIcon } from '../Icons.tsx';

const CurationProcessSection: React.FC = () => {
    return (
        <AnimatedSection id="how-we-curate" className="py-16">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-serif font-bold">How We Curate Your Closet</h2><p className="text-lg text-[var(--color-text-secondary)] mt-2">Our three-step process to ensure quality and style.</p></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                    <div className="flex flex-col items-center"><div className="bg-pink-100/50 p-5 rounded-full mb-4"><SourcingIcon className="w-10 h-10 text-[var(--color-primary)]" /></div><h3 className="text-xl font-semibold font-serif mb-2">1. The Hunt</h3><p className="text-[var(--color-text-secondary)]">We scour thrift stores and hidden gems to find unique, high-quality pieces with character and a story to tell.</p></div>
                    <div className="flex flex-col items-center"><div className="bg-purple-100/50 p-5 rounded-full mb-4"><CleaningIcon className="w-10 h-10 text-[var(--color-primary)]" /></div><h3 className="text-xl font-semibold font-serif mb-2">2. The Revival</h3><p className="text-[var(--color-text-secondary)]">Every item is lovingly cleaned, professionally steamed, and mended if needed, ensuring it's fresh and ready for you.</p></div>
                    <div className="flex flex-col items-center"><div className="bg-teal-100/50 p-5 rounded-full mb-4"><PackagingIcon className="w-10 h-10 text-[var(--color-primary)]" /></div><h3 className="text-xl font-semibold font-serif mb-2">3. The Delivery</h3><p className="text-[var(--color-text-secondary)]">Your new treasure is thoughtfully packaged and shipped, ready to begin its next chapter in your wardrobe.</p></div>
                </div>
            </div>
        </AnimatedSection>
    )
}

export default CurationProcessSection;