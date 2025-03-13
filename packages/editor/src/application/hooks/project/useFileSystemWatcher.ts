/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react';
import { useIpcService } from '../../../infrastructure/electron/services/useIpcService';
import { useProjectStore } from '../../state/project/projectStore';
import { toast } from 'sonner';
import { getRelativePath } from '@hedgewright/common';
import path from 'path-browserify';
import { useFileSystemService } from '@/infrastructure/filesystem/services/useFileSystemService';
interface FileWatcherStatus {
    isActive: boolean;
    projectPath: string | null;
    watchedFiles: number;
}

const assetFileExtensions = [
    '.png', '.jpg', '.jpeg', '.webp', '.gif', // Images
    '.mp3', '.wav', '.ogg' // Audio
];


export function useFileSystemWatcher() {
    const ipcService = useIpcService();
    const { currentProject, updateProject } = useProjectStore();
    const [status, setStatus] = useState<FileWatcherStatus>({
        isActive: false,
        projectPath: null,
        watchedFiles: 0
    });
    const [isReady, setIsReady] = useState(false);
    const [scanProgress] = useState<{ [folder: string]: { total: number, processed: number } }>({});
    const [isScanning] = useState(false);
    const { listFiles } = useFileSystemService();

    const watchForAssetChanges = useCallback((projectPath: string) => {
        if (!ipcService.isElectron) return; // Only in Electron

        ipcService.invoke('file:watch', projectPath, assetFileExtensions)
            .then(() => console.log('Watching for asset changes in:', projectPath))
            .catch(err => console.error('Error setting up asset file watch:', err));

        // Set up event listeners for asset changes
        window.electron.ipcRenderer.on('asset:added', (filePath: string) => {
            console.log('New asset detected:', filePath);
            // Here you'd update your asset store or trigger a rescan
            scanExistingAssets(projectPath); // Use your existing function or call a function to reload assets
        });

        window.electron.ipcRenderer.on('asset:removed', (filePath: string) => {
            console.log('Asset removed:', filePath);
            // Update your asset store
            scanExistingAssets(projectPath);
        });
    }, [ipcService]);

    // Check if we're in Electron environment
    useEffect(() => {
        // If window.electron exists, we're in Electron
        setIsReady(!!window.electron?.ipcRenderer);
    }, []);

    // Start watching when a project is loaded
    useEffect(() => {
        // Skip if not ready or no project loaded
        if (!isReady || !currentProject) return;

        const startWatcher = async () => {
            try {
                const result = await ipcService.invoke('watcher:start', currentProject.projectFolderPath);
                if (result.success) {
                    toast.success('File system watcher started');
                    refreshStatus();

                    watchForAssetChanges(currentProject.projectFolderPath);
                } else {
                    console.warn(`Failed to start file watcher: ${result.message}`);
                }
            } catch (error) {
                console.error('Error starting file watcher:', error);
            }
        };

        startWatcher();

        // Cleanup on unmount
        return () => {
            if (isReady) {
                ipcService.invoke('watcher:stop').catch(err => {
                    console.error('Error stopping watcher:', err);
                });

                // Clean up event listeners
                window.electron.ipcRenderer.removeListener('asset:added', () => { });
                window.electron.ipcRenderer.removeListener('asset:removed', () => { });
            }
        };
    }, [isReady, currentProject?.projectFolderPath, ipcService, watchForAssetChanges]);


    // Function to refresh the watcher status
    const refreshStatus = useCallback(async () => {
        if (!isReady) return;

        try {
            const status = await ipcService.invoke('watcher:status');
            setStatus(status);
        } catch (error) {
            console.error('Error getting watcher status:', error);
        }
    }, [isReady, ipcService]);

    // Function to scan existing assets when opening a project
    const scanExistingAssets = async (projectFolderPath: string) => {
        try {
            console.log('Scanning for assets in:', projectFolderPath);

            // Structure des dossiers à scanner
            const folderPaths = {
                'img/backgrounds': 'backgrounds',
                'img/characters': 'characters',
                'img/profiles': 'profiles',
                'img/evidences': 'evidences',
                'img/effects': 'effects',
                'audio/bgm': 'bgm',
                'audio/sfx': 'sfx',
                'audio/voices': 'voices'
            };

            // Collecter tous les fichiers
            const updatedFolders = {
                audio: { bgm: [] as string[], sfx: [] as string[], voices: [] as string[] },
                img: { backgrounds: [] as string[], characters: [] as string[], profiles: [] as string[], evidences: [] as string[], ui: [] as string[], effects: [] as string[] },
                documents: [] as string[],
                data: [] as string[]
            };

            // Scanner chaque dossier
            for (const [folderPath, category] of Object.entries(folderPaths)) {
                const fullPath = path.join(projectFolderPath, folderPath);
                try {
                    const files = await listFiles(fullPath);

                    // Déterminer où stocker les chemins relatifs
                    if (folderPath.startsWith('img/')) {
                        const imgCategory = category as keyof typeof updatedFolders.img;
                        if (imgCategory in updatedFolders.img) {
                            updatedFolders.img[imgCategory] = files.map(file =>
                                getRelativePath(file, projectFolderPath)
                            );
                        }
                    } else if (folderPath.startsWith('audio/')) {
                        const audioCategory = category as keyof typeof updatedFolders.audio;
                        if (audioCategory in updatedFolders.audio) {
                            updatedFolders.audio[audioCategory] = files.map(file =>
                                getRelativePath(file, projectFolderPath)
                            );
                        }
                    }

                    console.log(`Found ${files.length} files in ${folderPath}`);
                } catch (err) {
                    console.warn(`Could not scan ${fullPath}:`, err);
                }
            }

            // Mettre à jour le projet
            updateProject(draft => {
                draft.folders = updatedFolders;
            });

            console.log('Asset scan complete, found:', updatedFolders);
        } catch (error) {
            console.error('Error scanning assets:', error);
        }
    };


    return {
        status,
        refreshStatus,
        scanExistingAssets,
        isReady,
        scanProgress,
        isScanning
    };
}