/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Trash2,
  Edit,
  Check,
  Lightbulb,
  Film,
} from 'lucide-react';
import { useProjectStore } from '@/application/state/project/projectStore';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Card } from '@/presentation/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import { useAssetManager } from '@/application/hooks/assets/useAssetManager';
import path from 'path-browserify';

type AnimationType = 'effect' | 'transition' | 'special' | 'all';
interface AnimationInfo {
  path: string;
  name: string;
  category: string;
  metadata: Record<string, any>;
}

export function SpecialAnimationManager() {
  const { currentProject, updateProject } = useProjectStore();
  const { assets, updateAssetMetadata, resolveAssetPath } = useAssetManager();

  const [animationType, setAnimationType] = useState<AnimationType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [specialAnimations, setSpecialAnimations] = useState<AnimationInfo[]>(
    []
  );
  const [previewedAnimation, setPreviewedAnimation] = useState<string | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAnimation, setEditingAnimation] =
    useState<AnimationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Extract special animations from assets
  useEffect(() => {
    if (assets.length > 0) {
      const animations: AnimationInfo[] = [];

      // Filter assets that are in the effects folder or have special animation metadata
      const effectAssets = assets.filter(
        (asset) =>
          asset.relativePath.includes('/effects/') ||
          asset.metadata?.isSpecialAnimation ||
          asset.metadata?.category === 'effect'
      );

      // Create animation objects from filtered assets
      for (const asset of effectAssets) {
        const metadata = asset.metadata || {};
        const fileName = path.basename(asset.relativePath);
        const baseName = path.basename(fileName, path.extname(fileName));

        // Categorize the animation based on metadata or name hints
        let category = (metadata.category as string) || 'effect';

        if (!category || category === 'effect') {
          // Try to determine more specific category
          if (fileName.toLowerCase().includes('transition')) {
            category = 'transition';
          } else if (
            fileName.toLowerCase().includes('special') ||
            metadata.isSpecialAnimation
          ) {
            category = 'special';
          }
        }

        animations.push({
          path: asset.relativePath,
          name: metadata.displayName || baseName,
          category,
          metadata: {
            ...metadata,
            description: metadata.description || '',
            duration: metadata.duration || 0,
          },
        });
      }

      setSpecialAnimations(animations);
      setIsLoading(false);
    }
  }, [assets, currentProject]);

  // Filter animations based on type and search term
  const filteredAnimations = specialAnimations.filter((animation) => {
    const matchesType =
      animationType === 'all' || animation.category === animationType;
    const matchesSearch =
      animation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((animation.metadata?.description as string) || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Group animations by category
  const animationsByCategory = filteredAnimations.reduce(
    (acc, animation) => {
      const category = animation.category || 'uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(animation);
      return acc;
    },
    {} as Record<string, AnimationInfo[]>
  );

  // Delete animation
  const deleteAnimation = (animationPath: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this animation metadata? The file will remain in your project.'
      )
    ) {
      // Close preview if open
      if (previewedAnimation === animationPath) {
        setPreviewedAnimation(null);
      }

      updateProject((draft) => {
        // Remove metadata
        if (draft.assetMetadata && draft.assetMetadata[animationPath]) {
          delete draft.assetMetadata[animationPath];
        }
      });

      // Update the local list
      setSpecialAnimations((prev) =>
        prev.filter((anim) => anim.path !== animationPath)
      );
    }
  };

  // Open edit modal
  const openEditModal = (animation: AnimationInfo) => {
    setEditingAnimation({ ...animation });
    setIsEditModalOpen(true);
  };

  // Save edited animation
  const saveEditedAnimation = () => {
    if (!editingAnimation) return;

    updateProject((draft) => {
      if (!draft.assetMetadata) {
        draft.assetMetadata = {};
      }

      // Update metadata for this animation
      draft.assetMetadata[editingAnimation.path] = {
        ...draft.assetMetadata[editingAnimation.path],
        displayName: editingAnimation.name,
        category: editingAnimation.category,
        description: editingAnimation.metadata?.description || '',
        duration: editingAnimation.metadata?.duration || 0,
        isSpecialAnimation: true,
      };
    });

    // Update the asset metadata in the manager
    updateAssetMetadata(editingAnimation.path, {
      displayName: editingAnimation.name,
      category: editingAnimation.category,
      description: editingAnimation.metadata?.description || '',
      duration: editingAnimation.metadata?.duration || 0,
      isSpecialAnimation: true,
    });

    // Update the local list
    setSpecialAnimations((prev) =>
      prev.map((anim) =>
        anim.path === editingAnimation.path
          ? {
              ...anim,
              name: editingAnimation.name,
              category: editingAnimation.category,
              metadata: {
                ...anim.metadata,
                ...editingAnimation.metadata,
              },
            }
          : anim
      )
    );

    setIsEditModalOpen(false);
    setEditingAnimation(null);
  };

  // Get animation category display name
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'effect':
        return 'Visual Effects';
      case 'transition':
        return 'Transitions';
      case 'special':
        return 'Special Animations';
      default:
        return 'Uncategorized';
    }
  };

  // Get animation category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'effect':
        return <Sparkles className="h-4 w-4" />;
      case 'transition':
        return <Film className="h-4 w-4" />;
      case 'special':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-blue-900/30 p-4 rounded-lg">
        <Tabs
          defaultValue="all"
          value={animationType}
          onValueChange={(value) => setAnimationType(value as AnimationType)}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-blue-900/50 w-full md:w-auto">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-blue-700 flex items-center gap-1"
            >
              <Sparkles className="w-4 h-4" />
              All Animations
            </TabsTrigger>
            <TabsTrigger
              value="effect"
              className="data-[state=active]:bg-blue-700 flex items-center gap-1"
            >
              <Sparkles className="w-4 h-4" />
              Effects
            </TabsTrigger>
            <TabsTrigger
              value="transition"
              className="data-[state=active]:bg-blue-700 flex items-center gap-1"
            >
              <Film className="w-4 h-4" />
              Transitions
            </TabsTrigger>
            <TabsTrigger
              value="special"
              className="data-[state=active]:bg-blue-700 flex items-center gap-1"
            >
              <Lightbulb className="w-4 h-4" />
              Special
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search animations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-blue-900/20 border-blue-700 text-white w-full"
          />
        </div>
      </div>

      {/* Animations by category */}
      {Object.keys(animationsByCategory).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(animationsByCategory).map(
            ([category, animations]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-lg font-ace text-blue-200 flex items-center">
                  {getCategoryIcon(category)}
                  <span className="ml-2">
                    {getCategoryName(category).toUpperCase()}
                  </span>
                  <span className="ml-2 bg-blue-900/50 text-xs px-2 py-0.5 rounded text-blue-300">
                    {animations.length}
                  </span>
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {animations.map((animation) => (
                    <Card
                      key={animation.path}
                      className="bg-blue-950 border-blue-800 overflow-hidden flex flex-col h-full"
                    >
                      <div className="relative h-32 bg-blue-900/30 flex items-center justify-center overflow-hidden border-b border-blue-800/50">
                        <img
                          src={resolveAssetPath(animation.path)}
                          alt={animation.name}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src =
                              '/assets/images/ui/placeholder.png';
                            e.currentTarget.alt = 'Image not found';
                          }}
                        />
                      </div>

                      <div className="p-3 flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <h4 className="text-white font-medium truncate">
                            {animation.name}
                          </h4>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-blue-400 hover:text-blue-300"
                              onClick={() => openEditModal(animation)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-400 hover:text-red-300"
                              onClick={() => deleteAnimation(animation.path)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        {animation.metadata?.description && (
                          <p className="text-xs text-blue-300 mt-1 line-clamp-2 flex-1">
                            {animation.metadata.description as string}
                          </p>
                        )}

                        {animation.metadata?.duration && (
                          <div className="text-xs text-blue-400 mt-1">
                            Duration: {animation.metadata.duration as number}ms
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-blue-900/20 rounded-lg border border-blue-800/50">
          <p className="text-blue-300 mb-2">No special animations found</p>
          <p className="text-blue-400 text-sm mb-4">
            {searchTerm
              ? 'Try a different search term'
              : 'Import animations using the Import Assets button above'}
          </p>
        </div>
      )}

      {/* Edit Animation Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => !open && setIsEditModalOpen(false)}
      >
        <DialogContent className="bg-blue-950 border-2 border-blue-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-ace text-yellow-400">
              EDIT ANIMATION
            </DialogTitle>
          </DialogHeader>

          {editingAnimation && (
            <div className="space-y-4 pt-2">
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 bg-blue-900/30 rounded-md flex items-center justify-center overflow-hidden">
                  <img
                    src={resolveAssetPath(editingAnimation.path)}
                    alt={editingAnimation.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/images/ui/placeholder.png';
                      e.currentTarget.alt = 'Failed to load';
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="text-blue-200 mb-2 block text-sm">
                  Animation Name
                </label>
                <Input
                  value={editingAnimation.name}
                  onChange={(e) =>
                    setEditingAnimation({
                      ...editingAnimation,
                      name: e.target.value,
                    })
                  }
                  className="bg-blue-900/30 border-blue-700 text-white"
                />
              </div>

              <div>
                <label className="text-blue-200 mb-2 block text-sm">
                  Animation Type
                </label>
                <select
                  value={editingAnimation.category || 'special'}
                  onChange={(e) =>
                    setEditingAnimation({
                      ...editingAnimation,
                      category: e.target.value,
                    })
                  }
                  className="w-full bg-blue-900/30 border border-blue-700 rounded-md p-2 text-white"
                >
                  <option value="effect">Visual Effect</option>
                  <option value="transition">Transition</option>
                  <option value="special">Special Animation</option>
                </select>
              </div>

              <div>
                <label className="text-blue-200 mb-2 block text-sm">
                  Description
                </label>
                <textarea
                  value={
                    (editingAnimation.metadata?.description as string) || ''
                  }
                  onChange={(e) =>
                    setEditingAnimation({
                      ...editingAnimation,
                      metadata: {
                        ...(editingAnimation.metadata || {}),
                        description: e.target.value,
                      },
                    })
                  }
                  rows={3}
                  className="w-full bg-blue-900/30 border border-blue-700 rounded-md p-2 text-white"
                  placeholder="Describe what this animation does"
                />
              </div>

              <div>
                <label className="text-blue-200 mb-2 block text-sm">
                  Duration (milliseconds)
                </label>
                <Input
                  type="number"
                  value={(editingAnimation.metadata?.duration as number) || 0}
                  onChange={(e) =>
                    setEditingAnimation({
                      ...editingAnimation,
                      metadata: {
                        ...(editingAnimation.metadata || {}),
                        duration: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="bg-blue-900/30 border-blue-700 text-white"
                  placeholder="e.g., 1000 for 1 second"
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
                  onClick={saveEditedAnimation}
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
