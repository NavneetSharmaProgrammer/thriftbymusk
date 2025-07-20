import React from 'react';
import { LoadingIcon } from './Icons.tsx';

/**
 * A simple page loader component.
 * Displays a centered spinner, used as a fallback for React.Suspense
 * while lazy-loaded page components are being fetched.
 */
const PageLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-96">
      <LoadingIcon className="w-12 h-12 text-[#8B5E34]" />
    </div>
  );
};

export default PageLoader;
