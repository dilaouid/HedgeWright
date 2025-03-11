import React from 'react';
import { useFileSystemWatcher } from '@/application/hooks/project/useFileSystemWatcher';
import { motion } from 'framer-motion';
import { HardDrive, FileSymlink } from 'lucide-react';
import { Progress } from '../ui/progress';

export function AssetScanProgress() {
  const { scanProgress, isScanning } = useFileSystemWatcher();

  if (!isScanning) return null;

  // Calculer la progression globale
  const folders = Object.values(scanProgress);
  const totalFiles = folders.reduce((sum, folder) => sum + folder.total, 0);
  const processedFiles = folders.reduce(
    (sum, folder) => sum + folder.processed,
    0
  );
  const progressPercentage =
    totalFiles > 0 ? Math.round((processedFiles / totalFiles) * 100) : 0;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 bg-blue-950 border border-blue-800 rounded-lg p-3 shadow-lg w-80"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <HardDrive size={16} className="text-blue-400" />
        <h3 className="text-sm font-medium text-blue-100">
          Scanning Project Assets
        </h3>
      </div>

      <Progress value={progressPercentage} className="h-2 mb-2" />

      <div className="flex justify-between text-xs text-blue-300">
        <span className="flex items-center gap-1">
          <FileSymlink size={12} />
          {processedFiles} / {totalFiles} files
        </span>
        <span>{progressPercentage}%</span>
      </div>

      {/* Détail par dossier pour les curieux */}
      <div className="mt-2 max-h-32 overflow-y-auto scrollbar-thin text-xs space-y-1">
        {Object.entries(scanProgress).map(([folder, { total, processed }]) => (
          <div key={folder} className="flex justify-between text-blue-400">
            <span className="truncate">{folder}</span>
            <span>
              {processed}/{total}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
