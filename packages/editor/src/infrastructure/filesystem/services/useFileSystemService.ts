import { useIpcService } from '@/infrastructure/electron/services/useIpcService';
import { useState, useCallback } from 'react';

interface FileDialogOptions {
    title?: string;
    defaultPath?: string;
    filters?: Array<{
        name: string;
        extensions: string[];
    }>;
    buttonLabel?: string;
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

// File system service that works in the browser for development
// It uses localStorage to simulate file storage
const browserFileSystemService = () => {
    const getStorageKey = (path: string) => `hedgewright_file_${path}`;
    
    return {
        readFile: async (filePath: string): Promise<string> => {
            const key = getStorageKey(filePath);
            const data = localStorage.getItem(key);
            if (!data) {
                throw new Error(`File not found: ${filePath}`);
            }
            return data;
        },
        
        writeFile: async (filePath: string, content: string): Promise<void> => {
            const key = getStorageKey(filePath);
            localStorage.setItem(key, content);
        },
        
        readJsonFile: async <T>(filePath: string): Promise<T> => {
            const key = getStorageKey(filePath);
            const data = localStorage.getItem(key);
            if (!data) {
                throw new Error(`File not found: ${filePath}`);
            }
            return JSON.parse(data) as T;
        },
        
        writeJsonFile: async <T>(filePath: string, data: T): Promise<void> => {
            const key = getStorageKey(filePath);
            localStorage.setItem(key, JSON.stringify(data));
        },
        
        fileExists: async (filePath: string): Promise<boolean> => {
            const key = getStorageKey(filePath);
            return localStorage.getItem(key) !== null;
        },
        
        deleteFile: async (filePath: string): Promise<void> => {
            const key = getStorageKey(filePath);
            localStorage.removeItem(key);
        },
        
        copyFile: async (sourcePath: string, destinationPath: string): Promise<void> => {
            const sourceKey = getStorageKey(sourcePath);
            const destKey = getStorageKey(destinationPath);
            const data = localStorage.getItem(sourceKey);
            if (!data) {
                throw new Error(`Source file not found: ${sourcePath}`);
            }
            localStorage.setItem(destKey, data);
        },
        
        showSaveDialog: async (options?: FileDialogOptions): Promise<string | null> => {
            // In browser mode, generate a simulated path
            const filename = options?.defaultPath || 'untitled';
            return `browser://${filename}`;
        },
        
        showOpenDialog: async (options?: FileDialogOptions): Promise<string | null> => {
            // This could show a custom file browser dialog in the browser
            // For now, just return null to simulate cancelled dialog
            return null;
        },
        
        listFiles: async (dirPath: string, pattern?: string): Promise<string[]> => {
            // List any localStorage keys that match our path prefix
            const prefix = getStorageKey(dirPath);
            const files: string[] = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i) || '';
                if (key.startsWith(prefix)) {
                    // Convert storage key back to file path
                    const path = key.replace('hedgewright_file_', '');
                    files.push(path);
                }
            }
            
            return files;
        },
        
        createDirectory: async (dirPath: string): Promise<void> => {
            // In browser mode, directories are virtual
            // We don't need to do anything specific here
            return Promise.resolve();
        }
    };
};

