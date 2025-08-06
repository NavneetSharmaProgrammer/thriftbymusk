import { useState, useEffect } from 'react';

/**
 * A custom hook to debounce a value.
 * It will only update the returned value after the specified delay has passed
 * without the input value changing. This is useful for performance optimization,
 * for example, by preventing API calls on every keystroke in a search bar.
 *
 * @param value The value to be debounced (e.g., a search query string).
 * @param delay The delay in milliseconds after which the debounced value is updated.
 * @returns The debounced value.
 */
function useDebounce<T>(value: T, delay: number): T {
  // State to store the debounced value.
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      // Set up a timer to update the debounced value after the specified delay.
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // This is the cleanup function that React runs on every re-render BEFORE the new effect runs,
      // or when the component unmounts. This is the key to debouncing: we clear the previous
      // timer before setting a new one, ensuring the state is only updated after the user
      // has stopped providing input for the specified delay.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-run the effect if the value or the delay changes.
  );

  return debouncedValue;
}

export default useDebounce;
