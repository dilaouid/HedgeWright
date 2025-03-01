// src/presentation/app.tsx
import { Router } from './routes';
import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';

export const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router />
      </ToastProvider>
    </ThemeProvider>
  );
};