
import { useState, useRef, useCallback } from 'react';

// Define the type for the hook's options, extending the native IntersectionObserverInit
// and adding a custom option.
type ObserverOptions = IntersectionObserverInit & {
  triggerOnce?: boolean;
};

/**
 * A custom React hook that uses the Intersection Observer API to detect
 * when an element enters the viewport. This version returns a callback ref, which
 * is more robust for complex components and avoids issues with refs being stale or
 * conflicting with forwardRef.
 *
 * @param options - Configuration object for the Intersection Observer.
 * @returns A tuple `[ref, isIntersecting]`:
 * - `ref`: A callback ref to be attached to the DOM element you want to observe.
 * - `isIntersecting`: A boolean that is `true` if the element is currently intersecting.
 */
const useIntersectionObserver = (options: ObserverOptions) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  // The callback ref that gets attached to the DOM element.
  const ref = useCallback((node: Element | null) => {
    // If we have an old observer, disconnect it.
    if (observer.current) {
      observer.current.disconnect();
    }
    
    // Create a new observer instance with the provided options.
    observer.current = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      // If triggerOnce is enabled and the element is visible, disconnect the observer.
      if (options.triggerOnce && entry.isIntersecting) {
        observer.current?.disconnect();
      }
    }, options);

    // If the node exists, start observing it.
    if (node) {
      observer.current.observe(node);
    }
  }, [options.threshold, options.root, options.rootMargin, options.triggerOnce]);

  return [ref, isIntersecting] as const;
};

export default useIntersectionObserver;