import React from 'react';
import AnimatedSection from '../AnimatedSection.tsx';
import { 
  LeafIcon, RecycleIcon, FireIcon, ShieldCheckIcon, MapPinIcon
} from '../Icons.tsx';

const ValuesSection: React.FC = () => {
  return (
    <AnimatedSection id="values" className="bg-[var(--color-surface)] py-12 -mt-16 md:-mt-24 relative z-10 shadow-sm rounded-t-lg">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-4 text-center">
          <div className="flex flex-col items-center gap-2"><LeafIcon className="w-8 h-8 text-[var(--color-primary)]" /><span className="font-semibold text-[var(--color-text-secondary)] text-sm">Sustainable</span></div>
          <div className="flex flex-col items-center gap-2"><RecycleIcon className="w-8 h-8 text-[var(--color-primary)]" /><span className="font-semibold text-[var(--color-text-secondary)] text-sm">Pre-loved</span></div>
          <div className="flex flex-col items-center gap-2"><FireIcon className="w-8 h-8 text-[var(--color-primary)]" /><span className="font-semibold text-[var(--color-text-secondary)] text-sm">Limited Pieces</span></div>
          <div className="flex flex-col items-center gap-2"><ShieldCheckIcon className="w-8 h-8 text-[var(--color-primary)]" /><span className="font-semibold text-[var(--color-text-secondary)] text-sm">Cleaned & Inspected</span></div>
          <div className="flex flex-col items-center gap-2 col-span-2 md:col-span-1"><MapPinIcon className="w-8 h-8 text-[var(--color-primary)]" /><span className="font-semibold text-[var(--color-text-secondary)] text-sm">Ships PAN India</span></div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ValuesSection;