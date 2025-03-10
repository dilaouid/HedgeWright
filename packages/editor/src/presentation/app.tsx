import React, { useEffect, useState } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes';

import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';
import { DialogProvider } from './providers/DialogProvider';
import { SoundProvider } from './providers/SoundProvider';
import { FileRouterProvider } from './providers/FileRouterProvider';

import '../styles/globals.css';

/**
 * Main application component with all providers
 * Sets up the router and global application context
 */
export function App() {
  const [isRouterReady, setIsRouterReady] = useState(false);

  useEffect(() => {
    // Initialize the router
    const initRouter = async () => {
      await router.load();
      setIsRouterReady(true);
    };

    initRouter();
  }, []);

  if (!isRouterReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-2xl">Loading HedgeWright Editor...</div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <DialogProvider>
          <SoundProvider>
            <FileRouterProvider>
              <RouterProvider router={router} />
            </FileRouterProvider>
          </SoundProvider>
        </DialogProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}