/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { Search, Trash2, Edit, Eye, Check, X } from 'lucide-react';
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

type SpriteCategory = 'idle' | 'talking' | 'special' | 'all';

interface SpriteInfo {
  path: string;
  name: string;
  metadata: Record<string, any>;
  spriteType?: string;
}

interface CharacterSprites {
  id: string; // character id
  name: string;
  sprites: {
    idle: SpriteInfo[];
    talking: SpriteInfo[];
    special: SpriteInfo[];
  };
}

export function SpriteManager() {
  const { currentProject, updateProject } = useProjectStore();
  const { updateAssetMetadata } = useAssetManager();

  const [category, setCategory] = useState<SpriteCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [characterSprites, setCharacterSprites] = useState<CharacterSprites[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSprite, setEditingSprite] = useState<SpriteInfo | null>(null);
  const [editingCharacter, setEditingCharacter] = useState('');
  const [previewedSprite, setPreviewedSprite] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  // Extract sprites from project assets
  useEffect(() => {
    if (currentProject) {
      // Find all sprites in the characters folder
      const spritePaths = currentProject.folders?.img.characters || [];
      const assetMetadata = currentProject.assetMetadata || {};

      // Extract characters and their sprites
      const extractedCharacters: CharacterSprites[] = [];
      const charactersMap = new Map<string, CharacterSprites>();

      // First pass: identify all characters
      currentProject.characters.forEach((char) => {
        if (!charactersMap.has(char.id)) {
          charactersMap.set(char.id, {
            id: char.id,
            name: char.name,
            sprites: {
              idle: [],
              talking: [],
              special: [],
            },
          });
        }
      });

      // Second pass: match sprites to characters by metadata
      spritePaths.forEach((path) => {
        const metadata = assetMetadata[path] || {};
        if (metadata.characterId) {
          const charId = metadata.characterId as string;
          const spriteType = (metadata.spriteType || 'idle') as
            | 'idle'
            | 'talking'
            | 'special';

          if (charactersMap.has(charId)) {
            const charData = charactersMap.get(charId)!;
            // Ensure spriteType is one of the allowed keys
            if (
              spriteType === 'idle' ||
              spriteType === 'talking' ||
              spriteType === 'special'
            ) {
              charData.sprites[spriteType].push({
                path,
                name:
                  metadata.displayName ||
                  path.split('/').pop()?.split('.')[0] ||
                  path,
                metadata,
                spriteType,
              });
            }
          }
        }
      });

      // For sprites without character assignment, create "Unassigned" category
      const unassignedSprites: SpriteInfo[] = [];

      for (const path of spritePaths) {
        if (!assetMetadata[path]?.characterId) {
          const metadata = assetMetadata[path] || {};
          const fileName = path.split('/').pop() || '';
          const baseName = fileName.split('.')[0] || '';

          unassignedSprites.push({
            path,
            name: metadata.displayName || baseName || path,
            metadata,
            spriteType: (metadata.spriteType as string) || 'idle',
          });
        }
      }

      if (unassignedSprites.length > 0) {
        charactersMap.set('unassigned', {
          id: 'unassigned',
          name: 'Unassigned Sprites',
          sprites: {
            idle: unassignedSprites.filter(
              (s) => s.spriteType === 'idle' || !s.spriteType
            ),
            talking: unassignedSprites.filter(
              (s) => s.spriteType === 'talking'
            ),
            special: unassignedSprites.filter(
              (s) => s.spriteType === 'special'
            ),
          },
        });
      }

      // Convert map to array
      charactersMap.forEach((char) => extractedCharacters.push(char));
      setCharacterSprites(extractedCharacters);
      setIsLoading(false);
    }
  }, [currentProject]);

  // Filter sprites based on category and search term
  const getFilteredSprites = () => {
    if (category === 'all') {
      return characterSprites.filter(
        (character) =>
          character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Object.values(character.sprites).some((spriteArray) =>
            spriteArray.some((sprite) =>
              sprite.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
      );
    }

    return characterSprites.filter(
      (character) =>
        (character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          character.sprites[category].some((sprite) =>
            sprite.name.toLowerCase().includes(searchTerm.toLowerCase())
          )) &&
        character.sprites[category].length > 0
    );
  };

  const deleteSprite = (spritePath: string) => {
    if (window.confirm('Are you sure you want to delete this sprite?')) {
      // Close preview if open
      if (previewedSprite === spritePath) {
        setPreviewedSprite(null);
      }

      updateProject((draft) => {
        // Remove from folders.img.characters
        if (draft.folders?.img.characters) {
          const index = draft.folders.img.characters.indexOf(spritePath);
          if (index !== -1) {
            draft.folders.img.characters.splice(index, 1);
          }
        }

        // Remove metadata
        if (draft.assetMetadata && draft.assetMetadata[spritePath]) {
          delete draft.assetMetadata[spritePath];
        }
      });
    }
  };

  // Open edit modal
  const openEditModal = (sprite: SpriteInfo, characterId: string) => {
    setEditingSprite({ ...sprite });
    setEditingCharacter(characterId);
    setIsEditModalOpen(true);
  };

  // Save edited sprite
  const saveEditedSprite = () => {
    if (!editingSprite) return;

    updateProject((draft) => {
      if (!draft.assetMetadata) {
        draft.assetMetadata = {};
      }

      // Update metadata for the sprite
      draft.assetMetadata[editingSprite.path] = {
        ...draft.assetMetadata[editingSprite.path],
        displayName: editingSprite.name,
        spriteType: editingSprite.metadata?.spriteType || 'idle',
        category: 'sprite',
      };

      // Update character assignment
      if (editingCharacter !== 'unassigned') {
        draft.assetMetadata[editingSprite.path].characterId = editingCharacter;

        // Find character name
        const character = draft.characters.find(
          (c) => c.id === editingCharacter
        );
        if (character) {
          draft.assetMetadata[editingSprite.path].characterName =
            character.name;
        }
      } else {
        // Remove character assignment
        if (draft.assetMetadata[editingSprite.path]) {
          delete draft.assetMetadata[editingSprite.path].characterId;
          delete draft.assetMetadata[editingSprite.path].characterName;
        }
      }
    });

    // Also update with useAssetManager hook for in-memory state
    updateAssetMetadata(editingSprite.path, {
      displayName: editingSprite.name,
      spriteType: editingSprite.metadata?.spriteType || 'idle',
      category: 'sprite',
      ...(editingCharacter !== 'unassigned'
        ? {
            characterId: editingCharacter,
            characterName: currentProject?.characters.find(
              (c) => c.id === editingCharacter
            )?.name,
          }
        : {}),
    });

    setIsEditModalOpen(false);
    setEditingSprite(null);
  };

  // Toggle sprite preview
  const togglePreview = (spritePath: string) => {
    if (previewedSprite === spritePath) {
      setPreviewedSprite(null);
    } else {
      setPreviewedSprite(spritePath);
    }
  };
  
  const filteredCharacters = getFilteredSprites();
  const getAssetPath = (relativePath: string) => {
    if (!relativePath || !currentProject?.projectFolderPath) return '';
    return path.join(currentProject.projectFolderPath, relativePath);
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
          value={category}
          onValueChange={(value) => setCategory(value as SpriteCategory)}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-blue-900/50 w-full md:w-auto">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-blue-700"
            >
              All Sprites
            </TabsTrigger>
            <TabsTrigger
              value="idle"
              className="data-[state=active]:bg-blue-700"
            >
              Idle Animations
            </TabsTrigger>
            <TabsTrigger
              value="talking"
              className="data-[state=active]:bg-blue-700"
            >
              Talking Animations
            </TabsTrigger>
            <TabsTrigger
              value="special"
              className="data-[state=active]:bg-blue-700"
            >
              Special Animations
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search sprites or characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-blue-900/20 border-blue-700 text-white w-full"
          />
        </div>
      </div>

      {filteredCharacters.length > 0 ? (
        <div className="space-y-6">
          {filteredCharacters.map((character) => {
            // Get sprites based on current category filter
            let spritesToShow: SpriteInfo[] = [];
            if (category === 'all') {
              spritesToShow = [
                ...character.sprites.idle,
                ...character.sprites.talking,
                ...character.sprites.special,
              ];
            } else {
              spritesToShow = character.sprites[category];
            }

            if (spritesToShow.length === 0) return null;

            return (
              <div key={character.id} className="space-y-3">
                <h3 className="text-lg font-ace text-blue-200 flex items-center">
                  {character.name.toUpperCase()}
                  <span className="ml-2 bg-blue-900/50 text-xs px-2 py-0.5 rounded text-blue-300">
                    {spritesToShow.length}
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {spritesToShow.map((sprite) => (
                    <Card
                      key={sprite.path}
                      className={`bg-blue-950 border-blue-800 overflow-hidden ${
                        previewedSprite === sprite.path
                          ? 'ring-2 ring-yellow-500'
                          : ''
                      }`}
                    >
                      <div className="relative aspect-square bg-blue-900/30 flex items-center justify-center overflow-hidden">
                        <img
                          src={getAssetPath(sprite.path)}
                          alt={sprite.name}
                          className="max-w-full max-h-full object-contain"
                        />

                        {/* Category badge */}
                        <div className="absolute top-2 right-2 bg-blue-900/80 text-xs px-2 py-1 rounded text-blue-200">
                          {sprite.spriteType || 'sprite'}
                        </div>

                        {/* Preview button */}
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute bottom-2 right-2 h-8 w-8 bg-blue-950/90 border-blue-800 text-blue-300 hover:bg-blue-900 hover:text-white"
                          onClick={() => togglePreview(sprite.path)}
                        >
                          {previewedSprite === sprite.path ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <div className="p-3">
                        <div className="flex justify-between items-start">
                          <h4 className="text-white font-medium truncate">
                            {sprite.name}
                          </h4>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-blue-400 hover:text-blue-300"
                              onClick={() =>
                                openEditModal(sprite, character.id)
                              }
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-400 hover:text-red-300"
                              onClick={() => deleteSprite(sprite.path)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        <div className="text-xs text-blue-400 mt-1 truncate">
                          {path.basename(sprite.path)}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-blue-900/20 rounded-lg border border-blue-800/50">
          <p className="text-blue-300 mb-2">No sprites found</p>
          <p className="text-blue-400 text-sm mb-4">
            {searchTerm
              ? 'Try a different search term'
              : 'Import sprite images using the Import Assets button above'}
          </p>
        </div>
      )}

      {/* Full-size sprite preview overlay */}
      {previewedSprite && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-blue-950/90 flex items-center justify-center p-4"
          onClick={() => setPreviewedSprite(null)}
        >
          <div
            className="relative bg-blue-900/30 p-1 rounded-lg border-2 border-blue-700 max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-3 right-3 z-10 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-blue-950/90 border-blue-800 text-red-400 hover:bg-red-900/30 hover:text-red-300"
                onClick={() => setPreviewedSprite(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="max-h-[calc(80vh-2rem)] overflow-auto flex items-center justify-center p-4">
              <img
                src={getAssetPath(previewedSprite)}
                alt="Sprite preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Edit Sprite Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => !open && setIsEditModalOpen(false)}
      >
        <DialogContent className="bg-blue-950 border-2 border-blue-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-ace text-yellow-400">
              EDIT SPRITE
            </DialogTitle>
          </DialogHeader>

          {editingSprite && (
            <div className="space-y-4 pt-2">
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 bg-blue-900/30 rounded-md flex items-center justify-center overflow-hidden">
                  <img
                    src={getAssetPath(editingSprite.path)}
                    alt={editingSprite.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              <div>
                <label className="text-blue-200 mb-2 block text-sm">
                  Sprite Name
                </label>
                <Input
                  value={editingSprite.name}
                  onChange={(e) =>
                    setEditingSprite({ ...editingSprite, name: e.target.value })
                  }
                  className="bg-blue-900/30 border-blue-700 text-white"
                />
              </div>

              <div>
                <label className="text-blue-200 mb-2 block text-sm">
                  Sprite Type
                </label>
                <select
                  value={
                    editingSprite.metadata?.spriteType || 'idle'
                  }
                  onChange={(e) => {
                    setEditingSprite({
                      ...editingSprite,
                      metadata: {
                        ...(editingSprite.metadata || {}),
                        spriteType: e.target.value,
                      },
                      spriteType: e.target.value
                    });
                  }}
                  className="w-full bg-blue-900/30 border border-blue-700 rounded-md p-2 text-white"
                >
                  <option value="idle">Idle Animation</option>
                  <option value="talking">Talking Animation</option>
                  <option value="special">Special Animation</option>
                </select>
              </div>

              <div>
                <label className="text-blue-200 mb-2 block text-sm">
                  Assign to Character
                </label>
                <select
                  value={editingCharacter}
                  onChange={(e) => setEditingCharacter(e.target.value)}
                  className="w-full bg-blue-900/30 border border-blue-700 rounded-md p-2 text-white"
                >
                  <option value="unassigned">-- Unassigned --</option>
                  {currentProject?.characters.map((char) => (
                    <option key={char.id} value={char.id}>
                      {char.name}
                    </option>
                  ))}
                </select>
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
                  onClick={saveEditedSprite}
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