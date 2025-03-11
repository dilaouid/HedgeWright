/**
 * Normalizes a file path to ensure consistent format
 * - Ensures Windows-style backslashes
 * - Handles relative paths correctly
 */
export const normalizeFilePath = (filePath: string, projectPath?: string): string => {
    // Replace forward slashes with backslashes for Windows compatibility
    let normalizedPath = filePath.replace(/\//g, '\\');

    // Ensure the path starts with the project path if it's a relative path and project path is provided
    if (projectPath && !normalizedPath.startsWith(projectPath) && !normalizedPath.match(/^[A-Z]:\\/i)) {
        // Handle paths that might already contain part of the project path
        const relativePath = normalizedPath.startsWith('\\') ? normalizedPath.substring(1) : normalizedPath;
        normalizedPath = `${projectPath}\\${relativePath}`;
    }

    return normalizedPath;
};

/**
 * Extracts the relative path from an absolute path based on the project folder
 */
export const getRelativePath = (absolutePath: string, projectPath: string): string => {
    if (absolutePath.startsWith(projectPath)) {
        return absolutePath.substring(projectPath.length).replace(/^\\/, '');
    }
    return absolutePath;
};

/**
 * Ensures a folder path ends with a trailing slash/backslash
 */
export const ensureTrailingSlash = (folderPath: string): string => {
    if (!folderPath.endsWith('/') && !folderPath.endsWith('\\')) {
        return `${folderPath}\\`;
    }
    return folderPath;
};

/**
 * Gets the file extension from a path
 */
export const getFileExtension = (filePath: string): string => {
    const parts = filePath.split('.');
    return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
};

/**
 * Gets the file name without extension
 */
export const getFileNameWithoutExtension = (filePath: string): string => {
    const fileName = filePath.split(/[\/\\]/).pop() || '';
    return fileName.substring(0, fileName.lastIndexOf('.'));
};

/**
 * Sanitizes a filename by removing invalid characters
 */
export const sanitizeFileName = (fileName: string): string => {
    return fileName.replace(/[<>:"\/\\|?*]/g, '_');
};