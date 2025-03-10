import React, { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import {
  FolderPlus,
  Plus,
  Edit,
  Trash2,
  VolumeX,
  PlaySquare,
  StopCircle,
  Save,
} from 'lucide-react';
import {
  useProjectStore,
  Asset,
  Music,
} from '@/application/state/project/projectStore';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Card } from '@/presentation/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import { Howl } from 'howler';

interface BubbleSet {
  id: string;
  name: string;
  bubbles: BubbleItem[];
}

interface BubbleItem {
  id: string;
  name: string;
  type: 'objection' | 'hold_it' | 'take_that' | 'custom';
  animationAssetId: string;
  soundAssetId: string;
}

export function BubbleSetManager() {
  const { currentProject, updateProject } = useProjectStore();
  const [isNewSetModalOpen, setIsNewSetModalOpen] = useState(false);
  const [isEditBubbleModalOpen, setIsEditBubbleModalOpen] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [bubbleSets, setBubbleSets] = useState<BubbleSet[]>([]);
  const [editingBubble, setEditingBubble] = useState<BubbleItem | null>(null);
  const [activeSetId, setActiveSetId] = useState<string | null>(null);
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);
  const audioRef = useRef<Howl | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Extract bubble data from project assets
  useEffect(() => {
    if (currentProject) {
      // Find all bubble sets by category
      const bubbleAssets = currentProject.assets.filter(
        (asset) =>
          asset.category === 'bubble' ||
          asset.category === 'objection' ||
          asset.category === 'hold_it' ||
          asset.category === 'take_that' ||
          asset.category === 'custom'
      );

      // Extract bubble sets from metadata
      const extractedSets: BubbleSet[] = [];
      const bubbleSetsMap = new Map<string, BubbleSet>();

      // First pass: create sets
      bubbleAssets.forEach((asset) => {
        if (asset.metadata?.bubbleSetId) {
          const setId = asset.metadata.bubbleSetId as string;
          if (!bubbleSetsMap.has(setId)) {
            bubbleSetsMap.set(setId, {
              id: setId,
              name: (asset.metadata?.bubbleSetName as string) || 'Unknown Set',
              bubbles: [],
            });
          }
        }
      });

      // Second pass: populate bubbles in sets
      bubbleAssets.forEach((asset) => {
        if (asset.metadata?.bubbleSetId && asset.metadata?.bubbleId) {
          const setId = asset.metadata.bubbleSetId as string;
          const set = bubbleSetsMap.get(setId);

          if (set) {
            // Check if this bubble already exists
            const existingBubble = set.bubbles.find(
              (b) => b.id === asset.metadata?.bubbleId
            );

            if (!existingBubble) {
              const bubble: BubbleItem = {
                id: asset.metadata.bubbleId as string,
                name: (asset.metadata.bubbleName as string) || asset.name,
                type:
                  (asset.metadata.bubbleType as
                    | 'objection'
                    | 'hold_it'
                    | 'take_that'
                    | 'custom') || 'custom',
                animationAssetId: asset.id,
                soundAssetId: (asset.metadata?.soundAssetId as string) || '',
              };
              set.bubbles.push(bubble);
            } else if (asset.metadata?.isSound) {
              // This is a sound asset for an existing bubble
              existingBubble.soundAssetId = asset.id;
            }
          }
        }
      });

      // If we didn't find any sets, create a default one
      if (bubbleSetsMap.size === 0) {
        const defaultSetId = nanoid();
        bubbleSetsMap.set(defaultSetId, {
          id: defaultSetId,
          name: 'Default Bubble Set',
          bubbles: [],
        });
      }

      // Convert map to array
      bubbleSetsMap.forEach((set) => extractedSets.push(set));

      // Update state with extracted data
      setBubbleSets(extractedSets);
      setActiveSetId(extractedSets[0]?.id || null);
      setIsLoading(false);
    }
  }, [currentProject]);

  // Handle audio playback
  const playAudio = (assetId: string) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.stop();
      audioRef.current = null;
    }

    const musicAsset = currentProject?.music.find((m) => m.id === assetId);
    if (musicAsset) {
      const fullPath = musicAsset.path;

      audioRef.current = new Howl({
        src: [fullPath],
        html5: true,
        onend: () => {
          setAudioPlaying(null);
        },
        onloaderror: (id, error) => {
          console.error('Audio load error:', error);
          setAudioPlaying(null);
        },
        onplayerror: (id, error) => {
          console.error('Audio play error:', error);
          setAudioPlaying(null);
        },
      });

      audioRef.current.play();
      setAudioPlaying(assetId);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.stop();
      audioRef.current = null;
      setAudioPlaying(null);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.stop();
        audioRef.current = null;
      }
    };
  }, []);

  // Create a new bubble set
  const createBubbleSet = () => {
    if (!newSetName.trim()) return;

    const newSetId = nanoid();
    const newSet: BubbleSet = {
      id: newSetId,
      name: newSetName,
      bubbles: [],
    };

    setBubbleSets([...bubbleSets, newSet]);
    setActiveSetId(newSetId);
    setNewSetName('');
    setIsNewSetModalOpen(false);
  };

  // Delete a bubble set
  const deleteBubbleSet = (setId: string) => {
    // Confirm deletion
    if (
      window.confirm(
        'Are you sure you want to delete this bubble set? This will not delete the associated assets.'
      )
    ) {
      const updatedSets = bubbleSets.filter((set) => set.id !== setId);
      setBubbleSets(updatedSets);

      // Update active set if needed
      if (activeSetId === setId) {
        setActiveSetId(updatedSets[0]?.id || null);
      }
    }
  };

  // Create a new bubble in the active set
  const createBubble = () => {
    // Open edit bubble modal with a new bubble
    const newBubble: BubbleItem = {
      id: nanoid(),
      name: 'New Bubble',
      type: 'custom',
      animationAssetId: '',
      soundAssetId: '',
    };

    setEditingBubble(newBubble);
    setIsEditBubbleModalOpen(true);
  };

  // Save edited bubble
  const saveBubble = () => {
    if (!editingBubble || !activeSetId) return;

    const updatedSets = [...bubbleSets];
    const setIndex = updatedSets.findIndex((set) => set.id === activeSetId);

    if (setIndex >= 0) {
      // Check if this is a new bubble or an existing one
      const bubbleIndex = updatedSets[setIndex].bubbles.findIndex(
        (b) => b.id === editingBubble.id
      );

      if (bubbleIndex >= 0) {
        // Update existing bubble
        updatedSets[setIndex].bubbles[bubbleIndex] = { ...editingBubble };
      } else {
        // Add new bubble
        updatedSets[setIndex].bubbles.push({ ...editingBubble });
      }

      setBubbleSets(updatedSets);

      // Update metadata on assets
      updateProject((draft) => {
        // Update animation asset metadata
        const animAssetIndex = draft.assets.findIndex(
          (a) => a.id === editingBubble.animationAssetId
        );
        if (animAssetIndex >= 0) {
          if (!draft.assets[animAssetIndex].metadata) {
            draft.assets[animAssetIndex].metadata = {};
          }

          draft.assets[animAssetIndex].metadata.bubbleId = editingBubble.id;
          draft.assets[animAssetIndex].metadata.bubbleName = editingBubble.name;
          draft.assets[animAssetIndex].metadata.bubbleType = editingBubble.type;
          draft.assets[animAssetIndex].metadata.bubbleSetId = activeSetId;
          draft.assets[animAssetIndex].metadata.bubbleSetName =
            updatedSets[setIndex].name;
          draft.assets[animAssetIndex].metadata.soundAssetId =
            editingBubble.soundAssetId;
        }

        // Update sound asset metadata if it exists
        if (editingBubble.soundAssetId) {
          const soundAssetIndex = draft.music.findIndex(
            (m) => m.id === editingBubble.soundAssetId
          );
          if (soundAssetIndex >= 0) {
            if (!draft.music[soundAssetIndex].metadata) {
              draft.music[soundAssetIndex].metadata = {};
            }

            draft.music[soundAssetIndex].metadata.isSound = true;
            draft.music[soundAssetIndex].metadata.bubbleId = editingBubble.id;
            draft.music[soundAssetIndex].metadata.bubbleSetId = activeSetId;
          }
        }
      });
    }

    setEditingBubble(null);
    setIsEditBubbleModalOpen(false);
  };

  // Delete a bubble
  const deleteBubble = (bubbleId: string) => {
    if (!activeSetId) return;

    // Confirm deletion
    if (
      window.confirm(
        'Are you sure you want to delete this bubble? This will not delete the associated assets.'
      )
    ) {
      const updatedSets = [...bubbleSets];
      const setIndex = updatedSets.findIndex((set) => set.id === activeSetId);

      if (setIndex >= 0) {
        updatedSets[setIndex].bubbles = updatedSets[setIndex].bubbles.filter(
          (b) => b.id !== bubbleId
        );
        setBubbleSets(updatedSets);
      }
    }
  };

  // Get asset info for preview display
  const getAssetInfo = (assetId: string, isSound = false) => {
    if (!assetId) return null;

    if (isSound) {
      return currentProject?.music.find((m) => m.id === assetId);
    } else {
      return currentProject?.assets.find((a) => a.id === assetId);
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
      {/* Set selector and controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-blue-900/30 p-4 rounded-lg">
        <div className="flex-1">
          <h2 className="text-xl font-ace text-white mb-2">BUBBLE SETS</h2>
          <p className="text-blue-200 text-sm">
            Organize objection bubbles and sounds into reusable sets
          </p>
        </div>

        <Button
          variant="outline"
          className="bg-blue-800 border-blue-700 text-white hover:bg-blue-700 flex items-center gap-2"
          onClick={() => setIsNewSetModalOpen(true)}
        >
          <FolderPlus className="h-4 w-4" />
          New Bubble Set
        </Button>
      </div>

      {/* Set tabs and bubble content */}
      {bubbleSets.length > 0 ? (
        <Tabs
          value={activeSetId || bubbleSets[0]?.id}
          onValueChange={setActiveSetId}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <TabsList className="bg-blue-900/30">
              {bubbleSets.map((set) => (
                <TabsTrigger
                  key={set.id}
                  value={set.id}
                  className="data-[state=active]:bg-blue-700"
                >
                  {set.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {activeSetId && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                onClick={() => deleteBubbleSet(activeSetId)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Set
              </Button>
            )}
          </div>

          {bubbleSets.map((set) => (
            <TabsContent key={set.id} value={set.id} className="space-y-4 mt-4">
              {/* Bubbles grid */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-ace text-blue-200">
                  {set.name} BUBBLES ({set.bubbles.length})
                </h3>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-800 border-blue-700 text-white hover:bg-blue-700 flex items-center gap-1"
                  onClick={createBubble}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Bubble
                </Button>
              </div>

              {set.bubbles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {set.bubbles.map((bubble) => {
                    const animAsset = getAssetInfo(bubble.animationAssetId) as
                      | Asset
                      | undefined;
                    const soundAsset = getAssetInfo(
                      bubble.soundAssetId,
                      true
                    ) as Music | undefined;

                    return (
                      <Card
                        key={bubble.id}
                        className="bg-blue-950 border-blue-800 overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-ace text-yellow-400 truncate">
                              {bubble.name}
                            </h4>
                            <span className="bg-blue-900 text-xs px-2 py-1 rounded text-blue-200 uppercase">
                              {bubble.type.replace('_', ' ')}
                            </span>
                          </div>

                          {/* Preview area */}
                          <div className="aspect-video bg-blue-900/30 rounded-md flex items-center justify-center mb-3 overflow-hidden">
                            {animAsset ? (
                              <img
                                src={animAsset.path}
                                alt={bubble.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="text-blue-500 text-sm">
                                No animation
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="text-sm text-blue-300">
                              {soundAsset ? (
                                <div className="flex items-center gap-2">
                                  <span className="truncate max-w-[120px]">
                                    {soundAsset.name}
                                  </span>
                                  {audioPlaying === soundAsset.id ? (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-red-400 hover:text-red-300"
                                      onClick={stopAudio}
                                    >
                                      <StopCircle className="h-4 w-4" />
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-blue-400 hover:text-blue-300"
                                      onClick={() => playAudio(soundAsset.id)}
                                    >
                                      <PlaySquare className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <span className="flex items-center gap-1 text-blue-500">
                                  <VolumeX className="h-4 w-4" />
                                  No sound
                                </span>
                              )}
                            </div>

                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-400 hover:text-blue-300"
                                onClick={() => {
                                  setEditingBubble(bubble);
                                  setIsEditBubbleModalOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-400 hover:text-red-300"
                                onClick={() => deleteBubble(bubble.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-blue-900/20 rounded-lg border border-blue-800/50">
                  <p className="text-blue-300 mb-3">No bubbles in this set</p>
                  <Button
                    variant="outline"
                    className="bg-blue-800 border-blue-700 text-white hover:bg-blue-700"
                    onClick={createBubble}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Bubble
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-16 bg-blue-900/20 rounded-lg border border-blue-800/50">
          <p className="text-blue-300 mb-3">No bubble sets defined</p>
          <Button
            variant="outline"
            className="bg-blue-800 border-blue-700 text-white hover:bg-blue-700"
            onClick={() => setIsNewSetModalOpen(true)}
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Create Your First Bubble Set
          </Button>
        </div>
      )}

      {/* New Set Modal */}
      <Dialog open={isNewSetModalOpen} onOpenChange={setIsNewSetModalOpen}>
        <DialogContent className="bg-blue-950 border-2 border-blue-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-ace text-yellow-400">
              CREATE NEW BUBBLE SET
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-blue-200 mb-2 block text-sm">
                Bubble Set Name
              </label>
              <Input
                value={newSetName}
                onChange={(e) => setNewSetName(e.target.value)}
                placeholder="e.g., Phoenix Wright Set"
                className="bg-blue-900/30 border-blue-700 text-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                className="text-blue-300 hover:text-blue-100"
                onClick={() => setIsNewSetModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-yellow-600 text-white hover:bg-yellow-500 flex items-center gap-1"
                onClick={createBubbleSet}
                disabled={!newSetName.trim()}
              >
                <Save className="h-4 w-4" />
                Create Set
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Bubble Modal */}
      <Dialog
        open={isEditBubbleModalOpen}
        onOpenChange={(open) => !open && setIsEditBubbleModalOpen(false)}
      >
        <DialogContent className="bg-blue-950 border-2 border-blue-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-ace text-yellow-400">
              {editingBubble?.id ? 'EDIT BUBBLE' : 'CREATE NEW BUBBLE'}
            </DialogTitle>
          </DialogHeader>

          {editingBubble && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-blue-200 mb-2 block text-sm">
                  Bubble Name
                </label>
                <Input
                  value={editingBubble.name}
                  onChange={(e) =>
                    setEditingBubble({ ...editingBubble, name: e.target.value })
                  }
                  placeholder="e.g., Objection!"
                  className="bg-blue-900/30 border-blue-700 text-white"
                />
              </div>

              <div>
                <label className="text-blue-200 mb-2 block text-sm">
                  Bubble Type
                </label>
                <select
                  value={editingBubble.type}
                  onChange={(e) =>
                    setEditingBubble({
                      ...editingBubble,
                      type: e.target.value as
                        | 'objection'
                        | 'hold_it'
                        | 'take_that'
                        | 'custom',
                    })
                  }
                  className="w-full bg-blue-900/30 border border-blue-700 rounded-md p-2 text-white"
                >
                  <option value="objection">Objection</option>
                  <option value="hold_it">Hold It</option>
                  <option value="take_that">Take That</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-blue-200 mb-2 block text-sm">
                    Animation Asset
                  </label>
                  <select
                    value={editingBubble.animationAssetId}
                    onChange={(e) =>
                      setEditingBubble({
                        ...editingBubble,
                        animationAssetId: e.target.value,
                      })
                    }
                    className="w-full bg-blue-900/30 border border-blue-700 rounded-md p-2 text-white"
                  >
                    <option value="">-- Select Animation --</option>
                    {currentProject?.assets
                      .filter(
                        (a) =>
                          a.type === 'gif' ||
                          a.type === 'png' ||
                          a.type === 'webp'
                      )
                      .map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-blue-200 mb-2 block text-sm">
                    Sound Asset
                  </label>
                  <select
                    value={editingBubble.soundAssetId}
                    onChange={(e) =>
                      setEditingBubble({
                        ...editingBubble,
                        soundAssetId: e.target.value,
                      })
                    }
                    className="w-full bg-blue-900/30 border border-blue-700 rounded-md p-2 text-white"
                  >
                    <option value="">-- Select Sound --</option>
                    {currentProject?.music
                      .filter((m) => m.type === 'sfx')
                      .map((sound) => (
                        <option key={sound.id} value={sound.id}>
                          {sound.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Preview area */}
              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800">
                <h4 className="text-blue-200 text-sm mb-2">Preview</h4>
                <div className="flex flex-wrap gap-4">
                  {editingBubble.animationAssetId && (
                    <div className="w-40 h-40 bg-blue-900/30 rounded-md flex items-center justify-center overflow-hidden">
                      <img
                        src={
                          getAssetInfo(editingBubble.animationAssetId)?.path ||
                          ''
                        }
                        alt={editingBubble.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}

                  {editingBubble.soundAssetId && (
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        className="bg-blue-800 border-blue-700 text-white hover:bg-blue-700 flex items-center gap-2"
                        onClick={() => {
                          if (audioPlaying === editingBubble.soundAssetId) {
                            stopAudio();
                          } else {
                            playAudio(editingBubble.soundAssetId);
                          }
                        }}
                      >
                        {audioPlaying === editingBubble.soundAssetId ? (
                          <>
                            <StopCircle className="h-4 w-4" />
                            Stop Sound
                          </>
                        ) : (
                          <>
                            <PlaySquare className="h-4 w-4" />
                            Play Sound
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  className="text-blue-300 hover:text-blue-100"
                  onClick={() => {
                    setEditingBubble(null);
                    setIsEditBubbleModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-yellow-600 text-white hover:bg-yellow-500 flex items-center gap-1"
                  onClick={saveBubble}
                  disabled={
                    !editingBubble.name.trim() ||
                    !editingBubble.animationAssetId
                  }
                >
                  <Save className="h-4 w-4" />
                  Save Bubble
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
