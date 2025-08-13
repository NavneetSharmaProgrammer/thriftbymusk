
import React from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const AnimatedCheckIcon: React.FC<{ className?: string }> = ({ className }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5, triggerOnce: true });

  return (
    <svg 
      ref={ref as React.Ref<SVGSVGElement>}
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth="2" 
      stroke="currentColor"
    >
      <path
        className={`animated-check ${isVisible ? 'visible' : ''}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

export default AnimatedCheckIcon;