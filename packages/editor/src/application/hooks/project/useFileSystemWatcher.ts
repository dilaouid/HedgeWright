/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react';
import { useIpcService } from '../../../infrastructure/electron/services/useIpcService';
import { useProjectStore } from '../../state/project/projectStore';
import { toast } from 'sonner';

interface FileWatcherStatus {
    isActive: boolean;
    projectPath: string | null;
    watchedFiles: number;
}

export function useFileSystemWatcher() {
    const ipcService = useIpcService();
    const { currentProject, updateProject } = useProjectStore();
    const [status, setStatus] = useState<FileWatcherStatus>({
        isActive: false,
        projectPath: null,
        watchedFiles: 0
    });
    const [isReady, setIsReady] = useState(false);
    const [scanProgress, setScanProgress] = useState<{ [folder: string]: { total: number, processed: number } }>({});
    const [isScanning, setIsScanning] = useState(false);

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
            }
        };
    }, [isReady, currentProject?.projectFolderPath, ipcService]);

    // Set up listeners for asset changes
    useEffect(() => {
        if (!isReady || !currentProject) return;

        // Ajouter ces handlers
        const handleAssetBatch = (assets: any[]) => {
            if (!assets.length) return;

            updateProject(draft => {
                for (const asset of assets) {
                    if (asset.type === 'bgm' || asset.type === 'sfx' || asset.type === 'voice') {
                        // Music asset
                        const existingIndex = draft.music.findIndex(m => m.id === asset.id);
                        if (existingIndex >= 0) {
                            draft.music[existingIndex] = asset;
                        } else {
                            draft.music.push(asset);
                        }
                    } else {
                        // Regular asset
                        const existingIndex = draft.assets.findIndex(a => a.id === asset.id);
                        if (existingIndex >= 0) {
                            draft.assets[existingIndex] = asset;
                        } else {
                            draft.assets.push(asset);
                        }

                        // Add to collections if needed
                        if (asset.category === 'evidence' && !draft.evidence.includes(asset.id)) {
                            draft.evidence.push(asset.id);
                        } else if (asset.category === 'profile' && !draft.profiles.includes(asset.id)) {
                            draft.profiles.push(asset.id);
                        }
                    }
                }
            });

            console.log(`Added batch of ${assets.length} assets`);
        };

        const handleScanProgress = (progress: { folder: string, total: number, processed: number }) => {
            setScanProgress(prev => ({
                ...prev,
                [progress.folder]: { total: progress.total, processed: progress.processed }
            }));
        };

        const handleScanComplete = () => {
            setIsScanning(false);
            toast.success('Asset scan completed');
            refreshStatus();
        };

        // Enregistrer les nouveaux event listeners
        ipcService.on('asset:addedBatch', handleAssetBatch);
        ipcService.on('asset:scanProgress', handleScanProgress);
        ipcService.on('asset:scanComplete', handleScanComplete);

        // Nettoyer
        return () => {
            ipcService.removeListener('asset:addedBatch', handleAssetBatch);
            ipcService.removeListener('asset:scanProgress', handleScanProgress);
            ipcService.removeListener('asset:scanComplete', handleScanComplete);
            // Autres listeners à nettoyer...
        };
    }, [isReady, currentProject, updateProject, ipcService]);


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
    const scanExistingAssets = useCallback(async (projectPath: string) => {
        if (!isReady) {
            console.warn('Cannot scan assets - IPC service not ready');
            return;
        }

        try {
            const result = await ipcService.invoke('watcher:scanExisting', projectPath);
            if (result.success) {
                toast.success('Asset scan completed');
                refreshStatus();
            } else {
                console.warn(`Failed to scan assets: ${result.message}`);
            }
        } catch (error) {
            console.error('Error scanning assets:', error);
        }
    }, [isReady, ipcService, refreshStatus]);

    return {
        status,
        refreshStatus,
        scanExistingAssets,
        isReady,
        scanProgress,
        isScanning
    };
}