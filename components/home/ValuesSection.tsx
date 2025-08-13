import React from 'react';
import AnimatedSection from '../AnimatedSection.tsx';
import { 
  LeafIcon, RecycleIcon, FireIcon, ShieldCheckIcon, MapPinIcon
} from '../Icons.tsx';

const ValueItem: React.FC<{ icon: React.ReactNode; text: string; delay: number }> = ({ icon, text, delay }) => (
    <AnimatedSection
        as="div"
        className="flex flex-col items-center gap-2"
        style={{ transitionDelay: `${delay}ms` }}
    >
        {icon}
        <span className="font-semibold text-[var(--color-text-secondary)] text-sm">{text}</span>
    </AnimatedSection>
);

const ValuesSection: React.FC = () => {
  const values = [
    { icon: <LeafIcon className="w-8 h-8 text-[var(--color-primary)]" />, text: "Sustainable" },
    { icon: <RecycleIcon className="w-8 h-8 text-[var(--color-primary)]" />, text: "Pre-loved" },
    { icon: <FireIcon className="w-8 h-8 text-[var(--color-primary)]" />, text: "Limited Pieces" },
    { icon: <ShieldCheckIcon className="w-8 h-8 text-[var(--color-primary)]" />, text: "Cleaned & Inspected" },
    { icon: <MapPinIcon className="w-8 h-8 text-[var(--color-primary)]" />, text: "Ships PAN India" }
  ];

  return (
    <div id="values" className="bg-[var(--color-surface)] py-12 -mt-16 md:-mt-24 relative z-10 shadow-sm rounded-t-lg">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-4 text-center">
          {values.map((value, index) => (
            <ValueItem 
              key={value.text} 
              icon={value.icon} 
              text={value.text} 
              delay={index * 100} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValuesSection;