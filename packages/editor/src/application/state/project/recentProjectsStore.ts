import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project {
    id: string;
    name: string;
    path: string;
    createdAt: string;
    lastModified: string;
    thumbnailPath?: string;
}

interface RecentProjectsState {
    projects: Project[];

    // Actions
    addProject: (project: Project) => void;
    removeProject: (projectId: string) => void;
    updateProject: (projectId: string, updates: Partial<Project>) => void;
    clearProjects: () => void;
}

/**
 * Store for managing recent projects
 * Uses persist middleware to save to localStorage
 */
export const useRecentProjectsStore = create<RecentProjectsState>()(
    persist(
        (set) => ({
            projects: [],

            addProject: (project) =>
                set((state) => {
                    // Remove if project with same ID already exists
                    const filteredProjects = state.projects.filter((p) => p.id !== project.id);

                    // Add the new project at the beginning of the array (most recent)
                    return { projects: [project, ...filteredProjects].slice(0, 10) }; // Keep only 10 most recent
                }),

            removeProject: (projectId) =>
                set((state) => ({
                    projects: state.projects.filter((project) => project.id !== projectId),
                })),

            updateProject: (projectId, updates) =>
                set((state) => ({
                    projects: state.projects.map((project) =>
                        project.id === projectId ? { ...project, ...updates } : project
                    ),
                })),

            clearProjects: () => set({ projects: [] }),
        }),
        {
            name: 'hedgewright-recent-projects',
        }
    )
);