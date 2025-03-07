import React, { createContext, useContext, ReactNode } from 'react';
import { Toaster, toast } from 'react-hot-toast';

/**
 * Interface for the toast context
 */
interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

// Create the context with default values
const ToastContext = createContext<ToastContextType>({
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
});

/**
 * Hook for using the toast context
 */
export const useToast = () => useContext(ToastContext);

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Toast provider component for managing notifications across the application
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  // Toast handlers
  const success = (message: string) => {
    toast.success(message);
  };

  const error = (message: string) => {
    toast.error(message);
  };

  const info = (message: string) => {
    toast(message);
  };

  const warning = (message: string) => {
    toast(message, {
      icon: '⚠️',
      style: {
        backgroundColor: '#FEF3C7',
        color: '#92400E',
      },
    });
  };

  return (
    <ToastContext.Provider value={{ success, error, info, warning }}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '8px',
            padding: '12px 16px',
          },
          success: {
            style: {
              backgroundColor: '#D1FAE5',
              color: '#065F46',
            },
          },
          error: {
            style: {
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
            },
            duration: 5000,
          },
        }}
      />
    </ToastContext.Provider>
  );
};
