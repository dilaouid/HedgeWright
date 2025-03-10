import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Trash2,
  Edit,
  Eye,
  Check,
  X,
  Star,
} from 'lucide-react';
import {
  useProjectStore,
  Asset,
} from '@/application/state/project/projectStore';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Card } from '@/presentation/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';

interface BackgroundCategory {
  id: string;
  name: string;
  backgrounds: Asset[];
}

export function BackgroundManager() {
  const { currentProject, updateProject } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [backgroundCategories, setBackgroundCategories] = useState<
    BackgroundCategory[]
  >([]);
  const [previewBackground, setPreviewBackground] = useState<Asset | null>(
    null
  );
  const [editingBackground, setEditingBackground] = useState<Asset | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  

  // Extract backgrounds from project assets
  useEffect(() => {
    if (currentProject) {
      // Find all background assets
      const backgroundAssets = currentProject.assets.filter(
        (asset) =>
          asset.category === 'background' || asset.metadata?.isBackground
      );

      console.log(currentProject.assets);
      

      // Group backgrounds by location/category
      const categoriesMap = new Map<string, BackgroundCategory>();

      backgroundAssets.forEach((asset) => {
        const location =
          (asset.metadata?.location as string) || 'Uncategorized';

        if (!categoriesMap.has(location)) {
          categoriesMap.set(location, {
            id: location,
            name: location,
            backgrounds: [],
          });
        }

        categoriesMap.get(location)?.backgrounds.push(asset);
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
  }, [currentProject]);

  // Filter backgrounds based on search term
  const getFilteredCategories = () => {
    return backgroundCategories
      .map((category) => ({
        ...category,
        backgrounds: category.backgrounds.filter(
          (bg) =>
            bg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ((bg.metadata?.description as string) || '')
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((category) => category.backgrounds.length > 0);
  };

  // Delete background
  const deleteBackground = (backgroundId: string) => {
    if (window.confirm('Are you sure you want to delete this background?')) {
      updateProject((draft) => {
        const index = draft.assets.findIndex((a) => a.id === backgroundId);
        if (index !== -1) {
          draft.assets.splice(index, 1);
        }

        // Also remove from backgrounds array if present
        const bgIndex = draft.backgrounds.indexOf(backgroundId);
        if (bgIndex !== -1) {
          draft.backgrounds.splice(bgIndex, 1);
        }
      });
    }
  };

  // Open edit modal
  const openEditModal = (background: Asset) => {
    setEditingBackground({ ...background });
    setIsEditModalOpen(true);
  };

  // Save edited background
  const saveEditedBackground = () => {
    if (!editingBackground) return;

    updateProject((draft) => {
      const index = draft.assets.findIndex(
        (a) => a.id === editingBackground.id
      );
      if (index !== -1) {
        // Update basic info
        draft.assets[index].name = editingBackground.name;

        // Update metadata
        if (!draft.assets[index].metadata) {
          draft.assets[index].metadata = {};
        }

        draft.assets[index].metadata.location =
          editingBackground.metadata?.location || 'Uncategorized';
        draft.assets[index].metadata.description =
          editingBackground.metadata?.description || '';
        draft.assets[index].metadata.isBackground = true;

        // Ensure category is set
        draft.assets[index].category = 'background';

        // Add to backgrounds array if not already there
        if (!draft.backgrounds.includes(editingBackground.id)) {
          draft.backgrounds.push(editingBackground.id);
        }
      }
    });

    setIsEditModalOpen(false);
    setEditingBackground(null);
  };

  // Preview a background in full-screen
  const previewBg = (background: Asset) => {
    setPreviewBackground(background);

    console.log(previewBackground);
  };

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
                    key={bg.id}
                    className="bg-blue-950 border-blue-800 overflow-hidden"
                  >
                    <div className="relative aspect-video bg-blue-900/30 flex items-center justify-center overflow-hidden">
                      <img
                        src={bg.path}
                        alt={bg.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Used indicator */}
                      {currentProject?.scenes.some((sceneId) => {
                        const scene = currentProject?.assets.find(
                          (a) => a.id === sceneId
                        );
                        return scene?.metadata?.backgroundId === bg.id;
                      }) && (
                        <div className="absolute top-2 left-2 bg-yellow-600/90 text-xs px-2 py-1 rounded-full text-white flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Used in scenes
                        </div>
                      )}

                      {/* Preview button */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute bottom-2 right-2 h-8 w-8 bg-blue-950/90 border-blue-800 text-blue-300 hover:bg-blue-900 hover:text-white"
                        onClick={() => previewBg(bg)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="p-3">
                      <div className="flex justify-between items-start">
                        <h4 className="text-white font-medium truncate">
                          {bg.name}
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
                            onClick={() => deleteBackground(bg.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {bg.metadata?.description && (
                        <p className="text-xs text-blue-300 mt-1 line-clamp-2">
                          {bg.metadata.description as string}
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
              : 'Import background images using the Import Assets button above'}
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
                  src={editingBackground.path}
                  alt={editingBackground.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <label className="text-blue-200 mb-2 block text-sm">
                  Background Name
                </label>
                <Input
                  value={editingBackground.name}
                  onChange={(e) =>
                    setEditingBackground({
                      ...editingBackground,
                      name: e.target.value,
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
                  value={(editingBackground.metadata?.location as string) || ''}
                  onChange={(e) =>
                    setEditingBackground({
                      ...editingBackground,
                      metadata: {
                        ...(editingBackground.metadata || {}),
                        location: e.target.value,
                      },
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
                  value={
                    (editingBackground.metadata?.description as string) || ''
                  }
                  onChange={(e) =>
                    setEditingBackground({
                      ...editingBackground,
                      metadata: {
                        ...(editingBackground.metadata || {}),
                        description: e.target.value,
                      },
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

      {/* Background Preview Modal */}
      {previewBackground && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-blue-950/90 flex items-center justify-center p-4"
          onClick={() => setPreviewBackground(null)}
        >
          <div
            className="relative bg-blue-900/30 p-1 rounded-lg border-2 border-blue-700 max-w-5xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-3 right-3 z-10 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-blue-950/90 border-blue-800 text-blue-300 hover:bg-blue-900 hover:text-white flex items-center gap-1"
                onClick={() => openEditModal(previewBackground)}
              >
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-blue-950/90 border-blue-800 text-red-400 hover:bg-red-900/30 hover:text-red-300"
                onClick={() => setPreviewBackground(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="max-h-[calc(90vh-2rem)] overflow-auto">
              <div className="p-4 pb-2">
                <h3 className="text-xl font-ace text-white">
                  {previewBackground.name}
                </h3>
                {previewBackground.metadata?.location && (
                  <p className="text-blue-300 text-sm mt-1">
                    Location: {previewBackground.metadata.location as string}
                  </p>
                )}
                {previewBackground.metadata?.description && (
                  <p className="text-blue-200 mt-2">
                    {previewBackground.metadata.description as string}
                  </p>
                )}
              </div>

              <div className="p-4 pt-2 bg-black/30">
                <img
                  src={previewBackground.path}
                  alt={previewBackground.name}
                  className="max-w-full mx-auto"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
