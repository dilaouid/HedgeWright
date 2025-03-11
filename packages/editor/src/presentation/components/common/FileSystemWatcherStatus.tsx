import React from 'react';
import { useFileSystemWatcher } from '@/application/hooks/project/useFileSystemWatcher';
import {
  FolderSymlink,
  Layers,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

export function FileSystemWatcherStatus() {
  const { status, isReady } = useFileSystemWatcher();

  // Don't render anything if the feature isn't available
  if (!isReady) {
    return null;
  }

  // If not active but the service is ready, show disabled state
  if (!status.isActive) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-xs bg-blue-950/60 text-blue-400 rounded-md px-2 py-1 opacity-70">
              <FolderSymlink size={14} className="text-blue-500" />
              <span className="hidden md:inline">File Watcher</span>
              <span className="inline md:hidden">FW</span>
              <div className="w-2 h-2 rounded-full bg-blue-700"></div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="space-y-1 p-1">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-blue-400" />
                <span className="font-medium">File Watcher Inactive</span>
              </div>
              <div className="text-xs text-blue-200">
                Open a project to enable automatic asset imports.
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Active state - same as before
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="flex items-center gap-1 text-xs bg-blue-900/60 text-blue-200 rounded-md px-2 py-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FolderSymlink size={14} className="text-blue-400" />
            <span className="hidden md:inline">File Watcher</span>
            <span className="inline md:hidden">FW</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-blue-300 hidden md:inline">
              {status.watchedFiles} files
            </span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="space-y-1 p-1">
            <div className="flex items-center gap-2">
              <FolderSymlink size={14} className="text-blue-400" />
              <span className="font-medium">File System Watcher Active</span>
            </div>
            <div className="text-xs text-blue-200">
              Drag & drop files into your project folders to auto-import them.
            </div>
            <div className="flex items-start gap-2">
              <Layers size={14} className="text-blue-400 mt-0.5" />
              <div>
                <span className="font-medium">
                  Watching {status.watchedFiles} files
                </span>
                <div className="text-xs text-blue-300 mt-0.5 truncate max-w-60">
                  {status.projectPath}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-300 mt-1">
              <AlertTriangle size={12} />
              <span>Changes will be saved automatically.</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
