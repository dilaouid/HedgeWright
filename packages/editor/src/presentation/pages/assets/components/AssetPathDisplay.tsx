import React from 'react';
import { Folder, ExternalLink } from 'lucide-react';
import { useIpcService } from '@/infrastructure/electron/services/useIpcService';

interface AssetPathDisplayProps {
  folderPath: string;
}

/**
 * Displays the folder path for assets with an option to open it in the file explorer
 */
const AssetPathDisplay: React.FC<AssetPathDisplayProps> = ({ folderPath }) => {
  const { invoke, isElectron } = useIpcService();

  const openInExplorer = async () => {
    if (isElectron) {
      try {
        await invoke('file:openInExplorer', folderPath);
      } catch (error) {
        console.error('Failed to open folder in explorer:', error);
      }
    }
  };

  // Simplify long paths for display
  const displayPath =
    folderPath.length > 60
      ? '...' + folderPath.substring(folderPath.length - 60)
      : folderPath;

  return (
    <div className="p-2 bg-blue-900/20 border border-blue-800/70 rounded-md mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-blue-300">
        <Folder className="h-4 w-4 text-blue-400" />
        <span className="font-mono">{displayPath}</span>
      </div>

      {isElectron && (
        <button
          onClick={openInExplorer}
          className="text-blue-400 hover:text-blue-200 p-1 rounded hover:bg-blue-800/40 transition-colors"
          title="Open folder in explorer"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default AssetPathDisplay;
