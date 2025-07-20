
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

/**
 * The main entry point for the React application.
 */

// 1. Find the root DOM element where the React app will be mounted.
// This element is defined in `index.html`.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to. Ensure an element with id='root' exists in your index.html.");
}

// 2. Create a React root for the found element.
// This new API is part of React 18 and enables concurrent features.
const root = ReactDOM.createRoot(rootElement);

// 3. Render the main App component into the root.
// React.StrictMode is a wrapper that helps with highlighting potential problems in an application.
// It activates additional checks and warnings for its descendants.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
