import { ipcMain, BrowserWindow } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as chokidar from 'chokidar';
import { v4 as uuidv4 } from 'uuid';

interface WatcherState {
    projectPath: string | null;
    watchers: chokidar.FSWatcher[];
    assetMapping: Map<string, string>; // Maps file paths to asset IDs
}

// Structure to categorize assets
interface AssetCategory {
    type: 'image' | 'audio' | 'unknown';
    category: 'background' | 'character' | 'evidence' | 'profile' | 'effect' | 'bgm' | 'sfx' | 'voice' | 'other';
    assetType: string; // Corresponds to AssetType/MusicType in the domain models
}

// Define return types for asset objects
interface BaseAsset {
    id: string;
    customId: string;
    name: string;
    path: string;
    relativePath: string;
    type: string;
    category: string;
    metadata: {
        relativePath: string;
        mimeType: string;
        category?: string;
    };
}

interface AudioAsset extends BaseAsset {
    loop: boolean;
    volume: number;
}

interface ImageAsset extends BaseAsset {
    // Image specific properties could go here
}

type Asset = AudioAsset | ImageAsset;

// Tracks the active watchers for each project
const state: WatcherState = {
    projectPath: null,
    watchers: [],
    assetMapping: new Map()
};

// Maps folder paths to asset categories
const folderMappings: Record<string, AssetCategory> = {
    'img/backgrounds': { type: 'image', category: 'background', assetType: 'image' },
    'img/characters': { type: 'image', category: 'character', assetType: 'sprite' },
    'img/profiles': { type: 'image', category: 'profile', assetType: 'image' },
    'img/evidence': { type: 'image', category: 'evidence', assetType: 'image' },
    'img/effects': { type: 'image', category: 'effect', assetType: 'animation' },
    'img/ui': { type: 'image', category: 'other', assetType: 'image' },
    'audio/bgm': { type: 'audio', category: 'bgm', assetType: 'bgm' },
    'audio/sfx': { type: 'audio', category: 'sfx', assetType: 'sfx' },
    'audio/voices': { type: 'audio', category: 'voice', assetType: 'voice' }
};

// Helper function to determine mime type from file extension
function getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();

    // Image mime types
    if (['.png'].includes(ext)) return 'image/png';
    if (['.jpg', '.jpeg'].includes(ext)) return 'image/jpeg';
    if (['.gif'].includes(ext)) return 'image/gif';
    if (['.webp'].includes(ext)) return 'image/webp';

    // Audio mime types
    if (['.mp3'].includes(ext)) return 'audio/mpeg';
    if (['.wav'].includes(ext)) return 'audio/wav';
    if (['.ogg'].includes(ext)) return 'audio/ogg';

    return 'application/octet-stream';
}

// Categorize asset based on its path
function categorizeAsset(filePath: string, projectPath: string): { category: AssetCategory, relativePath: string } {
    const relativePath = path.relative(projectPath, filePath).replace(/\\/g, '/');

    // Find matching folder
    for (const [folder, category] of Object.entries(folderMappings)) {
        if (relativePath.startsWith(folder)) {
            return {
                category,
                relativePath
            };
        }
    }

    // Default fallback
    return {
        category: { type: 'unknown', category: 'other', assetType: 'image' },
        relativePath
    };
}

// Create a properly formatted asset object
function createAssetObject(filePath: string, projectPath: string): Asset {
    const { category, relativePath } = categorizeAsset(filePath, projectPath);
    const fileNameWithoutExt = path.basename(filePath, path.extname(filePath));
    const customId = fileNameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

    // Generate a unique ID that will be used to reference this asset
    const id = uuidv4();

    // Store the mapping from file path to asset ID for future reference
    state.assetMapping.set(filePath, id);

    if (category.type === 'audio') {
        // Create Music asset
        return {
            id,
            customId,
            name: fileNameWithoutExt,
            path: filePath,
            relativePath,
            type: category.assetType,
            category: category.category,
            loop: category.category === 'bgm',
            volume: 1.0,
            metadata: {
                relativePath,
                mimeType: getMimeType(filePath)
            }
        };
    } else {
        // Create Image/other asset
        return {
            id,
            customId,
            name: fileNameWithoutExt,
            type: category.assetType,
            path: filePath,
            relativePath,
            category: category.category,
            metadata: {
                relativePath,
                mimeType: getMimeType(filePath),
                category: category.category
            }
        };

    }
}

