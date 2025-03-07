// electron/ipc/handlers/fileHandlers.ts
import { ipcMain, dialog, BrowserWindow } from 'electron';
import fs from 'fs/promises';
import path from 'path';

/**
 * Register all file-related IPC handlers
 */
export function registerFileHandlers() {
    // Lire un fichier
    ipcMain.handle('file:read', async (_, filePath: string) => {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            return content;
        } catch (error: any) {
            throw new Error(`Impossible de lire le fichier: ${error.message}`);
        }
    });

    // Écrire dans un fichier
    ipcMain.handle('file:write', async (_, filePath: string, content: string) => {
        try {
            // Assurer que le dossier existe
            const dir = path.dirname(filePath);
            await fs.mkdir(dir, { recursive: true });

            // Écrire le fichier
            await fs.writeFile(filePath, content, 'utf-8');
        } catch (error: any) {
            throw new Error(`Impossible d'écrire dans le fichier: ${error.message}`);
        }
    });

    // Vérifier si un fichier existe
    ipcMain.handle('file:exists', async (_, filePath: string) => {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    });

    // Dialogue d'enregistrement de fichier
    ipcMain.handle('dialog:save', async (event, options) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        if (!window) throw new Error('No window found');

        const { filePath } = await dialog.showSaveDialog(window, {
            title: options.title || 'Enregistrer le fichier',
            defaultPath: options.defaultPath,
            filters: options.filters || [
                { name: 'All Files', extensions: ['*'] }
            ],
            properties: ['createDirectory']
        });

        return filePath;
    });
    // Dialogue d'ouverture de fichier
    ipcMain.handle('dialog:open', async (event, options) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        if (!window) throw new Error('No window found');

        const result = await dialog.showOpenDialog(window, {
            title: options.title || 'Ouvrir un fichier',
            filters: options.filters || [
                { name: 'All Files', extensions: ['*'] }
            ],
            properties: options.properties || ['openFile']
        });

        return result.filePaths;
    });
}