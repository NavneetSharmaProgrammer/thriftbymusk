
import { useState, useEffect, useRef } from 'react';

// Define the type for the hook's options, extending the native IntersectionObserverInit
// and adding a custom option.
type ObserverOptions = IntersectionObserverInit & {
  triggerOnce?: boolean;
};

/**
 * A custom React hook that uses the Intersection Observer API to detect
 * when an element enters the viewport.
 *
 * This is highly performant for tasks like lazy-loading images or triggering
 * animations on scroll, as it avoids the need for scroll event listeners.
 *
 * @param options - Configuration object for the Intersection Observer.
 * @param options.threshold - A number or array of numbers indicating at what percentage
 *   of the target's visibility the observer's callback should be executed.
 * @param options.root - The element that is used as the viewport for checking visibility.
 *   Defaults to the browser viewport if not specified.
 * @param options.rootMargin - Margin around the root. Can be used to grow or shrink
 *   the area used for intersections.
 * @param options.triggerOnce - A custom boolean option. If true, the observer will
 *   disconnect after the element has become visible once.
 *
 * @returns A tuple `[ref, isIntersecting]`:
 * - `ref`: A React ref object to be attached to the DOM element you want to observe.
 * - `isIntersecting`: A boolean that is `true` if the element is currently intersecting
 *   the viewport, and `false` otherwise.
 */
const useIntersectionObserver = (options: ObserverOptions) => {
  // State to hold the latest IntersectionObserverEntry. We only really need the `isIntersecting` boolean.
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  // Ref to hold the IntersectionObserver instance itself.
  const observer = useRef<IntersectionObserver | null>(null);
  // Ref to attach to the target DOM element.
  const ref = useRef<HTMLElement>(null);

  // Memoize options to prevent the useEffect from re-running on every render
  // unless the options object has actually changed.
  const memoizedOptions = JSON.stringify(options);

  useEffect(() => {
    const node = ref?.current; // The DOM element to observe.
    if (!node) return;

    const currentOptions = JSON.parse(memoizedOptions);
    const { triggerOnce, ...observerOptions } = currentOptions;

    // Disconnect any previous observer before creating a new one.
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create the new IntersectionObserver instance.
    observer.current = new IntersectionObserver(([entry]) => {
      // When the element's intersection state changes, update our state.
      setEntry(entry);
      // If `triggerOnce` is true and the element is visible, unobserve it to save resources.
      if (entry.isIntersecting && triggerOnce && observer.current) {
        observer.current.unobserve(node);
      }
    }, observerOptions);

    // Start observing the target element.
    observer.current.observe(node);

    // Cleanup function: Disconnect the observer when the component unmounts.
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
    // The effect depends on the memoized options string.
  }, [memoizedOptions]);

  return [ref, entry?.isIntersecting] as const;
};

export default useIntersectionObserver;