// Start watching a project's asset folders
function startWatching(projectPath: string, mainWindow: BrowserWindow): void {
    console.log(`Starting file system watcher for project: ${projectPath}`);

    try {
        // Clear any existing watchers
        stopWatching();

        // Make sure the project path exists
        if (!fs.existsSync(projectPath)) {
            console.error(`Project path does not exist: ${projectPath}`);
            mainWindow.webContents.send('asset:error', 'Project folder not found.');
            return;
        }

        // Store the current project path
        state.projectPath = projectPath;

        // Create an array to hold the folders we want to watch
        const foldersToWatch = Object.keys(folderMappings).map(folder =>
            path.join(projectPath, folder)
        );

        // Ensure all directories exist
        for (const folder of foldersToWatch) {
            try {
                if (!fs.existsSync(folder)) {
                    fs.mkdirSync(folder, { recursive: true });
                }
            } catch (dirError) {
                console.error(`Error creating directory ${folder}:`, dirError);
                // Continue with other folders
            }
        }

        // Initialize the watcher with error handling
        try {
            const watcher = chokidar.watch(foldersToWatch, {
                persistent: true,
                ignoreInitial: true,
                awaitWriteFinish: {
                    stabilityThreshold: 2000, // Wait until the file is completely written
                    pollInterval: 100
                }
            });

            // Handle add/change events
            watcher.on('add', (filePath) => {
                try {
                    console.log(`File added: ${filePath}`);
                    const asset = createAssetObject(filePath, projectPath);

                    // Only consider valid files (images and audio)
                    const ext = path.extname(filePath).toLowerCase();
                    if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp3', '.wav', '.ogg'].includes(ext)) {
                        mainWindow.webContents.send('asset:added', asset);
                    }
                } catch (error) {
                    console.error(`Error processing added file ${filePath}:`, error);
                }
            });

            // Handle unlink (file removal) events
            watcher.on('unlink', (filePath) => {
                try {
                    console.log(`File removed: ${filePath}`);
                    const assetId = state.assetMapping.get(filePath);

                    if (assetId) {
                        mainWindow.webContents.send('asset:removed', assetId);
                        state.assetMapping.delete(filePath);
                    }
                } catch (error) {
                    console.error(`Error processing removed file ${filePath}:`, error);
                }
            });

            // Handle errors
            watcher.on('error', (error) => {
                console.error(`Watcher error: ${error}`);
                mainWindow.webContents.send('asset:error', error.message);
            });

            // Store the watcher reference
            state.watchers.push(watcher);

            console.log('File system watcher started successfully');
        } catch (watcherError) {
            console.error('Error creating file watcher:', watcherError);
            mainWindow.webContents.send('asset:error', 'Failed to create file watcher.');
        }
    } catch (error) {
        console.error('Error in startWatching:', error);
        mainWindow.webContents.send('asset:error', 'File watcher initialization failed.');
    }
}

// Stop all active watchers
function stopWatching(): void {
    state.watchers.forEach(watcher => {
        watcher.close().catch(err => console.error('Error closing watcher:', err));
    });

    state.watchers = [];
    state.assetMapping.clear();
    console.log('File system watchers stopped');
}

// Initialize the IPC handlers for the file watcher
export function registerFileWatcherHandlers(): void {
    console.log('Registering file watcher IPC handlers...');

    // Start watching a project
    ipcMain.handle('watcher:start', (event, projectPath) => {
        const window = BrowserWindow.fromWebContents(event.sender) || BrowserWindow.getFocusedWindow();
        if (!window) {
            throw new Error('No window found for watcher');
        }

        startWatching(projectPath, window);
        return { success: true, message: 'File watcher started' };
    });

    // Stop watching
    ipcMain.handle('watcher:stop', () => {
        stopWatching();
        return { success: true, message: 'File watcher stopped' };
    });

    // Get the current watcher status
    ipcMain.handle('watcher:status', () => {
        return {
            isActive: state.watchers.length > 0,
            projectPath: state.projectPath,
            watchedFiles: state.assetMapping.size
        };
    });

    // Scan existing assets (useful when opening an existing project)
    ipcMain.handle('watcher:scanExisting', (event, projectPath) => {
        const window = BrowserWindow.fromWebContents(event.sender) || BrowserWindow.getFocusedWindow();
        if (!window) {
            throw new Error('No window found for watcher');
        }

        // We'll handle this by stopping any existing watchers and starting a new one
        // The 'ignoreInitial: false' option will ensure all existing files are processed
        startWatching(projectPath, window);

        return { success: true, message: 'Initial asset scan completed' };
    });

    console.log('File watcher IPC handlers registered');
}