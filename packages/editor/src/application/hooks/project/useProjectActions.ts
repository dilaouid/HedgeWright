// packages\editor\src\application\hooks\project\useProjectActions.ts
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { useProjectStore } from '@/application/state/project/projectStore';
import { useDialogs } from '@/presentation/hooks/useDialogs';
import { useToast } from '@/presentation/hooks/useToast';
import { useFileSystemService } from '@/infrastructure/filesystem/services/useFileSystemService';
import { useRecentProjectsStore, Project } from '@/application/state/project/recentProjectsStore';

export interface CreateProjectOptions {
    name?: string;
    template?: string; // ID or path of template to use
    path?: string; // Custom save location
}

export function useProjectActions() {
    const [loading, setLoading] = useState(false);
    const { addProject, removeProject, updateProject } = useRecentProjectsStore();
    const { setProject, clearProject } = useProjectStore();
    const fileSystem = useFileSystemService();
    const { showSaveDialog, showOpenDialog, showConfirmDialog } = useDialogs();
    const toast = useToast();

    /**
     * Create a new project
     */
    const createProject = async (options?: CreateProjectOptions) => {
        try {
            setLoading(true);

            // Generate a project ID
            const projectId = nanoid();

            // Allow the user to select where to save the project
            let projectPath = options?.path;
            if (!projectPath) {
                const selectedPath = await showSaveDialog({
                    title: 'Create New Project',
                    defaultPath: `${options?.name || 'New Project'}.aalevel`,
                    filters: [
                        { name: 'HedgeWright Level', extensions: ['aalevel'] }
                    ]
                });

                // User cancelled the dialog
                if (!selectedPath) {
                    setLoading(false);
                    return null;
                }

                projectPath = selectedPath;
            }

            // Generate project structure
            const projectName = options?.name || 'New Project';
            const now = new Date().toISOString();

            const newProject: Project = {
                id: projectId,
                name: projectName,
                path: projectPath,
                createdAt: now,
                lastModified: now,
            };

            // Create initial project structure with complete fields
            const initialProjectData = {
                id: projectId,
                name: projectName,
                createdAt: now,
                lastModified: now,
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
                // Add the missing fields
                assets: [],
                music: [],
                characters: [],
                backgrounds: []
            };

            // Save the project to disk
            await fileSystem.writeJsonFile(projectPath, initialProjectData);

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
                createdAt?: string;
                [key: string]: unknown;
            };

            // Validate project data
            if (!projectData.id || !projectData.name) {
                throw new Error('Invalid project file format');
            }

            // Update project in recent projects
            const now = new Date().toISOString();
            const projectToUpdate: Project = {
                id: projectData.id,
                name: projectData.name,
                path: projectPath,
                createdAt: projectData.createdAt || now,
                lastModified: now,
            };

            // Update stores
            addProject(projectToUpdate); // This will move it to the top of recent projects
            setProject(projectData as any); // Type assertion needed due to potential missing fields in loaded project

            toast.success(`Project "${projectData.name}" loaded successfully`);
            setLoading(false);

            return projectData;
        } catch (error) {
            setLoading(false);
            toast.error(`Failed to load project: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
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

    // The rest of the code remains the same
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