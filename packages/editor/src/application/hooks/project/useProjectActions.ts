/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import path from 'path-browserify';
import { nanoid } from 'nanoid';

import { useProjectStore } from '@/application/state/project/projectStore';
import { useDialogs } from '@/presentation/hooks/useDialogs';
import { useToast } from '@/presentation/hooks/useToast';
import { useRecentProjectsStore } from '@/application/state/project/recentProjectsStore';
import { useFileSystemService } from '@/infrastructure/filesystem/services/useFileSystemService';
import { useFileSystemWatcher } from '@/application/hooks/project/useFileSystemWatcher';

// Define our project folder structure
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

export interface CreateProjectOptions {
    name?: string;
    template?: string; // ID or path of template to use
    path?: string; // Custom save location
}

export interface Project {
    id: string;
    name: string;
    path: string;
    folderPath: string; // Made non-optional to match recentProjectsStore's Project interface
    createdAt: string;
    lastModified: string;
}

export function useProjectActions() {
    const [loading, setLoading] = useState(false);
    const { addProject, removeProject, updateProject } = useRecentProjectsStore();
    const { setProject, clearProject } = useProjectStore();
    const fileSystem = useFileSystemService();
    const { showSaveDialog } = useDialogs();
    const { scanExistingAssets, isReady } = useFileSystemWatcher();

    const toast = useToast();

    /**
     * Create folder structure for a new project
     */
    const createProjectFolders = async (projectFolderPath: string) => {
        try {
            // Create main project folder
            await fileSystem.createDirectory(projectFolderPath);

            // Create all subfolders
            for (const folder of PROJECT_FOLDERS) {
                const folderPath = path.join(projectFolderPath, folder);
                await fileSystem.createDirectory(folderPath);
            }

            return true;
        } catch (error) {
            console.error('Failed to create project folders:', error);
            throw error;
        }
    };

    /**
     * Create a new project
     */
    const createProject = async (options?: CreateProjectOptions) => {
        try {
            setLoading(true);

            // Generate a project ID
            const projectId = nanoid();

            // Allow the user to select where to save the project folder
            let projectFolderPath = options?.path;

            if (!projectFolderPath) {
                // First let the user choose a folder location
                const folderPath = await showSaveDialog({
                    title: 'Select Location for Project Folder',
                    defaultPath: options?.name || 'New Project',
                    properties: ['createDirectory'],
                    buttonLabel: 'Create Project'
                });

                // User cancelled the dialog
                if (!folderPath) {
                    setLoading(false);
                    return null;
                }

                projectFolderPath = folderPath;
            }

            // Get project name from folder name if not specified
            const projectName = options?.name || path.basename(projectFolderPath);
            const now = new Date().toISOString();

            // Create the folder structure
            await createProjectFolders(projectFolderPath);

            // Define the path for the main project file inside the folder
            const projectFilePath = path.join(projectFolderPath, `${projectName}.aalevel`);

            // Project record for the recent projects store
            const newProject: Project = {
                id: projectId,
                name: projectName,
                path: projectFilePath,
                folderPath: projectFolderPath,
                createdAt: now,
                lastModified: now,
            };

            // Create initial project data
            const initialProjectData = {
                id: projectId,
                name: projectName,
                createdAt: now,
                lastModified: now,
                projectFolderPath: projectFolderPath, // Store the folder path in the project data
                scenes: [],
                evidence: [],
                profiles: [],
                variables: [
                    {
                        id: nanoid(),
                        name: 'hasSeenIntro',
                        numericId: 0,
                        initialValue: false,
                        description: 'If player has seen the introduction'
                    }
                ],
                timeline: {
                    nodes: [],
                    connections: []
                },
                settings: {
                    gameTitle: projectName,
                    author: '',
                    version: '1.0.0',
                    resolution: {
                        width: 1280,
                        height: 720
                    }
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

            // Create a README.md file with project info
            const readmePath = path.join(projectFolderPath, 'README.md');
            const readmeContent = `# ${projectName}

Created: ${new Date(now).toLocaleDateString()}

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

## Getting Started
Place your assets in the corresponding folders and reference them in the editor.
`;

            // Write the README file
            await fileSystem.writeFile(readmePath, readmeContent);

            // Save the project file
            await fileSystem.writeJsonFile(projectFilePath, initialProjectData);

            // Update stores
            addProject(newProject);
            setProject(initialProjectData);

            toast.success(`Project "${projectName}" created successfully`);
            setLoading(false);

            return newProject;
        } catch (error) {
            setLoading(false);
            toast.error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    };

    /**
     * Load an existing project
     */
    const loadProject = async (projectIdOrPath: string) => {
        try {
            setLoading(true);
    
            let projectPath: string;
    
            // Check if we're loading by ID or by path
            if (projectIdOrPath.endsWith('.aalevel')) {
                // It's a path
                projectPath = projectIdOrPath;
            } else {
                // It's an ID, get the project from recent projects
                const { projects } = useRecentProjectsStore.getState();
                const project = projects.find((p: Project) => p.id === projectIdOrPath);
    
                if (!project) {
                    throw new Error(`Project with ID ${projectIdOrPath} not found`);
                }
    
                projectPath = project.path;
            }
    
            // Check if file exists
            const exists = await fileSystem.fileExists(projectPath);
            if (!exists) {
                throw new Error(`Project file not found at ${projectPath}`);
            }
    
            // Load project data
            const projectData = await fileSystem.readJsonFile(projectPath) as {
                id: string;
                name: string;
                projectFolderPath?: string;
                createdAt?: string;
                [key: string]: unknown;
            };
    
            // Validate project data
            if (!projectData.id || !projectData.name) {
                throw new Error('Invalid project file format');
            }
    
            // Determine folder path - either from the project data or from the file location
            // Make sure folderPath is always defined since the recentProjectsStore expects it
            const folderPath = projectData.projectFolderPath || path.dirname(projectPath);
            
            // Ensure projectFolderPath is set in the project data
            projectData.projectFolderPath = folderPath;
    
            // Resolve relative paths to absolute paths for assets and music
            const resolvedProjectData = resolveProjectPaths(projectData);
    
            // Update project in recent projects
            const now = new Date().toISOString();
            const projectToUpdate: Project = {
                id: projectData.id,
                name: projectData.name,
                path: projectPath,
                folderPath,
                createdAt: projectData.createdAt || now,
                lastModified: now,
            };
    
            // Update stores
            addProject(projectToUpdate); // This will move it to the top of recent projects
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setProject(resolvedProjectData as any); // Now using the resolved project data
    
            toast.success(`Project "${projectData.name}" loaded successfully`);
            if (isReady) {
                await scanExistingAssets(folderPath); // Use folderPath instead of projectPath
            }
    
            setLoading(false);
    
            return resolvedProjectData; // Return the resolved project data
        } catch (error) {
            setLoading(false);
            toast.error(`Failed to load project: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    };
    
    // Helper function to resolve relative paths in the project
    const resolveProjectPaths = (project: any) => {
        if (!project || !project.projectFolderPath) return project;
        
        const result = { ...project };
        
        // Resolve paths for assets
        if (Array.isArray(result.assets)) {
            result.assets = result.assets.map((asset: any) => ({
                ...asset,
                path: asset.relativePath 
                    ? path.join(project.projectFolderPath, asset.relativePath.replace(/\\/g, path.sep))
                    : asset.path
            }));
        }
        
        // Resolve paths for music
        if (Array.isArray(result.music)) {
            result.music = result.music.map((music: any) => ({
                ...music,
                path: music.relativePath
                    ? path.join(project.projectFolderPath, music.relativePath.replace(/\\/g, path.sep))
                    : music.path
            }));
        }
        
        return result;
    };

    /**
     * Save the current project
     */
    const saveProject = async () => {
        try {
            setLoading(true);

            const { currentProject } = useProjectStore.getState();

            if (!currentProject) {
                throw new Error('No project is currently open');
            }

            // Update the lastModified field
            const now = new Date().toISOString();
            const updatedProject = {
                ...currentProject,
                lastModified: now
            };

            // Get project path from recent projects
            const { projects } = useRecentProjectsStore.getState();
            const projectRecord = projects.find(p => p.id === currentProject.id);

            if (!projectRecord) {
                throw new Error('Project not found in recent projects');
            }

            // Save to disk
            await fileSystem.writeJsonFile(projectRecord.path, updatedProject);

            // Update stores
            setProject(updatedProject);
            updateProject(currentProject.id, { lastModified: now });

            toast.success('Project saved successfully');
            setLoading(false);

            return updatedProject;
        } catch (error) {
            setLoading(false);
            toast.error(`Failed to save project: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    };

    // Return all the functions
    return {
        createProject,
        loadProject,
        saveProject,
        removeProject,
        updateProject,
        clearProject,
        addProject,
        loading
    };
}