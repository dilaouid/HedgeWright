import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useToast } from './ToastProvider';

// Import the types for your file system service
/* interface FileSystemService {
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  exists: (path: string) => Promise<boolean>;
  mkdir: (path: string) => Promise<void>;
  readDir: (path: string) => Promise<string[]>;
  unlink: (path: string) => Promise<void>;
  stat: (path: string) => Promise<any>;
} */

/**
 * Interface for the file router context
 */
interface FileRouterContextType {
  openFile: (options?: {
    extensions?: string[];
    multiple?: boolean;
    defaultPath?: string;
  }) => Promise<string[] | null>;
  saveFile: (
    data: string,
    options?: {
      suggestedName?: string;
      extension?: string;
      defaultPath?: string;
    }
  ) => Promise<string | null>;
  selectDirectory: (options?: {
    defaultPath?: string;
  }) => Promise<string | null>;
  recentFiles: string[];
  addRecentFile: (path: string) => void;
  clearRecentFiles: () => void;
  isElectron: boolean;
}

// This section previously contained an unused web file system service
// If you need to implement file system operations for web, you can uncomment and use this
/*
const webFileSystemService: FileSystemService = {
  readFile: async () => {
    throw new Error('Not supported in web browser');
  },
  writeFile: async () => {
    throw new Error('Not supported in web browser');
  },
  exists: async () => false,
  mkdir: async () => {
    throw new Error('Not supported in web browser');
  },
  readDir: async () => [],
  unlink: async () => {
    throw new Error('Not supported in web browser');
  },
  stat: async () => {
    throw new Error('Not supported in web browser');
  },
};
*/

// Create the context with default values
const FileRouterContext = createContext<FileRouterContextType>({
  openFile: async () => null,
  saveFile: async () => null,
  selectDirectory: async () => null,
  recentFiles: [],
  addRecentFile: () => {},
  clearRecentFiles: () => {},
  isElectron: false,
});

/**
 * Hook for using the file router context
 */
export const useFileRouter = () => useContext(FileRouterContext);

interface FileRouterProviderProps {
  children: ReactNode;
}

/**
 * File router provider component for handling file operations
 * Provides a unified interface for file operations in Electron and web environments
 */
