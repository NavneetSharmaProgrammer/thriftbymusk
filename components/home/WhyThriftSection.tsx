import React from 'react';
import AnimatedSection from '../AnimatedSection.tsx';
import { PlanetIcon, RecycleIcon, StyleIcon } from '../Icons.tsx';

type AnimationClass = 'animate-slideInLeft' | 'animate-fadeInUp' | 'animate-slideInRight';

const WhyThriftCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; animationClass: AnimationClass }> = ({ icon, title, children, animationClass }) => (
    <AnimatedSection
        as="div"
        className="flex flex-col items-center p-6 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors"
        animationClass={animationClass}
    >
        {icon}
        <h3 className="mb-2">{title}</h3>
        <p className="text-[var(--color-text-secondary)]">{children}</p>
    </AnimatedSection>
);

const WhyThriftSection: React.FC = () => {
    const cards = [
        {
            icon: <div className="bg-green-100/50 p-5 rounded-full mb-4"><PlanetIcon className="w-10 h-10 text-green-700" /></div>,
            title: "🌱 Love the Planet",
            description: "Each pre-loved piece reduces textile waste and lightens the footprint of fast fashion.",
            animationClass: 'animate-slideInLeft' as AnimationClass
        },
        {
            icon: <div className="bg-blue-100/50 p-5 rounded-full mb-4"><RecycleIcon className="w-10 h-10 text-blue-700" /></div>,
            title: "♻ Give Clothes a Second Life",
            description: "High-quality garments deserve more than one chapter—yours could be the most stylish yet.",
            animationClass: 'animate-fadeInUp' as AnimationClass
        },
        {
            icon: <div className="bg-yellow-100/50 p-5 rounded-full mb-4"><StyleIcon className="w-10 h-10 text-yellow-700" /></div>,
            title: "💎 Define Your Style",
            description: "Step away from mass trends and embrace pieces that are truly yours—unique, timeless, unforgettable.",
            animationClass: 'animate-slideInRight' as AnimationClass
        }
    ];

    return (
        <section id="why-thrifting" className="py-16 bg-[var(--color-surface)]">
            <div className="container mx-auto px-6">
                <AnimatedSection as="div" className="text-center mb-12">
                    <h2>Why Choose Vintage with Us?</h2>
                </AnimatedSection>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                    {cards.map(card => (
                        <WhyThriftCard
                            key={card.title}
                            icon={card.icon}
                            title={card.title}
                            animationClass={card.animationClass}
                        >
                            {card.description}
                        </WhyThriftCard>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default WhyThriftSection;