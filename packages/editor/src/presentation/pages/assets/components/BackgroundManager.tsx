import React, { useState, useEffect } from 'react';
import { Search, Trash2, Edit, Check, Star } from 'lucide-react';
import { useProjectStore } from '@/application/state/project/projectStore';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Card } from '@/presentation/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import { useAssetManager } from '@/application/hooks/assets/useAssetManager';
import path from 'path-browserify';
import AssetPathDisplay from './AssetPathDisplay';

// Define a background with metadata
interface Background {
  path: string; // Relative file path
  relativePath: string; // Same as path but explicitly for display
  displayName?: string; // User-friendly name (defaults to filename)
  location?: string; // Category/location of background
  description?: string; // Optional description
  inUse?: boolean; // Whether this background is used in scenes
}

interface BackgroundCategory {
  id: string;
  name: string;
  backgrounds: Background[];
}

export function BackgroundManager() {
  const { currentProject, updateProject } = useProjectStore();
  const { assets, resolveAssetPath, updateAssetMetadata } = useAssetManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [backgroundCategories, setBackgroundCategories] = useState<
    BackgroundCategory[]
  >([]);
  const [editingBackground, setEditingBackground] = useState<Background | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Extract backgrounds from assets
  useEffect(() => {
    if (currentProject && assets.length > 0) {
      // Find all background assets
      const backgroundAssets = assets.filter(
        (asset) =>
          asset.metadata?.category === 'background' ||
          asset.relativePath.includes('/backgrounds/')
      );

      console.log(`Found ${backgroundAssets.length} backgrounds`);

      // Group backgrounds by location/category from metadata or default to "Uncategorized"
      const categoriesMap = new Map<string, BackgroundCategory>();

      backgroundAssets.forEach((asset) => {
        const location =
          (asset.metadata?.location as string) || 'Uncategorized';
        const fileName = path.basename(asset.relativePath);
        const displayName =
          asset.metadata?.displayName ||
          path.basename(fileName, path.extname(fileName));

        if (!categoriesMap.has(location)) {
          categoriesMap.set(location, {
            id: location,
            name: location,
            backgrounds: [],
          });
        }

        // Check if this background is used in any scenes
        const inUse = currentProject?.scenes?.some((scene) => {
          return scene.background === asset.relativePath;
        }) || false;

        categoriesMap.get(location)?.backgrounds.push({
          path: asset.relativePath,
          relativePath: asset.relativePath,
          displayName: displayName,
          location: location,
          description: asset.metadata?.description as string,
          inUse: inUse,
        });
      });

      // Convert map to array and sort alphabetically
      const categories = Array.from(categoriesMap.values()).sort((a, b) => {
        // Put "Uncategorized" at the end
        if (a.name === 'Uncategorized') return 1;
        if (b.name === 'Uncategorized') return -1;
        return a.name.localeCompare(b.name);
      });

      setBackgroundCategories(categories);
      setIsLoading(false);
    }
  }, [currentProject, assets]);

  // Filter backgrounds based on search term
  const getFilteredCategories = () => {
    if (searchTerm.trim() === '') {
      return backgroundCategories;
    }
    
    return backgroundCategories
      .map((category) => ({
        ...category,
        backgrounds: category.backgrounds.filter(
          (bg) =>
            (bg.displayName || '')
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (bg.description || '')
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (bg.location || '')
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((category) => category.backgrounds.length > 0);
  };

  // Delete background (note: this doesn't delete the file, just removes from metadata if any)
  const deleteBackground = (backgroundPath: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this background's metadata? This won't delete the actual file."
      )
    ) {
      updateProject((draft) => {
        // Update asset metadata to remove any background-specific data
        if (draft.assetMetadata && draft.assetMetadata[backgroundPath]) {
          delete draft.assetMetadata[backgroundPath];
        }
      });
    }
  };

  // Open edit modal
  const openEditModal = (background: Background) => {
    setEditingBackground({ ...background });
    setIsEditModalOpen(true);
  };

  // Save edited background
  const saveEditedBackground = () => {
    if (!editingBackground) return;

    updateProject((draft) => {
      // Create or update metadata entry for this path
      if (!draft.assetMetadata) {
        draft.assetMetadata = {};
      }

      // Update the metadata
      draft.assetMetadata[editingBackground.path] = {
        ...(draft.assetMetadata[editingBackground.path] || {}),
        displayName: editingBackground.displayName,
        description: editingBackground.description,
        location: editingBackground.location || 'Uncategorized',
        category: 'background',
      };
    });

    // Also update in-memory asset metadata
    updateAssetMetadata(editingBackground.path, {
      displayName: editingBackground.displayName,
      description: editingBackground.description,
      location: editingBackground.location || 'Uncategorized',
      category: 'background'
    });

    setIsEditModalOpen(false);
    setEditingBackground(null);
  };

  // Chemin complet du dossier des backgrounds
  const backgroundFolderPath = currentProject?.projectFolderPath + '/img/backgrounds';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  const filteredCategories = getFilteredCategories();

  return (
    <div className="space-y-4">
      {backgroundFolderPath && <AssetPathDisplay folderPath={backgroundFolderPath} />}
      {/* Search controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-blue-900/30 p-4 rounded-lg">
        <div>
          <h2 className="text-xl font-ace text-white mb-1">BACKGROUNDS</h2>
          <p className="text-blue-200 text-sm">
            Manage scene backgrounds and locations
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search backgrounds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-blue-900/20 border-blue-700 text-white w-full"
          />
        </div>
      </div>

      {/* Backgrounds by location */}
      {filteredCategories.length > 0 ? (
        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="space-y-3">
              <h3 className="text-lg font-ace text-blue-200 flex items-center">
                {category.name.toUpperCase()}
                <span className="ml-2 bg-blue-900/50 text-xs px-2 py-0.5 rounded text-blue-300">
                  {category.backgrounds.length}
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.backgrounds.map((bg) => (
                  <Card
                    key={bg.path}
                    className="bg-blue-950 border-blue-800 overflow-hidden"
                  >
                    <div className="relative aspect-video bg-blue-900/30 flex items-center justify-center overflow-hidden">
                      <img
                        src={resolveAssetPath(bg.path)}
                        alt={bg.displayName || path.basename(bg.path)}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/images/ui/placeholder.png';
                          e.currentTarget.alt = 'Failed to load image';
                        }}
                      />

                      {/* Used indicator */}
                      {bg.inUse && (
                        <div className="absolute top-2 left-2 bg-yellow-600/90 text-xs px-2 py-1 rounded-full text-white flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Used in scenes
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <div className="flex justify-between items-start">
                        <h4 className="text-white font-medium truncate">
                          {bg.displayName || path.basename(bg.path)}
                        </h4>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-blue-400 hover:text-blue-300"
                            onClick={() => openEditModal(bg)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-400 hover:text-red-300"
                            onClick={() => deleteBackground(bg.path)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {bg.description && (
                        <p className="text-xs text-blue-300 mt-1 line-clamp-2">
                          {bg.description}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-blue-900/20 rounded-lg border border-blue-800/50">
          <p className="text-blue-300 mb-2">No backgrounds found</p>
          <p className="text-blue-400 text-sm mb-4">
            {searchTerm
              ? 'Try a different search term'
              : 'Add background images to the img/backgrounds folder in your project'}
          </p>
        </div>
      )}

      {/* Edit Background Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => !open && setIsEditModalOpen(false)}
      >
        <DialogContent className="bg-blue-950 border-2 border-blue-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-ace text-yellow-400">
              EDIT BACKGROUND
            </DialogTitle>
          </DialogHeader>

          {editingBackground && (
            <div className="space-y-4 pt-2">
              <div className="relative aspect-video bg-blue-900/30 rounded-md flex items-center justify-center overflow-hidden mb-4">
                <img
                  src={resolveAssetPath(editingBackground.path)}
                  alt={
                    editingBackground.displayName ||
                    path.basename(editingBackground.path)
                  }
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/images/ui/placeholder.png';
                    e.currentTarget.alt = 'Failed to load';
                  }}
                />
              </div>

              <div>
                <label className="text-blue-200 mb-2 block text-sm">
                  Background Name
                </label>
                <Input
                  value={
                    editingBackground.displayName ||
                    path.basename(
                      editingBackground.path,
                      path.extname(editingBackground.path)
                    )
                  }
                  onChange={(e) =>
                    setEditingBackground({
                      ...editingBackground,
                      displayName: e.target.value,
                    })
                  }
                  className="bg-blue-900/30 border-blue-700 text-white"
                />
              </div>

              <div>
                <label className="text-blue-200 mb-2 block text-sm">
                  Location/Category
                </label>
                <Input
                  value={editingBackground.location || ''}
                  onChange={(e) =>
                    setEditingBackground({
                      ...editingBackground,
                      location: e.target.value,
                    })
                  }
                  placeholder="e.g., Courtroom, Detention Center, Office"
                  className="bg-blue-900/30 border-blue-700 text-white"
                />
              </div>

              <div>
                <label className="text-blue-200 mb-2 block text-sm">
                  Description
                </label>
                <textarea
                  value={editingBackground.description || ''}
                  onChange={(e) =>
                    setEditingBackground({
                      ...editingBackground,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full bg-blue-900/30 border border-blue-700 rounded-md p-2 text-white"
                  placeholder="Optional description of this background"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  className="text-blue-300 hover:text-blue-100"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-yellow-600 text-white hover:bg-yellow-500 flex items-center gap-1"
                  onClick={saveEditedBackground}
                >
                  <Check className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}