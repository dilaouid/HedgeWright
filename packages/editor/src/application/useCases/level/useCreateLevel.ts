import { v4 as uuidv4 } from 'uuid';
import { useFileSystemService } from '@/infrastructure/filesystem/services/useFileSystemService';
import { useRecentProjectsStore, Project } from '@/application/state/project/recentProjectsStore';
import { useProjectStore, ProjectData } from '@/application/state/project/projectStore';
import { toast } from 'sonner'; // Assuming you use Sonner for toasts

interface NewCaseData {
    title: string;
    author: string;
    description: string;
}

export function useCreateLevel() {
    const fileSystem = useFileSystemService();
    const addProject = useRecentProjectsStore(state => state.addProject);
    const setProject = useProjectStore(state => state.setProject);

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
            events: []
        };

        // Initialize some basic variables that all levels must have
        projectData.variables.push(
            {
                id: uuidv4(),
                name: 'hasSeenIntro',
                defaultValue: false,
                description: 'If player has seen the introduction'
            }
        );

        let filePath: string | null;

        try {
            // Trigger the "Save as" dialog for .aalevel files
            filePath = await fileSystem.showSaveDialog({
                title: 'Save Case',
                defaultPath: caseData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase(),
                filters: [{ name: 'Ace Attorney Level', extensions: ['aalevel'] }]
            });

            if (!filePath) {
                throw new Error('Operation cancelled by user');
            }

            // If we're in a browser, and it returned a browser path, append .aalevel if necessary
            if (!fileSystem.isElectron && filePath.startsWith('browser://') && !filePath.endsWith('.aalevel')) {
                filePath = `${filePath}.aalevel`;
            }

            // Save the file
            await fileSystem.writeJsonFile(filePath, projectData);

            // Create the recent project entry
            const projectEntry: Project = {
                id: projectId,
                name: caseData.title,
                path: filePath,
                createdAt: now,
                lastModified: now
            };

            // Add to recent projects
            addProject(projectEntry);

            // Load the project into the current store
            setProject(projectData);
            
            if (!fileSystem.isElectron) {
                toast.success('Project created successfully in browser storage mode');
            }

            return projectEntry;
        } catch (error) {
            console.error('Error creating new case:', error);
            
            // If we're in browser mode, create a fallback solution
            if (!fileSystem.isElectron) {
                const browserFilePath = `browser://${caseData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.aalevel`;
                await fileSystem.writeJsonFile(browserFilePath, projectData);
                
                const projectEntry: Project = {
                    id: projectId,
                    name: caseData.title,
                    path: browserFilePath,
                    createdAt: now,
                    lastModified: now
                };
                
                addProject(projectEntry);
                setProject(projectData);
                
                toast.info('Project created in browser storage (Electron not detected)');
                return projectEntry;
            }
            
            throw error;
        }
    };

    return { createNewCase };
}