export const FileRouterProvider: React.FC<FileRouterProviderProps> = ({
  children,
}) => {
  const [isElectron, setIsElectron] = useState(false);
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const toast = useToast();

  // Check if running in Electron
  useEffect(() => {
    // This is a reliable way to detect Electron environment
    const isElectronEnv =
      window && 'process' in window && (window as any).process?.type === 'renderer';
    setIsElectron(isElectronEnv);

    // Load recent files from localStorage
    const storedRecentFiles = localStorage.getItem('hedgewright_recent_files');
    if (storedRecentFiles) {
      try {
        setRecentFiles(JSON.parse(storedRecentFiles));
      } catch (error) {
        console.error('Failed to parse recent files', error);
        localStorage.removeItem('hedgewright_recent_files');
      }
    }
  }, []);

  // Add a file to recent files
  const addRecentFile = (path: string) => {
    setRecentFiles((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter((p) => p !== path);
      // Add to beginning
      const updated = [path, ...filtered].slice(0, 10); // Keep only most recent 10 files

      // Save to localStorage
      localStorage.setItem('hedgewright_recent_files', JSON.stringify(updated));

      return updated;
    });
  };

  // Clear recent files
  const clearRecentFiles = () => {
    setRecentFiles([]);
    localStorage.removeItem('hedgewright_recent_files');
  };

  // Function to open file(s)
  const openFile = async (options?: {
    extensions?: string[];
    multiple?: boolean;
    defaultPath?: string;
  }): Promise<string[] | null> => {
    try {
      if (isElectron) {
        // Use Electron IPC to open file dialog
        const { ipcRenderer } = window.require('electron');
        const result = await ipcRenderer.invoke('file:open', options);

        if (result && result.filePaths && result.filePaths.length > 0) {
          // Add the first file to recent files (if multiple is false)
          if (!options?.multiple && result.filePaths[0]) {
            addRecentFile(result.filePaths[0]);
          }

          return result.filePaths;
        }
      } else {
        // Web fallback using the File System Access API (if available)
        if ('showOpenFilePicker' in window) {
          const pickerOpts: any = {
            multiple: options?.multiple || false,
            types: [],
          };

          if (options?.extensions && options.extensions.length > 0) {
            pickerOpts.types.push({
              description: 'Supported files',
              accept: {
                'application/octet-stream': options.extensions.map(
                  (ext) => `.${ext}`
                ),
              },
            });
          }

          try {
            const fileHandles = await (window as any).showOpenFilePicker(
              pickerOpts
            );
            if (fileHandles.length > 0) {
              const filePaths = await Promise.all(
                fileHandles.map(async (handle: any) => {
                  const file = await handle.getFile();
                  return URL.createObjectURL(file);
                })
              );

              return filePaths;
            }
          } catch (err) {
            // User might have cancelled the operation
            if ((err as any).name !== 'AbortError') {
              throw err;
            }
          }
        } else {
          // Fallback for browsers without File System Access API
          toast.warning(
            'File access is limited in web browsers. Consider using the desktop app.'
          );

          // Use the old file input method
          return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';

            if (options?.multiple) {
              input.multiple = true;
            }

            if (options?.extensions && options.extensions.length > 0) {
              input.accept = options.extensions
                .map((ext) => `.${ext}`)
                .join(',');
            }

            input.onchange = () => {
              if (input.files && input.files.length > 0) {
                const filePaths = Array.from(input.files).map((file) =>
                  URL.createObjectURL(file)
                );
                resolve(filePaths);
              } else {
                resolve(null);
              }
            };

            input.click();
          });
        }
      }
    } catch (error) {
      console.error('Error opening file:', error);
      toast.error('Failed to open file');
    }

    return null;
  };

  // Function to save a file
  const saveFile = async (
    data: string,
    options?: {
      suggestedName?: string;
      extension?: string;
      defaultPath?: string;
    }
  ): Promise<string | null> => {
    try {
      if (isElectron) {
        // Use Electron IPC to save file
        const { ipcRenderer } = window.require('electron');
        const result = await ipcRenderer.invoke('file:save', {
          ...options,
          data,
        });

        if (result && result.filePath) {
          addRecentFile(result.filePath);
          return result.filePath;
        }
      } else {
        // Web fallback using the File System Access API (if available)
        if ('showSaveFilePicker' in window) {
          const pickerOpts: any = {
            suggestedName: options?.suggestedName || 'untitled',
            types: [],
          };

          if (options?.extension) {
            pickerOpts.types.push({
              description: 'Project file',
              accept: {
                'application/octet-stream': [`.${options.extension}`],
              },
            });
          }

          try {
            const fileHandle = await (window as any).showSaveFilePicker(
              pickerOpts
            );
            const writable = await fileHandle.createWritable();
            await writable.write(data);
            await writable.close();

            // We can't get the actual path in the web version
            return fileHandle.name;
          } catch (err) {
            // User might have cancelled the operation
            if ((err as any).name !== 'AbortError') {
              throw err;
            }
          }
        } else {
          // Fallback for browsers without File System Access API
          toast.warning(
            'File saving is limited in web browsers. Consider using the desktop app.'
          );

          // Create a download
          const blob = new Blob([data], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = options?.suggestedName || 'untitled';
          if (options?.extension) {
            a.download += `.${options.extension}`;
          }

          a.click();
          URL.revokeObjectURL(url);
          return a.download;
        }
      }
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Failed to save file');
    }

    return null;
  };

  // Function to select a directory
  const selectDirectory = async (options?: {
    defaultPath?: string;
  }): Promise<string | null> => {
    try {
      if (isElectron) {
        // Use Electron IPC to select directory
        const { ipcRenderer } = window.require('electron');
        const result = await ipcRenderer.invoke(
          'file:select-directory',
          options
        );

        if (result && result.directoryPath) {
          return result.directoryPath;
        }
      } else {
        // Web fallback - directory selection is limited in browsers
        toast.warning(
          'Directory selection is not available in web browsers. Consider using the desktop app.'
        );
      }
    } catch (error) {
      console.error('Error selecting directory:', error);
      toast.error('Failed to select directory');
    }

    return null;
  };

  return (
    <FileRouterContext.Provider
      value={{
        openFile,
        saveFile,
        selectDirectory,
        recentFiles,
        addRecentFile,
        clearRecentFiles,
        isElectron,
      }}
    >
      {children}
    </FileRouterContext.Provider>
  );
};

export default FileRouterProvider;
