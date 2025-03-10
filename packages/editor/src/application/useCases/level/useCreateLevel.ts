import { v4 as uuidv4 } from 'uuid';
import { useFileSystemService } from '@/infrastructure/filesystem/services/useFileSystemService';
import { useRecentProjectsStore, Project } from '@/application/state/project/recentProjectsStore';
import { useProjectStore, ProjectData } from '@/application/state/project/projectStore';
import { toast } from 'sonner';
import path from 'path-browserify';

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
    const addProject = useRecentProjectsStore(state => state.addProject);
    const setProject = useProjectStore(state => state.setProject);

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