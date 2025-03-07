import { useCallback } from 'react';

// Define the global window interface to include Electron's IPC renderer
declare global {
    interface Window {
        electron?: {
            ipcRenderer: {
                invoke: (channel: string, ...args: any[]) => Promise<any>;
                on: (channel: string, callback: (...args: any[]) => void) => void;
                once: (channel: string, callback: (...args: any[]) => void) => void;
                removeListener: (channel: string, callback: (...args: any[]) => void) => void;
            };
            openFileDialog: () => void;
        };
    }
}

export function useIpcService() {
    /**
     * Invoke an IPC method and get a response
     */
    const invoke = useCallback(async (channel: string, ...args: any[]): Promise<any> => {
        if (!window.electron?.ipcRenderer) {
            throw new Error('IPC renderer not available - are you running in Electron?');
        }

        return window.electron.ipcRenderer.invoke(channel, ...args);
    }, []);

    /**
     * Listen for IPC events
     */
    const on = useCallback((channel: string, callback: (...args: any[]) => void): void => {
        if (!window.electron?.ipcRenderer) {
            console.warn('IPC renderer not available - are you running in Electron?');
            return;
        }

        window.electron.ipcRenderer.on(channel, callback);
    }, []);

    /**
     * Listen for a one-time IPC event
     */
    const once = useCallback((channel: string, callback: (...args: any[]) => void): void => {
        if (!window.electron?.ipcRenderer) {
            console.warn('IPC renderer not available - are you running in Electron?');
            return;
        }

        window.electron.ipcRenderer.once(channel, callback);
    }, []);

    /**
     * Remove an IPC event listener
     */
    const removeListener = useCallback((channel: string, callback: (...args: any[]) => void): void => {
        if (!window.electron?.ipcRenderer) {
            console.warn('IPC renderer not available - are you running in Electron?');
            return;
        }

        window.electron.ipcRenderer.removeListener(channel, callback);
    }, []);

    return {
        invoke,
        on,
        once,
        removeListener
    };
}