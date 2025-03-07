import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

/**
 * Interface for dialog configuration options
 */
interface DialogOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'danger' | 'warning';
  onConfirm: () => void;
  onCancel?: () => void;
}

/**
 * Interface for the dialog context
 */
interface DialogContextType {
  confirm: (options: DialogOptions) => void;
  closeDialog: () => void;
}

// Create the context with default values
const DialogContext = createContext<DialogContextType>({
  confirm: () => {},
  closeDialog: () => {},
});

/**
 * Hook for using the dialog context
 */
export const useDialog = () => useContext(DialogContext);

interface DialogProviderProps {
  children: ReactNode;
}

/**
 * Dialog provider component for managing confirmation dialogs
 */
export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptions | null>(null);

  // Close the dialog
  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Open a confirmation dialog
  const confirm = useCallback((dialogOptions: DialogOptions) => {
    setOptions(dialogOptions);
    setIsOpen(true);
  }, []);

  // Handle confirmation
  const handleConfirm = useCallback(() => {
    if (options?.onConfirm) {
      options.onConfirm();
    }
    closeDialog();
  }, [options, closeDialog]);

  // Handle cancellation
  const handleCancel = useCallback(() => {
    if (options?.onCancel) {
      options.onCancel();
    }
    closeDialog();
  }, [options, closeDialog]);

  return (
    <DialogContext.Provider value={{ confirm, closeDialog }}>
      {children}

      {isOpen && options && (
        <ConfirmDialog
          isOpen={isOpen}
          title={options.title}
          message={options.message}
          confirmLabel={options.confirmLabel || 'Confirm'}
          cancelLabel={options.cancelLabel || 'Cancel'}
          confirmVariant={options.confirmVariant || 'primary'}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </DialogContext.Provider>
  );
};

export default DialogProvider;
