import { v4 as uuidv4 } from 'uuid';
import { useFileSystemService } from '@/infrastructure/filesystem/services/useFileSystemService';
import { useRecentProjectsStore, Project } from '@/application/state/project/recentProjectsStore';
import { useProjectStore, ProjectData } from '@/application/state/project/projectStore';

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
        // Générer un ID unique pour le projet
        const projectId = uuidv4();
        const now = new Date().toISOString();

        // Créer la structure de base du projet
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

        // Initialiser également quelques variables de base que tous les niveaux doivent avoir
        projectData.variables.push(
            {
                id: uuidv4(),
                name: 'hasSeenIntro',
                defaultValue: false,
                description: 'Si le joueur a vu l\'introduction'
            }
        );

        // Déclencher la boîte de dialogue "Enregistrer sous" pour les fichiers .aalevel
        const filePath = await fileSystem.showSaveDialog({
            title: 'Enregistrer le cas',
            defaultPath: caseData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase(),
            filters: [{ name: 'Ace Attorney Level', extensions: ['aalevel'] }]
        });

        if (!filePath) {
            throw new Error('Opération annulée par l\'utilisateur');
        }

        // Enregistrer le fichier
        await fileSystem.writeJsonFile(filePath, projectData);

        // Créer l'entrée du projet récent
        const projectEntry: Project = {
            id: projectId,
            name: caseData.title,
            path: filePath,
            createdAt: now,
            lastModified: now
        };

        // Ajouter aux projets récents
        addProject(projectEntry);

        // Charger le projet dans le store actuel
        setProject(projectData);

        return projectEntry;
    };

    return { createNewCase };
}