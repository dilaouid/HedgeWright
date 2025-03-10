import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Sparkles,
  Trash2,
  Edit,
  Eye,
  Check,
  X,
  PlaySquare,
  StopCircle,
  Lightbulb,
  Film,
} from 'lucide-react';
import {
  useProjectStore,
  Asset,
} from '@/application/state/project/projectStore';
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

type AnimationType = 'effect' | 'transition' | 'special' | 'all';

export function SpecialAnimationManager() {
  const { currentProject, updateProject } = useProjectStore();
  const [animationType, setAnimationType] = useState<AnimationType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [specialAnimations, setSpecialAnimations] = useState<Asset[]>([]);
  const [previewedAnimation, setPreviewedAnimation] = useState<Asset | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAnimation, setEditingAnimation] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Extract special animations from project assets
  useEffect(() => {
    if (currentProject) {
      // Find all special animation assets
      const animations = currentProject.assets.filter(
        (asset) =>
          asset.category === 'special' ||
          asset.category === 'effect' ||
          asset.category === 'transition' ||
          asset.metadata?.isSpecialAnimation
      );

      setSpecialAnimations(animations);
      setIsLoading(false);
    }
  }, [currentProject]);

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
    {} as Record<string, Asset[]>
  );

  // Delete animation
  const deleteAnimation = (animationId: string) => {
    if (window.confirm('Are you sure you want to delete this animation?')) {
      // Close preview if open
      if (previewedAnimation?.id === animationId) {
        setPreviewedAnimation(null);
      }

      updateProject((draft) => {
        const index = draft.assets.findIndex((a) => a.id === animationId);
        if (index !== -1) {
          draft.assets.splice(index, 1);
        }
      });
    }
  };

  // Open edit modal
  const openEditModal = (animation: Asset) => {
    setEditingAnimation({ ...animation });
    setIsEditModalOpen(true);
  };

  // Save edited animation
  const saveEditedAnimation = () => {
    if (!editingAnimation) return;

    updateProject((draft) => {
      const index = draft.assets.findIndex((a) => a.id === editingAnimation.id);
      if (index !== -1) {
        // Update basic info
        draft.assets[index].name = editingAnimation.name;
        draft.assets[index].category = editingAnimation.category;

        // Update metadata
        if (!draft.assets[index].metadata) {
          draft.assets[index].metadata = {};
        }

        draft.assets[index].metadata.description =
          editingAnimation.metadata?.description || '';
        draft.assets[index].metadata.duration =
          editingAnimation.metadata?.duration || 0;
        draft.assets[index].metadata.isSpecialAnimation = true;
      }
    });

    setIsEditModalOpen(false);
    setEditingAnimation(null);
  };

  // Preview animation
  const togglePreview = (animation: Asset) => {
    if (previewedAnimation?.id === animation.id) {
      setPreviewedAnimation(null);
      setIsPlayingPreview(false);
    } else {
      setPreviewedAnimation(animation);
      setIsPlayingPreview(true);
    }
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
        <div className="space-y-6">
          {Object.entries(animationsByCategory).map(
            ([category, animations]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-lg font-ace text-blue-200 flex items-center">
                  {getCategoryIcon(category)}
                  <span className="ml-2">
                    {getCategoryName(category).toUpperCase()}
                  </span>
                  <span className="ml-2 bg-blue-900/50 text-xs px-2 py-0.5 rounded text-blue-300">
                    {animations.length}
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {animations.map((animation) => (
                    <Card
                      key={animation.id}
                      className="bg-blue-950 border-blue-800 overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-square bg-blue-900/30 flex items-center justify-center overflow-hidden">
                        <img
                          src={animation.path}
                          alt={animation.name}
                          className="max-w-full max-h-full object-contain"
                        />

                        {/* Preview button */}
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute bottom-2 right-2 h-8 w-8 bg-blue-950/90 border-blue-800 text-blue-300 hover:bg-blue-900 hover:text-white"
                          onClick={() => togglePreview(animation)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
                              onClick={() => deleteAnimation(animation.id)}
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

      {/* Animation Preview Modal */}
      {previewedAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-blue-950/90 flex items-center justify-center p-4"
          onClick={() => setPreviewedAnimation(null)}
        >
          <div
            className="relative bg-blue-900/30 p-1 rounded-lg border-2 border-blue-700 max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-3 right-3 z-10 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-blue-950/90 border-blue-800 text-blue-300 hover:bg-blue-900 hover:text-white flex items-center gap-1"
                onClick={() => {
                  setIsPlayingPreview(!isPlayingPreview);
                }}
              >
                {isPlayingPreview ? (
                  <>
                    <StopCircle className="h-3.5 w-3.5" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlaySquare className="h-3.5 w-3.5" />
                    Play
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-blue-950/90 border-blue-800 text-blue-300 hover:bg-blue-900 hover:text-white flex items-center gap-1"
                onClick={() => openEditModal(previewedAnimation)}
              >
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-blue-950/90 border-blue-800 text-red-400 hover:bg-red-900/30 hover:text-red-300"
                onClick={() => setPreviewedAnimation(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="max-h-[calc(90vh-2rem)] overflow-auto">
              <div className="p-4 pb-2">
                <h3 className="text-xl font-ace text-white mb-1">
                  {previewedAnimation.name}
                </h3>
                {previewedAnimation.category && (
                  <div className="flex items-center gap-1 text-blue-300 text-sm">
                    {getCategoryIcon(previewedAnimation.category)}
                    <span>{getCategoryName(previewedAnimation.category)}</span>
                  </div>
                )}
                {previewedAnimation.metadata?.description && (
                  <p className="text-blue-200 mt-2">
                    {previewedAnimation.metadata.description as string}
                  </p>
                )}
              </div>

              <div className="p-4 pt-2 bg-black/30 flex items-center justify-center">
                <img
                  src={previewedAnimation.path}
                  alt={previewedAnimation.name}
                  className="max-w-full max-h-[400px] object-contain"
                  style={{
                    animationPlayState: isPlayingPreview ? 'running' : 'paused',
                  }}
                />
              </div>

              {previewedAnimation.metadata?.duration && (
                <div className="px-4 py-2 text-sm text-blue-300">
                  Animation Duration:{' '}
                  {previewedAnimation.metadata.duration as number}ms
                </div>
              )}
            </div>
          </div>
        </motion.div>
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
                    src={editingAnimation.path}
                    alt={editingAnimation.name}
                    className="max-w-full max-h-full object-contain"
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
                        duration: parseInt(e.target.value),
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
