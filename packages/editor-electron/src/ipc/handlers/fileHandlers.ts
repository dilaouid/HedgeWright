import { ipcMain, dialog, BrowserWindow } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

/**
 * Register all file-related IPC handlers
 */
export function registerFileHandlers() {
    console.log('Registering file IPC handlers...');

    // Read a file
    ipcMain.handle('file:read', async (_, filePath: string) => {
        try {
            console.log(`Reading file: ${filePath}`);
            const content = await fs.readFile(filePath, 'utf-8');
            return content;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error reading file: ${errorMessage}`);
            throw new Error(`Cannot read file: ${errorMessage}`);
        }
    });

    // Write to a file
    ipcMain.handle('file:write', async (_, filePath: string, content: string) => {
        try {
            console.log(`Writing to file: ${filePath}`);
            // Ensure directory exists
            const dir = path.dirname(filePath);
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
            }

            // Write the file
            await fs.writeFile(filePath, content, 'utf-8');
            return true;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error writing file: ${errorMessage}`);
            throw new Error(`Cannot write to file: ${errorMessage}`);
        }
    });

    // Check if a file exists
    ipcMain.handle('file:exists', async (_, filePath: string) => {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    });

    // Delete a file
    ipcMain.handle('file:delete', async (_, filePath: string) => {
        try {
            await fs.unlink(filePath);
            return true;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error deleting file: ${errorMessage}`);
            throw new Error(`Cannot delete file: ${errorMessage}`);
        }
    });

    // Copy a file
    ipcMain.handle('file:copy', async (_, sourcePath: string, destinationPath: string) => {
        try {
            await fs.copyFile(sourcePath, destinationPath);
            return true;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error copying file: ${errorMessage}`);
            throw new Error(`Cannot copy file: ${errorMessage}`);
        }
    });

    // List files in a directory
    ipcMain.handle('file:list', async (_, dirPath: string, pattern?: string) => {
        try {
            const files = await fs.readdir(dirPath);
            if (pattern) {
                const regex = new RegExp(pattern);
                return files.filter(file => regex.test(file)).map(file => path.join(dirPath, file));
            }
            return files.map(file => path.join(dirPath, file));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error listing files: ${errorMessage}`);
            throw new Error(`Cannot list files: ${errorMessage}`);
        }
    });

    // Save dialog
    ipcMain.handle('dialog:showSaveDialog', async (event, options) => {
        console.log('Opening save dialog with options:', options);
        const window = BrowserWindow.fromWebContents(event.sender) || BrowserWindow.getFocusedWindow();
        if (!window) {
            console.error('No window found for save dialog');
            throw new Error('No window found');
        }

        try {
            const result = await dialog.showSaveDialog(window, {
                title: options?.title || 'Save file',
                defaultPath: options?.defaultPath,
                filters: options?.filters || [
                    { name: 'All Files', extensions: ['*'] }
                ],
                properties: ['createDirectory', ...(options?.properties || [])]
            });
            
            console.log('Save dialog result:', result);
            return result.filePath;
        } catch (error) {
            console.error('Save dialog error:', error);
            throw error;
        }
    });
    
    // Open dialog
    ipcMain.handle('dialog:showOpenDialog', async (event, options) => {
        console.log('Opening file dialog with options:', options);
        const window = BrowserWindow.fromWebContents(event.sender) || BrowserWindow.getFocusedWindow();
        if (!window) {
            console.error('No window found for open dialog');
            throw new Error('No window found');
        }

        try {
            const result = await dialog.showOpenDialog(window, {
                title: options?.title || 'Open file',
                defaultPath: options?.defaultPath,
                filters: options?.filters || [
                    { name: 'All Files', extensions: ['*'] }
                ],
                properties: options?.properties || ['openFile']
            });
            
            console.log('Open dialog result:', result);
            return result.filePaths;
        } catch (error) {
            console.error('Open dialog error:', error);
            throw error;
        }
    });

    // Game-specific handlers
    ipcMain.handle('save-project', async (event, data) => {
        console.log('Handling save-project request');
        const window = BrowserWindow.fromWebContents(event.sender) || BrowserWindow.getFocusedWindow();
        if (!window) {
            console.error('No window found for save-project dialog');
            throw new Error('No window found');
        }

        try {
            const result = await dialog.showSaveDialog(window, {
                title: 'Save Project',
                filters: [{ name: 'HedgeWright Project', extensions: ['aalevel'] }],
                properties: ['createDirectory']
            });

            if (result.filePath) {
                await fs.writeFile(result.filePath, JSON.stringify(data, null, 2), 'utf-8');
                return result.filePath;
            }
            return null;
        } catch (error) {
            console.error('Save project error:', error);
            throw error;
        }
    });

    ipcMain.handle('load-project', async (event) => {
        console.log('Handling load-project request');
        const window = BrowserWindow.fromWebContents(event.sender) || BrowserWindow.getFocusedWindow();
        if (!window) {
            console.error('No window found for load-project dialog');
            throw new Error('No window found');
        }

        try {
            const result = await dialog.showOpenDialog(window, {
                title: 'Open Project',
                filters: [{ name: 'HedgeWright Project', extensions: ['aalevel'] }],
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
        } catch (error) {
            console.error('Load project error:', error);
            throw error;
        }
    });

    ipcMain.handle('export-game', async (event, format) => {
        console.log('Handling export-game request, format:', format);
        const window = BrowserWindow.fromWebContents(event.sender) || BrowserWindow.getFocusedWindow();
        if (!window) {
            console.error('No window found for export-game dialog');
            throw new Error('No window found');
        }

        try {
            const result = await dialog.showSaveDialog(window, {
                title: 'Export Game',
                filters: [{ name: 'HedgeWright Game', extensions: ['aagame'] }],
                properties: ['createDirectory']
            });

            return result.filePath;
        } catch (error) {
            console.error('Export game error:', error);
            throw error;
        }
    });

    console.log('File IPC handlers registered successfully');
}