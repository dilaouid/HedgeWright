import { useState, useEffect, useCallback } from 'react';
import path from 'path-browserify';
import { useProjectStore } from '@/application/state/project/projectStore';
import { useIpcService } from '@/infrastructure/electron/services/useIpcService';
import { getRelativePath, getCategoryFromPath, getAssetType } from '@hedgewright/common/utils/assetUtils';

export interface AssetMetadata {
    displayName?: string;
    category?: string;
    type?: 'image' | 'audio' | 'unknown';
    isSpecialAnimation?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface AssetWithMetadata {
    path: string;
    relativePath: string;
    metadata?: AssetMetadata;
}

export function useAssetManager() {
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState<AssetWithMetadata[]>([]);
    const [assetCounts, setAssetCounts] = useState({
        backgrounds: 0,
        characters: 0,
        effects: 0,
        evidence: 0,
        profiles: 0,
        bubbles: 0,
        specialAnimations: 0,
        audio: 0,
        images: 0,
        total: 0
    });

    const { currentProject } = useProjectStore();
    const { invoke, isElectron } = useIpcService();

    // Load all assets from the project folder
    const loadAssets = useCallback(async () => {
        if (!currentProject?.projectFolderPath) return;

        setLoading(true);

        try {
            let assetsList: AssetWithMetadata[] = [];
            
            if (isElectron) {
                // Use the IPC handler for faster scanning
                assetsList = await invoke('asset:scanDirectory', currentProject.projectFolderPath);
                
                // Ensure each asset has the proper metadata
                assetsList = assetsList.map(asset => {
                    // Get stored metadata from project if exists
                    const storedMetadata = currentProject.assetMetadata?.[asset.relativePath];
                    
                    // Ensure the category is set based on path if not explicitly defined
                    const category = 
                        storedMetadata?.category || 
                        getCategoryFromPath(asset.relativePath);
                    
                    // Get asset type based on extension
                    const type = getAssetType(asset.relativePath);
                    
                    return {
                        ...asset,
                        metadata: {
                            ...asset.metadata,
                            ...storedMetadata,
                            // Ensure these base properties always exist
                            category,
                            type,
                            displayName: storedMetadata?.displayName || 
                                asset.metadata?.displayName || 
                                path.basename(asset.relativePath, path.extname(asset.relativePath))
                        }
                    };
                });
            } else {
                // Browser implementation (simplified)
                // This might be expanded based on your browser file handling approach
                assetsList = [];
            }
            
            setAssets(assetsList);
            updateAssetCounts(assetsList);
        } catch (error) {
            console.error('Error loading assets:', error);
        } finally {
            setLoading(false);
        }
    }, [currentProject, invoke, isElectron]);

    // Update the asset counts
    const updateAssetCounts = useCallback((assetsList: AssetWithMetadata[]) => {
        const counts = {
            backgrounds: 0,
            characters: 0,
            effects: 0,
            evidence: 0,
            profiles: 0,
            bubbles: 0,
            specialAnimations: 0,
            audio: 0,
            images: 0,
            total: assetsList.length
        };

        assetsList.forEach(asset => {
            const category = asset.metadata?.category;
            const type = asset.metadata?.type;

            // Count by type
            if (type === 'image') counts.images++;
            if (type === 'audio') counts.audio++;

            // Count by category
            if (category === 'background') counts.backgrounds++;
            if (category === 'character') counts.characters++;
            if (category === 'evidence') counts.evidence++;
            if (category === 'profile') counts.profiles++;
            
            // Special counts
            if (category === 'effect') {
                counts.effects++;
                
                // Check if it's a bubble or special animation
                if (asset.metadata?.isSpecialAnimation) {
                    counts.specialAnimations++;
                }
                
                if (asset.relativePath.includes('bubble') || 
                    asset.metadata?.displayName?.toLowerCase().includes('bubble') ||
                    asset.metadata?.category === 'bubble') {
                    counts.bubbles++;
                }
            }
        });

        setAssetCounts(counts);
    }, []);

    // Get assets by category
    const getAssetsByCategory = useCallback((category: string) => {
        return assets.filter(asset => asset.metadata?.category === category);
    }, [assets]);

    // Get a specific asset by path
    const getAssetByPath = useCallback((assetPath: string) => {
        const normalizedPath = assetPath.replace(/\\/g, '/');
        return assets.find(asset => {
            // Check both full and relative paths
            return asset.path.replace(/\\/g, '/') === normalizedPath ||
                asset.relativePath.replace(/\\/g, '/') === normalizedPath;
        });
    }, [assets]);

    // Update or add metadata for an asset
    const updateAssetMetadata = useCallback((assetPath: string, metadata: Partial<AssetMetadata>) => {
        setAssets(prevAssets => {
            const normalizedPath = assetPath.replace(/\\/g, '/');
            const updatedAssets = prevAssets.map(asset => {
                if (
                    asset.path.replace(/\\/g, '/') === normalizedPath ||
                    asset.relativePath.replace(/\\/g, '/') === normalizedPath
                ) {
                    return {
                        ...asset,
                        metadata: {
                            ...asset.metadata,
                            ...metadata
                        }
                    };
                }
                return asset;
            });
            
            // Update counts when metadata changes
            updateAssetCounts(updatedAssets);
            return updatedAssets;
        });
    }, [updateAssetCounts]);

    // Watch for new assets (in browser mode)
    useEffect(() => {
        // This would be expanded based on your file system watching implementation
        loadAssets();
    }, [currentProject?.projectFolderPath, loadAssets]);

    // Resolve a relative path to full project path
    const resolveAssetPath = useCallback((relativePath: string): string => {
        if (!currentProject?.projectFolderPath) return relativePath;

        // Check if it's already an absolute path
        if (path.isAbsolute(relativePath)) return relativePath;

        return path.join(currentProject.projectFolderPath, relativePath);
    }, [currentProject?.projectFolderPath]);

    // Get relative path from full path
    const getAssetRelativePath = useCallback((fullPath: string): string => {
        if (!currentProject?.projectFolderPath) return fullPath;
        return getRelativePath(fullPath, currentProject.projectFolderPath);
    }, [currentProject?.projectFolderPath]);

    // Get all asset counts
    const getAssetCounts = useCallback(() => {
        return assetCounts;
    }, [assetCounts]);

    return {
        assets,
        loading,
        getAssetCounts,
        loadAssets,
        getAssetsByCategory,
        getAssetByPath,
        updateAssetMetadata,
        resolveAssetPath,
        getAssetRelativePath,
    };
}
