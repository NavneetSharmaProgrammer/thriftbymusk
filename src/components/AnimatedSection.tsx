import React from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver.tsx';

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType; // Allow component to be rendered as a different HTML tag
};

/**
 * A reusable wrapper component that animates its children into view when they are scrolled to.
 * It uses the `useIntersectionObserver` hook to detect visibility and can be rendered as any HTML element.
 */
const AnimatedSection = React.forwardRef<HTMLElement, AnimatedSectionProps>(
  ({ children, className, id, as: Tag = 'section' }, forwardedRef) => {
    const [observerRef, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

    // This combines the forwarded ref with the internal observer ref.
    const setRefs = React.useCallback(
        (node: HTMLElement | null) => {
            // Set the observer ref
            (observerRef as React.MutableRefObject<HTMLElement | null>).current = node;
            // If a ref is forwarded, set it too
            if (typeof forwardedRef === 'function') {
                forwardedRef(node);
            } else if (forwardedRef) {
                forwardedRef.current = node;
            }
        },
        [observerRef, forwardedRef]
    );

    return (
      <Tag
        id={id}
        ref={setRefs}
        className={`${className || ''} reveal ${isVisible ? 'visible' : ''}`}
      >
        {children}
      </Tag>
    );
  }
);

export default AnimatedSection;
