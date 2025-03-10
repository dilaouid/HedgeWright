import { v4 as uuidv4 } from 'uuid';
import { useFileSystemService } from '@/infrastructure/filesystem/services/useFileSystemService';
import { useRecentProjectsStore, Project } from '@/application/state/project/recentProjectsStore';
import { useProjectStore, ProjectData } from '@/application/state/project/projectStore';
import { toast } from 'sonner';
import path from 'path-browserify';
import { useIpcService } from '@/infrastructure/electron/services/useIpcService';
import { Asset, AssetType, Music, MusicType } from '@hedgewright/common';

interface NewCaseData {
    title: string;
    author: string;
    description: string;
}

// Define project folder structure
const PROJECT_FOLDERS = [
    'audio/bgm',
    'audio/sfx',
    'audio/voices',
    'img/backgrounds',
    'img/characters',
    'img/profiles',
    'img/evidence',
    'img/effects',
    'documents',
    'data'
];

export function useCreateLevel() {
    const fileSystem = useFileSystemService();
    const { invoke, isElectron } = useIpcService();

    const addProject = useRecentProjectsStore(state => state.addProject);
    const setProject = useProjectStore(state => state.setProject);

    /**
     * Copy default assets to a new project
     */
    const copyDefaultAssets = async (projectFolderPath: string) => {
        if (isElectron) {
            // En mode Electron, utiliser un canal IPC spécifique pour copier les assets
            try {
                console.log('Using Electron IPC to copy assets');

                const result = await invoke('assets:copyDefaults', projectFolderPath);
                console.log('Copy result:', result);

                if (!result || result.assetsList?.length === 0) {
                    console.warn('No assets were copied or returned');
                    return { assets: [], music: [] };
                }

                const assets: Asset[] = [];
                const music: Music[] = [];

                for (const item of result.assetsList) {
                    const uuid = uuidv4();
                    const customId = `asset_${item.name.replace(/\s+/g, '_').toLowerCase()}`;

                    if (item.type === 'image') {
                        const assetType = mapCategoryToAssetType(item.category);

                        assets.push({
                            uuid,
                            customId,
                            name: item.name,
                            type: assetType,
                            path: item.path,
                            mimeType: getMimeTypeFromExtension(item.path),
                            metadata: {
                                relativePath: item.relativePath,
                                category: item.category
                            },
                            update: (updates: Partial<Omit<Asset, 'uuid'>>) => {
                                return new Asset(
                                    updates.customId ?? customId,
                                    updates.name ?? item.name,
                                    updates.type ?? assetType,
                                    updates.path ?? item.path,
                                    updates.mimeType ?? getMimeTypeFromExtension(item.path),
                                    updates.metadata ?? { relativePath: item.relativePath, category: item.category }
                                );
                            },
                            toJSON: () => {
                                return {
                                    uuid,
                                    customId,
                                    name: item.name,
                                    type: assetType,
                                }
                            }
                        });

                    } else if (item.type === 'audio') {
                        const musicType = mapCategoryToMusicType(item.category);

                        music.push({
                            uuid,
                            customId,
                            name: item.name,
                            path: item.path,
                            musicType,
                            volume: 1.0,
                            loop: item.category === 'bgm',
                            metadata: {
                                relativePath: item.relativePath
                            },
                            update: (updates: Partial<Omit<Music, 'uuid'>>) => {
                                return new Music(
                                    updates.customId ?? customId,
                                    updates.name ?? item.name,
                                    updates.musicType ?? musicType,
                                    updates.path ?? item.path,
                                    updates.volume ?? 1.0,
                                    updates.loop ?? item.category === 'bgm',
                                    {
                                        relativePath: updates.metadata?.relativePath ?? item.relativePath
                                    }
                                );
                            },
                            isBackgroundMusic: () => musicType === 'bgm',
                            isSoundEffect: () => musicType === 'sfx',
                            isVoice: () => musicType === 'voice',
                            toJSON: () => {
                                return {
                                    uuid,
                                    customId,
                                    name: item.name,
                                    musicType,
                                    path: item.path
                                }
                            }
                        });

                    }
                }

                console.log(`Processed ${assets.length} assets and ${music.length} music files`);
                return { assets, music };

            } catch (error) {
                console.error('Failed to copy default assets:', error);
                throw error;
            }
        } else {
            // En mode navigateur, simuler la copie d'assets
            // Ceci pourrait être fait en pré-chargeant des assets dans le localStorage
            try {
                // Liste des assets par défaut (chemins relatifs)
                const defaultAssets = [
                    { src: 'img/backgrounds/courtroom.png', category: 'backgrounds' },
                    { src: 'img/backgrounds/detention_center.png', category: 'backgrounds' },
                    { src: 'img/characters/default_attorney.png', category: 'characters' },
                    { src: 'img/evidence/badge.png', category: 'evidence' },
                    { src: 'audio/sfx/objection.mp3', category: 'sfx' }
                ];

                for (const asset of defaultAssets) {
                    // Construire les chemins source et destination
                    const destPath = path.join(projectFolderPath, asset.src);

                    // En mode navigateur, on pourrait charger des blobs depuis des assets intégrés
                    // et les stocker dans le localStorage
                    // Exemple simplifié:
                    const defaultContent = `DEFAULT_CONTENT_FOR_${asset.src}`;
                    await fileSystem.writeFile(destPath, defaultContent);
                }

                return { copied: defaultAssets.length };
            } catch (error) {
                console.error('Failed to copy default assets in browser mode:', error);
                throw error;
            }
        }
    };

    /**
     * Create the folder structure for a new project
     */
    const createProjectFolders = async (folderPath: string) => {
        try {
            // Create main project folder first
            await fileSystem.createDirectory(folderPath);

            // Create all subfolders
            for (const folder of PROJECT_FOLDERS) {
                const subfolderPath = path.join(folderPath, folder);
                await fileSystem.createDirectory(subfolderPath);
            }

            return true;
        } catch (error) {
            console.error('Failed to create project folders:', error);
            throw error;
        }
    };

    const createNewCase = async (caseData: NewCaseData): Promise<Project> => {
        // Generate a unique ID for the project
        const projectId = uuidv4();
        const now = new Date().toISOString();

        // Create the basic project structure
        const projectData: ProjectData = {
            id: projectId,
            name: caseData.title,
            createdAt: now,
            lastModified: now,
            projectFolderPath: '', // Will be set after folder selection
            scenes: [],
            evidence: [],
            profiles: [],
            variables: [],
            timeline: {
                nodes: [],
                connections: []
            },
            settings: {
                gameTitle: caseData.title,
                author: caseData.author,
                version: '1.0.0',
                resolution: { width: 1280, height: 720 }
            },
            investigations: [],
            dialogues: [],
            crossExaminations: [],
            messages: [],
            events: [],
            assets: [],
            music: [],
            characters: [],
            backgrounds: []
        };

        // Initialize some basic variables that all levels must have
        projectData.variables.push(
            {
                id: uuidv4(),
                name: 'hasSeenIntro',
                numericId: 0,
                initialValue: false,
                description: 'If player has seen the introduction'
            }
        );

        try {
            let projectFolderPath: string | null;

            if (fileSystem.isElectron) {
                // In Electron: First select the project folder location
                projectFolderPath = await fileSystem.showOpenDialog({
                    title: 'Select Location for Project',
                    buttonLabel: 'Select Folder',
                    properties: ['openDirectory', 'createDirectory']
                });

                if (!projectFolderPath) {
                    throw new Error('Operation cancelled by user');
                }

                // Append the project name to create the full project folder path
                const safeName = caseData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                projectFolderPath = path.join(projectFolderPath, safeName);

                // Create the project folder structure
                await createProjectFolders(projectFolderPath);
                console.log('Copying default assets to project folder:', projectFolderPath);

                const { assets, music } = await copyDefaultAssets(projectFolderPath);
                projectData.assets = (assets || []).map(asset => ({
                    id: asset.uuid,
                    name: asset.name,
                    type: asset.type,
                    path: asset.path,
                    relativePath: asset.metadata?.relativePath,
                    category: asset.metadata?.category,
                    metadata: asset.metadata
                }));
                projectData.music = (music || []).map(music => ({
                    id: music.uuid,
                    name: music.name,
                    type: music.musicType,
                    path: music.path,
                    musicType: music.musicType,
                    volume: music.volume,
                    loop: music.loop,
                    metadata: music.metadata
                }));

                console.log(`Added ${projectData.assets.length} assets and ${projectData.music.length} music files to project data`);

                // Update project data with folder path
                projectData.projectFolderPath = projectFolderPath;

                // Define the path for the main project file inside the folder
                const projectFilePath = path.join(projectFolderPath, `${safeName}.aalevel`);

                // Create README.md
                const readmePath = path.join(projectFolderPath, 'README.md');
                const readmeContent = `# ${caseData.title}

Created: ${new Date(now).toLocaleDateString()}
Author: ${caseData.author}

## Project Structure
- audio/ - All audio assets
  - bgm/ - Background music
  - sfx/ - Sound effects
  - voices/ - Character voices
- img/ - All image assets
  - backgrounds/ - Scene backgrounds
  - characters/ - Character sprites
  - profiles/ - Character profile pictures
  - evidence/ - Evidence images
  - effects/ - Visual effects
- documents/ - Additional documentation
- data/ - Game data files

## Description
${caseData.description || 'No description provided.'}
`;

                // Write the README file
                await fileSystem.writeFile(readmePath, readmeContent);

                // Save the project file
                await fileSystem.writeJsonFile(projectFilePath, projectData);

                // Create the recent project entry
                const projectEntry: Project = {
                    id: projectId,
                    name: caseData.title,
                    path: projectFilePath,
                    folderPath: projectFolderPath,
                    createdAt: now,
                    lastModified: now
                };

                // Add to recent projects and set current project
                addProject(projectEntry);
                setProject(projectData);

                toast.success(`Project "${caseData.title}" created successfully`);
                return projectEntry;
            } else {
                // Browser mode fallback - simulate folder structure
                const browserFolderPath = `browser://${caseData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
                const browserFilePath = `${browserFolderPath}/${caseData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.aalevel`;

                // Update project data with folder path
                projectData.projectFolderPath = browserFolderPath;

                // Create a simulated folder structure in browser storage
                for (const folder of PROJECT_FOLDERS) {
                    const subfolderPath = `${browserFolderPath}/${folder}`;
                    await fileSystem.createDirectory(subfolderPath);
                }

                // Create README in browser storage
                const readmeContent = `# ${caseData.title}\nCreated: ${new Date(now).toLocaleDateString()}\nAuthor: ${caseData.author}\n\nDescription: ${caseData.description || 'No description provided.'}`;
                await fileSystem.writeFile(`${browserFolderPath}/README.md`, readmeContent);

                // Save the project file
                await fileSystem.writeJsonFile(browserFilePath, projectData);

                const projectEntry: Project = {
                    id: projectId,
                    name: caseData.title,
                    path: browserFilePath,
                    folderPath: browserFolderPath,
                    createdAt: now,
                    lastModified: now
                };

                addProject(projectEntry);
                setProject(projectData);

                toast.info('Project created in browser storage with simulated folder structure');
                return projectEntry;
            }
        } catch (error) {
            console.error('Error creating new case:', error);
            toast.error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    };

    return { createNewCase };
}

function getMimeTypeFromExtension(path: string): string {
    const ext = path.toLowerCase().split('.').pop() || '';
    const mimeMap: Record<string, string> = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'ogg': 'audio/ogg'
    };
    return mimeMap[ext] || 'application/octet-stream';
}

// Fonction pour mapper les catégories aux types d'assets
function mapCategoryToAssetType(category: string): AssetType {
    switch (category) {
        case 'background': return AssetType.IMAGE
        case 'character': return AssetType.SPRITE
        case 'evidence': return AssetType.IMAGE
        case 'profile': return AssetType.IMAGE
        case 'effect': return AssetType.ANIMATION
        default: return AssetType.IMAGE
    }
}

// Fonction pour mapper les catégories aux types de musique
function mapCategoryToMusicType(category: string): MusicType {
    switch (category) {
        case 'bgm': return MusicType.BGM
        case 'sfx': return MusicType.SFX
        case 'voice': return MusicType.VOICE
        default: return MusicType.BGM
    }
}