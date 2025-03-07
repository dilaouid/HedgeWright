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