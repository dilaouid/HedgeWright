import { useState, useEffect } from 'react';
import { useRecentProjectsStore } from '@/application/state/project/recentProjectsStore';
import { useProjectStore, ProjectData } from '@/application/state/project/projectStore';
import { useFileSystemService } from '@/infrastructure/filesystem/services/useFileSystemService';
import { useNavigate } from '@tanstack/react-router';

/**
 * Hook to access and manage recent projects
 */
export function useRecentProjects() {
    const { projects, updateProject } = useRecentProjectsStore();
    const { setProject, setLoading: setProjectLoading, setError: setProjectError } = useProjectStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const fileSystem = useFileSystemService();
    const navigate = useNavigate();

    useEffect(() => {
        // Validate the projects on initial load (check if files still exist)
        const validateProjects = async () => {
            try {
                setLoading(true);

                // Check if project files still exist and update the validity
                // This helps prevent showing projects with deleted files
                /* const validProjects = await Promise.all(
                    projects.map(async (project) => {
                        const exists = await fileSystem.fileExists(project.path);
                        return { ...project, isValid: exists };
                    })
                ); */

                // We don't actually modify the store here, but we could
                // filter out invalid projects if needed

                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error validating projects'));
                setLoading(false);
            }
        };

        validateProjects();
    }, [projects, fileSystem]);

    // Sort projects by last modified date (most recent first)
    const sortedProjects = [...projects].sort((a, b) => {
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    });

    /**
     * Open a project by its ID
     */
    const openProject = async (id: string) => {
        try {
            const project = sortedProjects.find(p => p.id === id);
            
            if (!project) {
                throw new Error(`Project with ID ${id} not found`);
            }
            
            // Check if file exists
            const exists = await fileSystem.fileExists(project.path);
            if (!exists) {
                throw new Error(`Project file no longer exists at ${project.path}`);
            }
            
            setProjectLoading(true);
            
            // Load the project file
            const parsedProject = await fileSystem.readJsonFile<ProjectData>(project.path);
            
            // Load the project into the project store
            setProject(parsedProject);
            
            // Update the project's lastModified timestamp
            const now = new Date().toISOString();
            updateProject(id, { lastModified: now });
            
            // Navigate to the editor
            navigate({ to: '/editor' });
            
            setProjectLoading(false);
            return true;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error opening project');
            setError(error);
            setProjectError(error);
            setProjectLoading(false);
            return false;
        }
    };

    return {
        projects: sortedProjects,
        loading,
        error,
        // Add the openProject function
        openProject,
        // Utility functions
        hasProjects: sortedProjects.length > 0,
        getProject: (id: string) => sortedProjects.find(p => p.id === id) || null,
    };
}