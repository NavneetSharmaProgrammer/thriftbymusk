import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { launchDate } from './constants.ts';

/**
 * Interface for the context value.
 * This defines the shape of the data that consumers of this context will receive.
 */
interface DropContextType {
  isDropLive: boolean; // A boolean indicating if the drop has started.
  launchDate: string;  // The launch date string from constants.
}

// Create the context with an initial undefined value.
const DropContext = createContext<DropContextType | undefined>(undefined);

/**
 * The DropProvider component.
 * It encapsulates the logic for determining if a product drop is "live" based on the
 * current time and the `launchDate` set in the constants file.
 * Any components wrapped by this provider can access the `isDropLive` state.
 */
export const DropProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize the state by comparing the current date with the launch date.
  const [isDropLive, setIsDropLive] = useState(new Date() >= new Date(launchDate));

  /**
   * An effect that runs on component mount to handle the countdown to the launch.
   * If the drop is not yet live, it sets up an interval to check the date every second.
   */
  useEffect(() => {
    // If the drop is already live, there's no need to set up an interval.
    if (isDropLive) return;

    // Function to check if the launch time has been reached.
    const checkDate = () => {
      if (new Date() >= new Date(launchDate)) {
        setIsDropLive(true);
        // Once the drop is live, clear the interval to save resources.
        if (interval) clearInterval(interval);
      }
    };

    // Set up the interval to run the check function periodically.
    const interval = setInterval(checkDate, 1000);
    checkDate(); // Perform an initial check immediately on mount.

    // Cleanup function: clear the interval when the component unmounts.
    return () => clearInterval(interval);
  }, [isDropLive]); // The effect dependency array includes isDropLive to stop the effect once it becomes true.

  const value = { isDropLive, launchDate };

  return <DropContext.Provider value={value}>{children}</DropContext.Provider>;
};

/**
 * A custom hook `useDrop` for easy consumption of the DropContext.
 * It abstracts away the `useContext` hook and provides type safety.
 * It also throws an error if used outside of a DropProvider, which is a helpful debugging aid.
 */
export const useDrop = (): DropContextType => {
  const context = useContext(DropContext);
  if (context === undefined) {
    throw new Error('useDrop must be used within a DropProvider');
  }
  return context;
};
