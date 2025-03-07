import { useIpcService } from '@/infrastructure/electron/services/useIpcService';
import { useState } from 'react';

interface FileDialogOptions {
    title?: string;
    defaultPath?: string;
    filters?: Array<{
        name: string;
        extensions: string[];
    }>;
    properties?: Array<
        | 'openFile'
        | 'openDirectory'
        | 'multiSelections'
        | 'createDirectory'
        | 'promptToCreate'
        | 'noResolveAliases'
        | 'treatPackageAsDirectory'
        | 'dontAddToRecent'
    >;
}

export function useFileSystemService() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const ipcService = useIpcService();

    /**
     * Read a JSON file and parse its contents
     */
    const readJsonFile = async <T>(filePath: string): Promise<T> => {
        try {
            setLoading(true);
            setError(null);

            const fileContent = await ipcService.invoke('file:read', filePath);
            const parsedContent = JSON.parse(fileContent);

            setLoading(false);
            return parsedContent;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to read JSON file');
            setError(error);
            setLoading(false);
            throw error;
        }
    };

    /**
     * Write a JSON file
     */
    const writeJsonFile = async <T>(filePath: string, data: T): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const jsonString = JSON.stringify(data, null, 2);
            await ipcService.invoke('file:write', filePath, jsonString);

            setLoading(false);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to write JSON file');
            setError(error);
            setLoading(false);
            throw error;
        }
    };

    /**
     * Check if a file exists
     */
    const fileExists = async (filePath: string): Promise<boolean> => {
        try {
            return await ipcService.invoke('file:exists', filePath);
        } catch (err) {
            return false;
        }
    };

    /**
     * Delete a file
     */
    const deleteFile = async (filePath: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            await ipcService.invoke('file:delete', filePath);

            setLoading(false);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to delete file');
            setError(error);
            setLoading(false);
            throw error;
        }
    };

    /**
     * Copy a file
     */
    const copyFile = async (sourcePath: string, destinationPath: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            await ipcService.invoke('file:copy', sourcePath, destinationPath);

            setLoading(false);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to copy file');
            setError(error);
            setLoading(false);
            throw error;
        }
    };

    /**
     * Show a file save dialog
     */
    const showSaveDialog = async (options?: FileDialogOptions): Promise<string | null> => {
        try {
            setLoading(true);
            setError(null);

            const filePath = await ipcService.invoke('dialog:showSaveDialog', options);

            setLoading(false);
            return filePath || null;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to show save dialog');
            setError(error);
            setLoading(false);
            throw error;
        }
    };

    /**
     * Show a file open dialog
     */
    const showOpenDialog = async (options?: FileDialogOptions): Promise<string | null> => {
        try {
            setLoading(true);
            setError(null);

            const filePaths = await ipcService.invoke('dialog:showOpenDialog', options);

            setLoading(false);
            return Array.isArray(filePaths) && filePaths.length > 0 ? filePaths[0] : null;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to show open dialog');
            setError(error);
            setLoading(false);
            throw error;
        }
    };

    /**
     * List files in a directory
     */
    const listFiles = async (dirPath: string, pattern?: string): Promise<string[]> => {
        try {
            setLoading(true);
            setError(null);

            const files = await ipcService.invoke('file:list', dirPath, pattern);

            setLoading(false);
            return files;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to list files');
            setError(error);
            setLoading(false);
            throw error;
        }
    };

    return {
        readJsonFile,
        writeJsonFile,
        fileExists,
        deleteFile,
        copyFile,
        showSaveDialog,
        showOpenDialog,
        listFiles,
        loading,
        error
    };
}