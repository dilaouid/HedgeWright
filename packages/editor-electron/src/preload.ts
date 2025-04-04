// packages\editor-electron\src\preload.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, ...args: unknown[]) => {
      console.log(`Preload: Invoking channel ${channel} with args:`, args);
      return ipcRenderer.invoke(channel, ...args);
    },

    on: (channel: string, func: (...args: any[]) => void) => {
      const validChannels = [
        'file-saved',
        'file-opened',
        'game-exported',
        'asset:added',
        'asset:removed',
        'asset:error'
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (_, ...args) => func(...args));
      }
    },
    once: (channel: string, func: (...args: any[]) => void) => {
      const validChannels = [
        'file-saved',
        'file-opened',
        'game-exported',
        'asset:added',
        'asset:removed',
        'asset:error'
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.once(channel, (_, ...args) => func(...args));
      }
    },
    removeListener: (channel: string, func: (...args: any[]) => void) => {
      ipcRenderer.removeListener(channel, func);
    }
  }
});

// Log to confirm preload script has run
console.log('Preload script executed');