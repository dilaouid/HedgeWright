/* eslint-disable @typescript-eslint/no-explicit-any */
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
        };
    }
}

// Create a mock IPC service for browser mode
const browserIpcService = {
    invoke: async (channel: string, ...args: any[]): Promise<any> => {
        console.warn(`Browser mode: IPC channel '${channel}' called with:`, args);
        
        // For file dialogs, simulate returning null (cancelled)
        if (channel.startsWith('dialog:')) {
            return null;
        }
        
        throw new Error('IPC renderer not available - are you running in Electron?');
    },
    on: (channel: string, callback: (...args: any[]) => void): void => {
        console.warn(`Browser mode: IPC listener for '${channel}' registered`);
    },
    once: (channel: string, callback: (...args: any[]) => void): void => {
        console.warn(`Browser mode: IPC one-time listener for '${channel}' registered`);
    },
    removeListener: (channel: string, callback: (...args: any[]) => void): void => {
        console.warn(`Browser mode: IPC listener for '${channel}' removed`);
    }
};

export function useIpcService() {
    // Check if we're running in Electron
    const isElectron = useCallback(() => {
        return window.electron !== undefined;
    }, []);

    /**
     * Invoke an IPC method and get a response
     */
    const invoke = useCallback(async (channel: string, ...args: any[]): Promise<any> => {
        if (isElectron()) {
            console.log(`Invoking IPC channel: ${channel}`);
            return window.electron!.ipcRenderer.invoke(channel, ...args);
        }
        
        return browserIpcService.invoke(channel, ...args);
    }, [isElectron]);

    /**
     * Listen for IPC events
     */
    const on = useCallback((channel: string, callback: (...args: any[]) => void): void => {
        if (isElectron()) {
            window.electron!.ipcRenderer.on(channel, callback);
        } else {
            browserIpcService.on(channel, callback);
        }
    }, [isElectron]);

    /**
     * Listen for a one-time IPC event
     */
    const once = useCallback((channel: string, callback: (...args: any[]) => void): void => {
        if (isElectron()) {
            window.electron!.ipcRenderer.once(channel, callback);
        } else {
            browserIpcService.once(channel, callback);
        }
    }, [isElectron]);

    /**
     * Remove an IPC event listener
     */
    const removeListener = useCallback((channel: string, callback: (...args: any[]) => void): void => {
        if (isElectron()) {
            window.electron!.ipcRenderer.removeListener(channel, callback);
        } else {
            browserIpcService.removeListener(channel, callback);
        }
    }, [isElectron]);

    return {
        invoke,
        on,
        once,
        removeListener,
        isElectron: isElectron()
    };
}