export function useFileSystemService() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { invoke, isElectron } = useIpcService();
    const browserFs = useCallback(browserFileSystemService, [])();

    // Helper to execute operations with loading/error states
    const executeWithState = async <T>(
        operation: () => Promise<T>,
        errorMessage: string
    ): Promise<T> => {
        try {
            setLoading(true);
            setError(null);
            const result = await operation();
            setLoading(false);
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(errorMessage);
            setError(error);
            setLoading(false);
            throw error;
        }
    };

    /**
     * Read a file as text
     */
    const readFile = async (filePath: string): Promise<string> => {
        return executeWithState(
            async () => {
                if (isElectron) {
                    return await invoke('file:read', filePath);
                } else {
                    return await browserFs.readFile(filePath);
                }
            },
            'Failed to read file'
        );
    };

    /**
     * Write a text file
     */
    const writeFile = async (filePath: string, content: string): Promise<void> => {
        return executeWithState(
            async () => {
                if (isElectron) {
                    await invoke('file:write', filePath, content);
                } else {
                    await browserFs.writeFile(filePath, content);
                }
            },
            'Failed to write file'
        );
    };

    /**
     * Read a JSON file and parse its contents
     */
    const readJsonFile = async <T>(filePath: string): Promise<T> => {
        return executeWithState(
            async () => {
                if (isElectron) {
                    const fileContent = await readFile(filePath);
                    return JSON.parse(fileContent);
                } else {
                    return browserFs.readJsonFile<T>(filePath);
                }
            },
            'Failed to read JSON file'
        );
    };

    /**
     * Write a JSON file
     */
    const writeJsonFile = async <T>(filePath: string, data: T): Promise<void> => {
        return executeWithState(
            async () => {
                if (isElectron) {
                    const jsonString = JSON.stringify(data, null, 2);
                    await writeFile(filePath, jsonString);
                } else {
                    await browserFs.writeJsonFile(filePath, data);
                }
            },
            'Failed to write JSON file'
        );
    };

    /**
     * Check if a file exists
     */
    const fileExists = async (filePath: string): Promise<boolean> => {
        try {
            if (isElectron) {
                return await invoke('file:exists', filePath);
            } else {
                return await browserFs.fileExists(filePath);
            }
        } catch (err) {
            return false;
        }
    };

    /**
     * Delete a file
     */
    const deleteFile = async (filePath: string): Promise<void> => {
        return executeWithState(
            async () => {
                if (isElectron) {
                    await invoke('file:delete', filePath);
                } else {
                    await browserFs.deleteFile(filePath);
                }
            },
            'Failed to delete file'
        );
    };

    /**
     * Copy a file
     */
    const copyFile = async (sourcePath: string, destinationPath: string): Promise<void> => {
        return executeWithState(
            async () => {
                if (isElectron) {
                    await invoke('file:copy', sourcePath, destinationPath);
                } else {
                    await browserFs.copyFile(sourcePath, destinationPath);
                }
            },
            'Failed to copy file'
        );
    };

    /**
     * Create a directory
     */
    const createDirectory = async (dirPath: string): Promise<void> => {
        return executeWithState(
            async () => {
                if (isElectron) {
                    await invoke('file:createDirectory', dirPath);
                } else {
                    await browserFs.createDirectory(dirPath);
                }
            },
            'Failed to create directory'
        );
    };

    /**
     * Show a file save dialog
     */
    const showSaveDialog = async (options?: FileDialogOptions): Promise<string | null> => {
        return executeWithState(
            async () => {
                if (isElectron) {
                    return await invoke('dialog:showSaveDialog', options);
                } else {
                    return await browserFs.showSaveDialog(options);
                }
            },
            'Failed to show save dialog'
        );
    };

    /**
     * Show a file open dialog
     */
    const showOpenDialog = async (options?: FileDialogOptions): Promise<string | null> => {
        return executeWithState(
            async () => {
                if (isElectron) {
                    const filePaths = await invoke('dialog:showOpenDialog', options);
                    return Array.isArray(filePaths) && filePaths.length > 0 ? filePaths[0] : null;
                } else {
                    return await browserFs.showOpenDialog(options);
                }
            },
            'Failed to show open dialog'
        );
    };

    /**
     * List files in a directory
     */
    const listFiles = async (dirPath: string, pattern?: string): Promise<string[]> => {
        return executeWithState(
            async () => {
                if (isElectron) {
                    return await invoke('file:list', dirPath, pattern);
                } else {
                    return await browserFs.listFiles(dirPath, pattern);
                }
            },
            'Failed to list files'
        );
    };

    return {
        readFile,
        writeFile,
        readJsonFile,
        writeJsonFile,
        fileExists,
        deleteFile,
        copyFile,
        createDirectory,
        showSaveDialog,
        showOpenDialog,
        listFiles,
        loading,
        error,
        isElectron
    };
}