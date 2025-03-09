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
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Impossible de lire le fichier: ${errorMessage}`);
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
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Impossible d'écrire dans le fichier: ${errorMessage}`);
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

        const result = await dialog.showSaveDialog(window, {
            title: options.title || 'Enregistrer le fichier',
            defaultPath: options.defaultPath,
            filters: options.filters || [
                { name: 'All Files', extensions: ['*'] }
            ],
            properties: ['createDirectory']
        });

        return result.filePath;
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

    // Handlers for game-specific functions
    ipcMain.handle('save-project', async (_, data) => {
        const window = BrowserWindow.getAllWindows()[0];
        if (!window) throw new Error('No window found');

        const result = await dialog.showSaveDialog(window, {
            title: 'Enregistrer le projet',
            filters: [{ name: 'HedgeWright Project', extensions: ['aaproject'] }],
            properties: ['createDirectory']
        });

        if (result.filePath) {
            await fs.writeFile(result.filePath, JSON.stringify(data, null, 2), 'utf-8');
            return result.filePath;
        }
        return null;
    });

    ipcMain.handle('load-project', async () => {
        const window = BrowserWindow.getAllWindows()[0];
        if (!window) throw new Error('No window found');

        const result = await dialog.showOpenDialog(window, {
            title: 'Ouvrir un projet',
            filters: [{ name: 'HedgeWright Project', extensions: ['aaproject'] }],
            properties: ['openFile']
        });

        if (result.filePaths.length > 0) {
            const content = await fs.readFile(result.filePaths[0], 'utf-8');
            return {
                filePath: result.filePaths[0],
                data: JSON.parse(content)
            };
        }
        return null;
    });

    ipcMain.handle('export-game', async () => {
        const window = BrowserWindow.getAllWindows()[0];
        if (!window) throw new Error('No window found');

        const result = await dialog.showSaveDialog(window, {
            title: 'Exporter le jeu',
            filters: [{ name: 'HedgeWright Game', extensions: ['aagame'] }],
            properties: ['createDirectory']
        });

        return result.filePath;
    });
}