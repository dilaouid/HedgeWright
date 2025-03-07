import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './presentation/app';

/**
 * Application entry point
 * Renders the main App component into the DOM
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
