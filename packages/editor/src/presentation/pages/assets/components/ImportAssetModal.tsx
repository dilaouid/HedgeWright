import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { motion } from 'framer-motion';
import { Upload, X, FileCheck, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/presentation/components/ui/dialog';
import {
  useProjectStore,
  Asset,
  Music,
} from '@/application/state/project/projectStore';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { useIpcService } from '@/infrastructure/electron/services/useIpcService';

interface ImportAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

export function ImportAssetModal({
  isOpen,
  onClose,
  category,
}: ImportAssetModalProps) {
  const { updateProject, currentProject } = useProjectStore();
  const [files, setFiles] = useState<File[]>([]);
  const [assetNames, setAssetNames] = useState<{ [key: string]: string }>({});
  const [assetTypes, setAssetTypes] = useState<{ [key: string]: string }>({});
  const [dragOver, setDragOver] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ipcService = useIpcService();

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setFiles([]);
      setAssetNames({});
      setAssetTypes({});
      setError(null);
    }
  }, [isOpen]);

  // Get allowed file types based on the category
  const getAllowedTypes = () => {
    switch (category) {
      case 'bubbles':
        return ['.png', '.gif', '.webp'];
      case 'music':
        return ['.mp3', '.wav', '.ogg'];
      case 'sprites':
        return ['.png', '.gif', '.webp', '.jpg', '.jpeg'];
      case 'backgrounds':
        return ['.png', '.jpg', '.jpeg', '.webp'];
      case 'evidence':
        return ['.png', '.jpg', '.jpeg', '.webp'];
      case 'special':
        return ['.gif', '.webp', '.png'];
      default:
        return [
          '.png',
          '.jpg',
          '.jpeg',
          '.gif',
          '.webp',
          '.mp3',
          '.wav',
          '.ogg',
        ];
    }
  };

  const getAcceptString = () => {
    return getAllowedTypes().join(',');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      const validFiles = newFiles.filter((file) => {
        const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
        return getAllowedTypes().includes(fileExt);
      });

      if (validFiles.length !== newFiles.length) {
        setError(
          `Some files were filtered out because they are not supported for ${category}`
        );
      }

      // Add new files and initialize their names
      setFiles([...files, ...validFiles]);
      const newAssetNames = { ...assetNames };
      const newAssetTypes = { ...assetTypes };

      validFiles.forEach((file) => {
        // Use the file name without extension as the default asset name
        const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
        newAssetNames[file.name] = baseName;

        // Set default asset type based on category and file extension
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (category === 'music') {
          newAssetTypes[file.name] = fileExt === 'mp3' ? 'bgm' : 'sfx';
        } else {
          newAssetTypes[file.name] =
            category === 'evidence' ? 'evidence' : category.slice(0, -1); // Remove trailing 's'
        }
      });

      setAssetNames(newAssetNames);
      setAssetTypes(newAssetTypes);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter((file) => {
        const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
        return getAllowedTypes().includes(fileExt);
      });

      if (validFiles.length !== newFiles.length) {
        setError(
          `Some files were filtered out because they are not supported for ${category}`
        );
      }

      // Add new files and initialize their names
      setFiles([...files, ...validFiles]);
      const newAssetNames = { ...assetNames };
      const newAssetTypes = { ...assetTypes };

      validFiles.forEach((file) => {
        // Use the file name without extension as the default asset name
        const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
        newAssetNames[file.name] = baseName;

        // Set default asset type based on category and file extension
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (category === 'music') {
          newAssetTypes[file.name] = fileExt === 'mp3' ? 'bgm' : 'sfx';
        } else {
          newAssetTypes[file.name] =
            category === 'evidence' ? 'evidence' : category.slice(0, -1); // Remove trailing 's'
        }
      });

      setAssetNames(newAssetNames);
      setAssetTypes(newAssetTypes);
    }
  };

  const handleNameChange = (fileName: string, newName: string) => {
    setAssetNames({ ...assetNames, [fileName]: newName });
  };

  const handleTypeChange = (fileName: string, newType: string) => {
    setAssetTypes({ ...assetTypes, [fileName]: newType });
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName));
    const newAssetNames = { ...assetNames };
    const newAssetTypes = { ...assetTypes };
    delete newAssetNames[fileName];
    delete newAssetTypes[fileName];
    setAssetNames(newAssetNames);
    setAssetTypes(newAssetTypes);
  };

  const handleImport = async () => {
    setImporting(true);
    setError(null);

    try {
      // Use the IPC service to save files to the project
      for (const file of files) {
        const fileReader = new FileReader();

        // Read file as ArrayBuffer
        const fileData = await new Promise<ArrayBuffer>((resolve, reject) => {
          fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
          fileReader.onerror = reject;
          fileReader.readAsArrayBuffer(file);
        });

        // Determine the target folder based on category/type
        let targetFolder = '';
        const assetType = assetTypes[file.name];
        const fileExt = file.name.split('.').pop()?.toLowerCase();

        // Determine where to save the file
        if (
          category === 'music' ||
          fileExt === 'mp3' ||
          fileExt === 'wav' ||
          fileExt === 'ogg'
        ) {
          targetFolder = assetType === 'bgm' ? 'audio/bgm' : 'audio/sfx';
        } else if (category === 'sprites') {
          targetFolder = 'img/characters';
        } else if (category === 'backgrounds') {
          targetFolder = 'img/backgrounds';
        } else if (category === 'evidence') {
          targetFolder = 'img/evidence';
        } else if (category === 'bubbles') {
          targetFolder = 'img/effects';
        } else if (category === 'special') {
          targetFolder = 'img/effects';
        }

        // Save file to project and get the saved path
        if (!currentProject) {
          throw new Error('No active project found');
        }

        const savedPath = await ipcService.invoke('asset:save', {
          data: Array.from(new Uint8Array(fileData)),
          fileName: file.name,
          targetFolder: targetFolder,
          projectPath: currentProject.projectFolderPath,
        });

        // Update project store with the new asset
        updateProject((draft) => {
          const assetId = nanoid();
          const assetName = assetNames[file.name] || file.name;

          // For music files
          if (
            category === 'music' ||
            fileExt === 'mp3' ||
            fileExt === 'wav' ||
            fileExt === 'ogg'
          ) {
            const musicAsset: Music = {
              id: assetId,
              name: assetName,
              path: savedPath,
              type: assetType,
              relativePath: savedPath,
              loop: assetType === 'bgm',
            };
            draft.music.push(musicAsset);
          }
          // For all other assets
          else {
            const asset: Asset = {
              id: assetId,
              name: assetName,
              type: fileExt || '',
              path: savedPath,
              relativePath: savedPath,
              category: assetType,
            };
            draft.assets.push(asset);

            // For evidence/profiles, also create the corresponding evidence/profile entry
            if (category === 'evidence' && assetType === 'evidence') {
              draft.evidence.push(assetId);
            } else if (category === 'evidence' && assetType === 'profile') {
              draft.profiles.push(assetId);
            }
          }
        });
      }

      // Close the modal after successful import
      onClose();
    } catch (err) {
      console.error('Import error:', err);
      setError('Failed to import one or more assets. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-blue-950 border-2 border-blue-800 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-ace text-yellow-400 tracking-wide shadow-text-sm">
            {category === 'evidence'
              ? 'IMPORT EVIDENCE & PROFILES'
              : category === 'music'
                ? 'IMPORT MUSIC & SFX'
                : `IMPORT ${category.toUpperCase()}`}
          </DialogTitle>
          <DialogDescription className="text-blue-200">
            Select files to import into your project. Supported formats:{' '}
            {getAllowedTypes().join(', ')}
          </DialogDescription>
        </DialogHeader>

        {/* Drag and drop area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-yellow-400 bg-blue-900/50'
              : 'border-blue-700 bg-blue-900/20'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="w-12 h-12 text-blue-400" />
            <p className="text-blue-200">
              Drag and drop files here, or{' '}
              <span className="text-yellow-400">browse</span>
            </p>
            <input
              type="file"
              multiple
              accept={getAcceptString()}
              onChange={handleFileChange}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/50 border border-red-700 rounded-md p-3 flex items-center gap-2"
          >
            <AlertTriangle className="text-red-400 w-5 h-5 flex-shrink-0" />
            <p className="text-red-200 text-sm">{error}</p>
          </motion.div>
        )}

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="font-ace text-lg text-blue-200 mb-2">
              SELECTED FILES
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-ace">
              {files.map((file, index) => (
                <motion.div
                  key={file.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-blue-900/30 border border-blue-800 rounded-lg p-3 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-blue-100 font-medium truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-blue-400">
                        ({Math.round(file.size / 1024)} KB)
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(file.name)}
                      className="text-blue-400 hover:text-red-400 transition-colors"
                      disabled={importing}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor={`name-${index}`}
                        className="text-blue-200 mb-1 block text-sm"
                      >
                        Asset Name
                      </Label>
                      <Input
                        id={`name-${index}`}
                        value={assetNames[file.name] || ''}
                        onChange={(e) =>
                          handleNameChange(file.name, e.target.value)
                        }
                        className="bg-blue-950 border-blue-700 text-white"
                        disabled={importing}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor={`type-${index}`}
                        className="text-blue-200 mb-1 block text-sm"
                      >
                        Asset Type
                      </Label>
                      <Select
                        value={assetTypes[file.name] || ''}
                        onValueChange={(value) =>
                          handleTypeChange(file.name, value)
                        }
                        disabled={importing}
                      >
                        <SelectTrigger className="bg-blue-950 border-blue-700 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-blue-950 border-blue-800 text-white">
                          {category === 'music' && (
                            <>
                              <SelectItem value="bgm">
                                Background Music
                              </SelectItem>
                              <SelectItem value="sfx">Sound Effect</SelectItem>
                              <SelectItem value="voice">Voice</SelectItem>
                            </>
                          )}
                          {category === 'evidence' && (
                            <>
                              <SelectItem value="evidence">Evidence</SelectItem>
                              <SelectItem value="profile">
                                Character Profile
                              </SelectItem>
                            </>
                          )}
                          {category === 'sprites' && (
                            <>
                              <SelectItem value="idle">
                                Idle Animation
                              </SelectItem>
                              <SelectItem value="talking">
                                Talking Animation
                              </SelectItem>
                              <SelectItem value="special">
                                Special Animation
                              </SelectItem>
                            </>
                          )}
                          {category === 'bubbles' && (
                            <>
                              <SelectItem value="objection">
                                Objection Bubble
                              </SelectItem>
                              <SelectItem value="hold_it">
                                Hold It Bubble
                              </SelectItem>
                              <SelectItem value="take_that">
                                Take That Bubble
                              </SelectItem>
                              <SelectItem value="custom">
                                Custom Bubble
                              </SelectItem>
                            </>
                          )}
                          {category === 'backgrounds' && (
                            <>
                              <SelectItem value="background">
                                Scene Background
                              </SelectItem>
                              <SelectItem value="ui">UI Element</SelectItem>
                            </>
                          )}
                          {category === 'special' && (
                            <>
                              <SelectItem value="effect">
                                Visual Effect
                              </SelectItem>
                              <SelectItem value="transition">
                                Transition Animation
                              </SelectItem>
                              <SelectItem value="special">
                                Special Animation
                              </SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Import button */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            className="border-blue-700 text-blue-200 hover:bg-blue-900 hover:text-white"
            onClick={onClose}
            disabled={importing}
          >
            Cancel
          </Button>
          <Button
            className="bg-yellow-600 text-white hover:bg-yellow-500 flex items-center gap-2 font-ace"
            onClick={handleImport}
            disabled={files.length === 0 || importing}
          >
            {importing ? (
              <>
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                IMPORTING...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                IMPORT {files.length} {files.length === 1 ? 'FILE' : 'FILES'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
