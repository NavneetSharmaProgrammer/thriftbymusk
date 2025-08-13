import React, { useCallback } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver.tsx';

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
  animationClass?: 'animate-fadeInUp' | 'animate-fadeInScale' | 'animate-slideInLeft' | 'animate-slideInRight';
  [key: string]: any;
};

/**
 * A reusable wrapper component that animates its children into view when they are scrolled to.
 * It uses the `useIntersectionObserver` hook to detect visibility and can be rendered as any HTML element.
 */
const AnimatedSection = React.forwardRef<Element, AnimatedSectionProps>(
  ({ children, className, id, as: Tag = 'section', style, animationClass = 'animate-fadeInUp', ...rest }, forwardedRef) => {
    const [observerRef, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

    // This combines the forwarded ref with the internal observer callback ref.
    const setRefs = useCallback(
        (node: Element | null) => {
            // Set the observer ref
            observerRef(node);
            // If a ref is forwarded, set it too
            if (typeof forwardedRef === 'function') {
                forwardedRef(node);
            } else if (forwardedRef) {
                (forwardedRef as React.MutableRefObject<Element | null>).current = node;
            }
        },
        [observerRef, forwardedRef]
    );

    return (
      <Tag
        id={id}
        ref={setRefs}
        className={`${className || ''} ${animationClass} ${isVisible ? 'visible' : ''}`}
        style={style} // Apply custom styles for staggered delays, etc.
        {...rest}
      >
        {children}
      </Tag>
    );
  }
);

export default AnimatedSection;