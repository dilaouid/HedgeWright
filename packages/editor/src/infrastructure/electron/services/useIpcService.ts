// packages\editor\src\infrastructure\electron\services\useIpcService.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

// Define the global window interface to include Electron's IPC renderer
declare global {
    interface Window {
        electron: {
            ipcRenderer: {
                invoke: (channel: string, ...args: any[]) => Promise<any>;
                on: (channel: string, callback: (...args: any[]) => void) => void;
                once: (channel: string, callback: (...args: any[]) => void) => void;
                removeListener: (channel: string, callback: (...args: any[]) => void) => void;
            };
        };
    }
}

export interface IpcService {
    invoke: (channel: string, ...args: unknown[]) => Promise<any>;
    on: (channel: string, listener: (...args: any[]) => void) => void;
    once: (channel: string, listener: (...args: any[]) => void) => void;
    removeListener: (channel: string, listener: (...args: any[]) => void) => void;
    isElectron: boolean;
}

const mockIpcService: IpcService = {
    invoke: async (channel: string, ...args: unknown[]) => {
        console.log(`Mock IPC invoke: ${channel}`, args);
        return { success: false, message: 'Electron IPC not yet available' };
    },
    on: (channel: string, listener: (...args: any[]) => void) => {
        console.log(`Mock IPC on: ${channel}`);
    },
    once: (channel: string, listener: (...args: any[]) => void) => {
        console.log(`Mock IPC once: ${channel}`);
    },
    removeListener: (channel: string, listener: (...args: any[]) => void) => {
        console.log(`Mock IPC removeListener: ${channel}`);
    },
    isElectron: false
};

export function useIpcService(): IpcService {
    const [ipcService, setIpcService] = useState<IpcService>(mockIpcService); // Initialize with mock service

    useEffect(() => {
        // Check if electron is available in window context
        if (window.electron?.ipcRenderer) {
            const service: IpcService = {
                invoke: (channel: string, ...args: unknown[]) =>
                    window.electron.ipcRenderer.invoke(channel, ...args),
                on: (channel: string, listener: (...args: any[]) => void) =>
                    window.electron.ipcRenderer.on(channel, listener),
                once: (channel: string, listener: (...args: any[]) => void) =>
                    window.electron.ipcRenderer.once(channel, listener),
                removeListener: (channel: string, listener: (...args: any[]) => void) =>
                    window.electron.ipcRenderer.removeListener(channel, listener),
                isElectron: true
            };

            setIpcService(service);
        } else {
            console.warn('Electron IPC renderer not available. Running in browser mode?');
        }
    }, []);

    return ipcService;
}  