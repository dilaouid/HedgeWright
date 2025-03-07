import { useCallback } from 'react';
import { useIpcService } from '@/infrastructure/electron/services/useIpcService';

interface DialogOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    thirdOptionText?: string;
    confirmVariant?: 'default' | 'primary' | 'destructive';
}

type DialogResult = 'confirm' | 'cancel' | 'third-option' | false;

export function useDialogs() {
    const ipcService = useIpcService();

    /**
     * Show a confirmation dialog
     */
    const showConfirmDialog = useCallback(
        async (options: DialogOptions): Promise<DialogResult> => {
            try {
                return await ipcService.invoke('dialog:showConfirmDialog', options);
            } catch (error) {
                console.error('Failed to show confirm dialog:', error);
                return false;
            }
        },
        [ipcService]
    );

    /**
     * Show a message dialog
     */
    const showMessageDialog = useCallback(
        async (options: DialogOptions): Promise<void> => {
            try {
                await ipcService.invoke('dialog:showMessageDialog', options);
            } catch (error) {
                console.error('Failed to show message dialog:', error);
            }
        },
        [ipcService]
    );

    /**
     * Show an error dialog
     */
    const showErrorDialog = useCallback(
        async (title: string, error: Error | string): Promise<void> => {
            try {
                const errorMessage = error instanceof Error ? error.message : error;
                await ipcService.invoke('dialog:showErrorDialog', {
                    title,
                    message: errorMessage,
                });
            } catch (err) {
                console.error('Failed to show error dialog:', err);
            }
        },
        [ipcService]
    );

    /**
     * Show an open dialog
     */
    const showOpenDialog = useCallback(
        async (options: any): Promise<string[] | null> => {
            try {
                return await ipcService.invoke('dialog:showOpenDialog', options);
            } catch (error) {
                console.error('Failed to show open dialog:', error);
                return null;
            }
        },
        [ipcService]
    );

    /**
     * Show a save dialog
     */
    const showSaveDialog = useCallback(
        async (options: any): Promise<string | null> => {
            try {
                return await ipcService.invoke('dialog:showSaveDialog', options);
            } catch (error) {
                console.error('Failed to show save dialog:', error);
                return null;
            }
        },
        [ipcService]
    );

    return {
        showConfirmDialog,
        showMessageDialog,
        showErrorDialog,
        showOpenDialog,
        showSaveDialog,
    };
}