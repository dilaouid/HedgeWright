// Fichier preload pour Electron
// Expose les APIs nécessaires pour l'application

import { contextBridge, ipcRenderer } from 'electron';

// Expose les fonctions IPC protégées à travers une API contextBridge
contextBridge.exposeInMainWorld('electron', {
  // Fonctions pour communiquer avec le processus principal
  send: (channel: string, data: any) => {
    // Liste blanche des canaux autorisés
    const validChannels = ['save-file', 'open-file', 'export-game'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: string, func: Function) => {
    // Liste blanche des canaux autorisés
    const validChannels = ['file-saved', 'file-opened', 'game-exported'];
    if (validChannels.includes(channel)) {
      // Supprime les anciens listeners pour éviter les doublons
      ipcRenderer.removeAllListeners(channel);
      // Ajoute un nouveau listener
      ipcRenderer.on(channel, (_, ...args) => func(...args));
    }
  },
  // Fonctions spécifiques à Ace Attorney
  gameSystem: {
    saveProject: (data: any) => ipcRenderer.invoke('save-project', data),
    loadProject: () => ipcRenderer.invoke('load-project'),
    exportGame: (format: string) => ipcRenderer.invoke('export-game', format),
  }
});
