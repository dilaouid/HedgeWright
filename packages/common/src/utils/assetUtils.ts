// packages\common\src\utils\assetUtils.ts
import path from 'path-browserify';

/**
 * Extracts category from the file path based on folder structure
 */
export function getCategoryFromPath(filePath: string): string {
    const normalizedPath = filePath.replace(/\\/g, '/');

    if (normalizedPath.includes('/backgrounds/')) return 'background';
    if (normalizedPath.includes('/characters/')) return 'character';
    if (normalizedPath.includes('/evidences/') || normalizedPath.includes('/evidence/')) return 'evidence';
    if (normalizedPath.includes('/profiles/')) return 'profile';
    if (normalizedPath.includes('/effects/')) return 'effect';
    if (normalizedPath.includes('/bgm/')) return 'bgm';
    if (normalizedPath.includes('/sfx/')) return 'sfx';
    if (normalizedPath.includes('/voices/')) return 'voice';

    return 'other';
}

/**
 * Gets the relative path from project folder
 */
export function getRelativePath(fullPath: string, projectPath: string): string {
    // Normalize paths to handle different separators
    const normalizedFullPath = fullPath.replace(/\\/g, '/');
    const normalizedProjectPath = projectPath.replace(/\\/g, '/');

    // Check if fullPath is already a relative path
    if (!normalizedFullPath.startsWith(normalizedProjectPath)) {
        return fullPath; // Already relative or outside project
    }

    // Get the relative path
    let relativePath = normalizedFullPath.substring(normalizedProjectPath.length);

    // Remove leading slash if present
    if (relativePath.startsWith('/')) {
        relativePath = relativePath.substring(1);
    }

    return relativePath;
}

/**
 * Gets the asset type based on file extension
 */
export function getAssetType(filePath: string): 'image' | 'audio' | 'unknown' {
    const ext = path.extname(filePath).toLowerCase();

    if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) {
        return 'image';
    } else if (['.mp3', '.wav', '.ogg'].includes(ext)) {
        return 'audio';
    }

    return 'unknown';
}

/**
 * Gets the file name without extension
 */
export function getFileName(filePath: string): string {
    const baseName = path.basename(filePath);
    return baseName.substring(0, baseName.lastIndexOf('.'));
}