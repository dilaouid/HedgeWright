import { useFileSystemService } from '@/infrastructure/filesystem/services/useFileSystemService';
import { useProjectStore } from '@/application/state/project/projectStore';
/* import { AALevelFile } from '@/domain/types/level/LevelFileTypes';
import { AAGameFile } from '@/domain/types/game/GameFileTypes'; */

/**
 * Exporte le niveau courant vers un fichier de jeu .aagame
 */
export async function exportGameFile(): Promise<string | null> {
    const fileSystem = useFileSystemService();
    const currentProject = useProjectStore.getState().currentProject;

    if (!currentProject) {
        throw new Error('Aucun projet n\'est actuellement ouvert');
    }

    // 1. Convertir le projet en format .aalevel
    //const levelFile: AALevelFile = convertProjectToLevelFile(currentProject);

    // 2. Convertir le .aalevel en .aagame
    //const gameFile: AAGameFile = convertLevelFileToGameFile(levelFile);

    // 3. Déclencher la boîte de dialogue "Enregistrer sous"
    const filePath = await fileSystem.showSaveDialog({
        title: 'Exporter le jeu',
        defaultPath: currentProject.name.replace(/[^a-z0-9]/gi, '_').toLowerCase(),
        filters: [{ name: 'Ace Attorney Game', extensions: ['aagame'] }]
    });

    if (!filePath) {
        return null; // Annulé par l'utilisateur
    }

    // 4. Enregistrer le fichier
    //await fileSystem.writeJsonFile(filePath, gameFile);

    return filePath;
}

/**
 * Convertit les données du projet en format .aalevel
 */
/* function convertProjectToLevelFile(project): AALevelFile {
    // Implémentation de la conversion
    // ...

    return {};
} */

/**
 * Convertit un fichier .aalevel en format .aagame
 */
/* function convertLevelFileToGameFile(levelFile: AALevelFile): AAGameFile {
    // Implémentation de la conversion
    // ...

    return {};
} */