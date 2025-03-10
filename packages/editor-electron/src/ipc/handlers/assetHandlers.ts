import { ipcMain } from 'electron';
import * as fsPromises from 'fs/promises';
import path from 'path';
import { app } from 'electron';
import { existsSync, readdirSync } from 'fs';

interface AssetCategorizationResult {
    type: 'image' | 'audio' | 'unknown';
    category: 'background' | 'character' | 'evidence' | 'profile' | 'effect' | 'bgm' | 'sfx' | 'voice' | 'other';
    relativePath: string;
}


// Define interface for asset items
interface AssetItem {
    path: string;
    name: string;
    relativePath: string;
    type: AssetCategorizationResult['type'];
    category: AssetCategorizationResult['category'];
}


interface CopyResult {
    copied: number;
    errors: number;
}

export function registerAssetHandlers() {
    console.log('Registering asset IPC handlers...');

    ipcMain.handle('asset:save', async (event, { data, fileName, targetFolder, projectPath }) => {
        try {
            // Construire le chemin complet pour l'enregistrement
            const targetPath = path.join(projectPath, targetFolder);

            // S'assurer que le dossier cible existe
            if (!existsSync(targetPath)) {
                await fsPromises.mkdir(targetPath, { recursive: true });
            }

            // Chemin complet du fichier
            const filePath = path.join(targetPath, fileName);

            // Écrire le fichier
            fsPromises.writeFile(filePath, Buffer.from(data));

            // Retourner le chemin relatif au dossier du projet
            return path.join(targetFolder, fileName);
        } catch (error) {
            console.error('Error saving asset:', error);
            throw error;
        }
    });


    // Copier les assets par défaut vers un nouveau projet
    ipcMain.handle('assets:copyDefaults', async (_, projectFolderPath: string) => {
        try {
            console.log('=========== ASSETS COPY DEBUG ===========');
            console.log('Project folder path:', projectFolderPath);
            console.log('App path:', app.getAppPath());
            console.log('Process.cwd:', process.cwd());
            console.log('__dirname:', __dirname);

            // Essayons plusieurs chemins possibles et listons leur contenu
            const possiblePaths = [
                path.join(process.resourcesPath, 'default-assets'),
                path.join(app.getAppPath(), 'public', 'aaa'),
                path.join(process.cwd(), 'packages', 'editor', 'public', 'aaa'),
                path.join(process.cwd(), 'public', 'aaa'),
                path.join(__dirname, '..', '..', '..', '..', 'editor', 'public', 'aaa'),
                path.join(__dirname, '..', '..', '..', 'public', 'aaa'),
                path.join(app.getAppPath(), 'editor', 'public', 'aaa'),
                path.join(app.getAppPath(), 'dist', 'editor', 'public', 'aaa')
            ];

            console.log('Trying the following paths:');
            for (const testPath of possiblePaths) {
                console.log(`- ${testPath} (exists: ${existsSync(testPath)})`);
                if (existsSync(testPath)) {
                    try {
                        const files = readdirSync(testPath);
                        console.log(`  Contents (${files.length} items): ${files.slice(0, 5).join(', ')}${files.length > 5 ? '...' : ''}`);
                    } catch (e) {
                        console.log(`  Error reading directory: ${e}`);
                    }
                }
            }

            // Demandons à l'utilisateur où se trouvent les assets
            let defaultAssetsPath = '';
            for (const testPath of possiblePaths) {
                if (existsSync(testPath)) {
                    defaultAssetsPath = testPath;
                    console.log(`Found assets at: ${defaultAssetsPath}`);
                    break;
                }
            }

            if (!defaultAssetsPath) {
                console.error('Default assets folder not found in any location');
                return { copied: 0, errors: 0, assetsList: [] };
            }

            // Fonction pour catégoriser les assets basé sur le chemin
            const categorizeAsset = (assetPath: string): AssetCategorizationResult => {
                const relativePath = path.relative(defaultAssetsPath, assetPath);
                const ext = path.extname(assetPath).toLowerCase();

                // Déterminer le type d'asset
                let type: AssetCategorizationResult['type'] = 'unknown';
                let category: AssetCategorizationResult['category'] = 'other';

                if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) {
                    type = 'image';

                    if (relativePath.includes('backgrounds')) category = 'background';
                    else if (relativePath.includes('characters')) category = 'character';
                    else if (relativePath.includes('evidences')) category = 'evidence';
                    else if (relativePath.includes('profiles')) category = 'profile';
                    else if (relativePath.includes('effects')) category = 'effect';

                } else if (['.mp3', '.wav', '.ogg'].includes(ext)) {
                    type = 'audio';

                    if (relativePath.includes('bgm')) category = 'bgm';
                    else if (relativePath.includes('sfx')) category = 'sfx';
                    else if (relativePath.includes('voices')) category = 'voice';
                }

                return { type, category, relativePath };
            };

            // List to track all copied assets
            const assetsList: AssetItem[] = [];

            // Fonction récursive pour copier un dossier et suivre les assets
            const copyFolderRecursive = async (source: string, destination: string): Promise<CopyResult> => {
                            let copyCount = 0;
                            let errorCount = 0;
            
                            const entries = await fsPromises.readdir(source, { withFileTypes: true });
            
                            for (const entry of entries) {
                                const srcPath = path.join(source, entry.name);
                                const destPath = path.join(destination, entry.name);
            
                                if (entry.isDirectory()) {
                                    // Créer le dossier de destination s'il n'existe pas
                                    try {
                                        await fsPromises.mkdir(destPath, { recursive: true });
                                        const results = await copyFolderRecursive(srcPath, destPath);
                            copyCount += results.copied;
                            errorCount += results.errors;
                        } catch (error) {
                            console.error(`Error creating directory ${destPath}:`, error);
                            errorCount++;
                        }
                    } else {
                        try {
                            await fsPromises.copyFile(srcPath, destPath);

                            // Catégoriser et suivre l'asset
                            const { type, category, relativePath } = categorizeAsset(srcPath);

                            // Ne pas ajouter les fichiers inconnus à la liste des assets
                            if (type !== 'unknown') {
                                assetsList.push({
                                    path: destPath,
                                    name: entry.name.replace(/\.[^/.]+$/, ""), // Nom sans extension
                                    relativePath,
                                    type,
                                    category
                                });
                            }

                            copyCount++;
                        } catch (error) {
                            console.error(`Error copying file from ${srcPath} to ${destPath}:`, error);
                            errorCount++;
                        }
                    }
                }

                return { copied: copyCount, errors: errorCount };
            };

            // Commencer la copie récursive
            const result = await copyFolderRecursive(defaultAssetsPath, projectFolderPath);
            console.log(`Copied ${result.copied} files with ${result.errors} errors`);

            return {
                copied: result.copied,
                errors: result.errors,
                assetsList: assetsList
            };
        } catch (error) {
            console.error('Error copying default assets:', error);
            throw error;
        }
    });
}