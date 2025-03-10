import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Music as MusicIcon,
  Play,
  Pause,
  Volume2,
  SkipForward,
  SkipBack,
  VolumeX,
  Trash2,
  Edit,
  Search,
} from 'lucide-react';
import {
  useProjectStore,
  Music,
} from '@/application/state/project/projectStore';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Card } from '@/presentation/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/presentation/components/ui/dialog';
import { Howl } from 'howler';
import { Slider } from '@/presentation/components/ui/slider';

export function MusicManager() {
  const { currentProject, updateProject } = useProjectStore();
  const [activeTab, setActiveTab] = useState('bgm');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMusic, setEditingMusic] = useState<Music | null>(null);
  const [volume, setVolume] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<Howl | null>(null);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<number | null>(null);

  // Filter music by type and search term
  const filteredMusic =
    currentProject?.music.filter((music) => {
      const matchesType = music.type === activeTab;
      const matchesSearch = music.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    }) || [];

  // Group music by categories (for better organization)
  const musicByCategory = filteredMusic.reduce(
    (acc, music) => {
      const category = music.metadata?.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(music);
      return acc;
    },
    {} as Record<string, Music[]>
  );

  // Categories in preferred order
  const orderedCategories = [
    'Music',
    'Court',
    'Investigation',
    'Characters',
    'Ambience',
    'UI',
    'Uncategorized',
  ];
  const sortedCategories = Object.keys(musicByCategory).sort((a, b) => {
    const indexA = orderedCategories.indexOf(a);
    const indexB = orderedCategories.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  // Play audio
  const playAudio = (musicAsset: Music) => {
    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.stop();
      clearProgressTimer();
      audioRef.current = null;
    }

    const fullPath = musicAsset.path;

    audioRef.current = new Howl({
      src: [fullPath],
      html5: true,
      volume: volume,
      loop: activeTab === 'bgm',
      onload: () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration());
        }
      },
      onplay: () => {
        startProgressTimer();
        setCurrentlyPlaying(musicAsset.id);
      },
      onend: () => {
        if (!musicAsset.loop) {
          clearProgressTimer();
          setCurrentlyPlaying(null);
          setProgress(0);
        }
      },
      onstop: () => {
        clearProgressTimer();
        setProgress(0);
      },
      onloaderror: () => {
        console.error('Audio load error');
        setCurrentlyPlaying(null);
      },
      onplayerror: () => {
        console.error('Audio play error');
        setCurrentlyPlaying(null);
      },
    });

    audioRef.current.play();
  };

  // Stop audio
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.stop();
      audioRef.current = null;
      clearProgressTimer();
      setCurrentlyPlaying(null);
    }
  };

  // Pause/resume audio
  const togglePause = () => {
    if (audioRef.current) {
      if (audioRef.current.playing()) {
        audioRef.current.pause();
        clearProgressTimer();
      } else {
        audioRef.current.play();
        startProgressTimer();
      }
    }
  };

  // Update volume
  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume(newVolume);
    }
  };

  // Progress tracker
  const startProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }

    progressTimerRef.current = setInterval(() => {
      if (audioRef.current && audioRef.current.playing()) {
        setProgress(audioRef.current.seek());
      }
    }, 100) as unknown as number;
  };

  const clearProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  // Format time in mm:ss
  const formatTime = (seconds: number) => {
    seconds = Math.round(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Seek to position
  const seekTo = (position: number) => {
    if (audioRef.current) {
      audioRef.current.seek(position);
      setProgress(position);
    }
  };

  // Delete music asset
  const deleteMusic = (musicId: string) => {
    if (window.confirm('Are you sure you want to delete this audio file?')) {
      // Stop if it's currently playing
      if (currentlyPlaying === musicId) {
        stopAudio();
      }

      updateProject((draft) => {
        const index = draft.music.findIndex((m) => m.id === musicId);
        if (index !== -1) {
          draft.music.splice(index, 1);
        }
      });
    }
  };

  // Edit music metadata
  const openEditModal = (music: Music) => {
    setEditingMusic({ ...music });
    setIsEditModalOpen(true);
  };

  const saveEditedMusic = () => {
    if (!editingMusic) return;

    updateProject((draft) => {
      const index = draft.music.findIndex((m) => m.id === editingMusic.id);
      if (index !== -1) {
        draft.music[index] = { ...editingMusic };
      }
    });

    setIsEditModalOpen(false);
    setEditingMusic(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.stop();
      }
      clearProgressTimer();
    };
  }, []);

  // Reset current playing when tab changes
  useEffect(() => {
    stopAudio();
    setCurrentlyPlaying(null);
  }, [activeTab]);

  useEffect(() => {
    if (currentProject) {
      setIsLoading(false);
    }
  }, [currentProject]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter and controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-blue-900/30 p-4 rounded-lg">
        <Tabs
          defaultValue="bgm"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-blue-900/50 w-full md:w-auto">
            <TabsTrigger
              value="bgm"
              className="data-[state=active]:bg-blue-700 flex-1 md:flex-initial"
            >
              <MusicIcon className="w-4 h-4 mr-2" />
              Background Music
              <span className="ml-2 bg-blue-800 text-xs px-1.5 py-0.5 rounded-md">
                {currentProject?.music.filter((m) => m.type === 'bgm').length ||
                  0}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="sfx"
              className="data-[state=active]:bg-blue-700 flex-1 md:flex-initial"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Sound Effects
              <span className="ml-2 bg-blue-800 text-xs px-1.5 py-0.5 rounded-md">
                {currentProject?.music.filter((m) => m.type === 'sfx').length ||
                  0}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              className="data-[state=active]:bg-blue-700 flex-1 md:flex-initial"
            >
              <VolumeX className="w-4 h-4 mr-2" />
              Voice Clips
              <span className="ml-2 bg-blue-800 text-xs px-1.5 py-0.5 rounded-md">
                {currentProject?.music.filter((m) => m.type === 'voice')
                  .length || 0}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search audio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-blue-900/20 border-blue-700 text-white w-full"
          />
        </div>
      </div>

      {/* Audio player */}
      {currentlyPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-900 to-blue-950 rounded-lg p-4 border border-blue-800 shadow-lg"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
                {activeTab === 'bgm' ? (
                  <MusicIcon className="w-5 h-5 text-blue-200" />
                ) : activeTab === 'sfx' ? (
                  <Volume2 className="w-5 h-5 text-blue-200" />
                ) : (
                  <VolumeX className="w-5 h-5 text-blue-200" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-white font-medium truncate">
                  {currentProject?.music.find((m) => m.id === currentlyPlaying)
                    ?.name || 'Unknown'}
                </h3>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-blue-300">
                    {formatTime(progress)}
                  </span>
                  <div className="flex-1 h-1 bg-blue-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500"
                      style={{
                        width: `${(progress / (duration || 1)) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-blue-300">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-blue-200 hover:text-blue-100 hover:bg-blue-800/50"
                onClick={() => {
                  if (audioRef.current) {
                    const newPos = Math.max(0, progress - 5);
                    seekTo(newPos);
                  }
                }}
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-blue-800 border-blue-700 text-white hover:bg-blue-700 hover:text-white"
                onClick={togglePause}
              >
                {audioRef.current && audioRef.current.playing() ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-blue-200 hover:text-blue-100 hover:bg-blue-800/50"
                onClick={() => {
                  if (audioRef.current) {
                    const newPos = Math.min(duration, progress + 5);
                    seekTo(newPos);
                  }
                }}
              >
                <SkipForward className="h-5 w-5" />
              </Button>

              <div className="w-24 flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-blue-300" />
                <Slider
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(values: number[]) => updateVolume(values[0])}
                  className="flex-1"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                onClick={stopAudio}
              >
                <VolumeX className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Music list by category */}
      {sortedCategories.length > 0 ? (
        <div className="space-y-6">
          {sortedCategories.map((category) => (
            <div key={category}>
              <h3 className="text-lg font-ace text-blue-200 mb-3 flex items-center">
                {category.toUpperCase()}
                <span className="ml-2 bg-blue-900/50 text-xs px-2 py-0.5 rounded text-blue-300">
                  {musicByCategory[category].length}
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {musicByCategory[category].map((music) => (
                  <Card
                    key={music.id}
                    className="bg-blue-950 border-blue-800 overflow-hidden flex flex-col"
                  >
                    <div className="p-3 flex justify-between items-start">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                          className={`
                          w-10 h-10 rounded-lg flex items-center justify-center
                          ${
                            currentlyPlaying === music.id
                              ? 'bg-yellow-600 text-white animate-pulse'
                              : 'bg-blue-900 text-blue-400'
                          }
                        `}
                        >
                          {activeTab === 'bgm' ? (
                            <MusicIcon className="w-5 h-5" />
                          ) : activeTab === 'sfx' ? (
                            <Volume2 className="w-5 h-5" />
                          ) : (
                            <VolumeX className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">
                            {music.name}
                          </h4>
                          <div className="text-xs text-blue-400 truncate">
                            {music.path.split('/').pop() || music.path}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-400 hover:text-blue-300"
                          onClick={() => openEditModal(music)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-300"
                          onClick={() => deleteMusic(music.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-auto p-3 pt-0 flex justify-between items-center">
                      <div className="text-xs text-blue-400">
                        {music.loop ? 'Looping' : 'No loop'} •{' '}
                        {music.metadata?.duration
                          ? formatTime(music.metadata.duration as number)
                          : '--:--'}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className={`flex items-center gap-1 ${
                          currentlyPlaying === music.id
                            ? 'bg-yellow-600 hover:bg-yellow-500 text-white border-yellow-700'
                            : 'bg-blue-800 border-blue-700 text-white hover:bg-blue-700'
                        }`}
                        onClick={() => {
                          if (currentlyPlaying === music.id) {
                            stopAudio();
                          } else {
                            playAudio(music);
                          }
                        }}
                      >
                        {currentlyPlaying === music.id ? (
                          <>
                            <VolumeX className="h-3.5 w-3.5" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5" />
                            Play
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-blue-900/20 rounded-lg border border-blue-800/50">
          <p className="text-blue-300 mb-2">
            No{' '}
            {activeTab === 'bgm'
              ? 'background music'
              : activeTab === 'sfx'
                ? 'sound effects'
                : 'voice clips'}{' '}
            found
          </p>
          <p className="text-blue-400 text-sm mb-4">
            Import audio files using the Import Assets button above
          </p>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-blue-950 border-2 border-blue-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-ace text-yellow-400">
              EDIT AUDIO
            </DialogTitle>
            <DialogDescription className="text-blue-300">
              Update metadata for this audio file
            </DialogDescription>
          </DialogHeader>

          {editingMusic && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-blue-200 mb-2 block text-sm">Name</label>
                <Input
                  value={editingMusic.name}
                  onChange={(e) =>
                    setEditingMusic({ ...editingMusic, name: e.target.value })
                  }
                  className="bg-blue-900/30 border-blue-700 text-white"
                />
              </div>

              <div>
                <label className="text-blue-200 mb-2 block text-sm">
                  Category
                </label>
                <select
                  value={editingMusic.metadata?.category || 'Uncategorized'}
                  onChange={(e) =>
                    setEditingMusic({
                      ...editingMusic,
                      metadata: {
                        ...(editingMusic.metadata || {}),
                        category: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-blue-900/30 border border-blue-700 rounded-md p-2 text-white"
                >
                  <option value="Music">Music</option>
                  <option value="Court">Court</option>
                  <option value="Investigation">Investigation</option>
                  <option value="Characters">Characters</option>
                  <option value="Ambience">Ambience</option>
                  <option value="UI">UI</option>
                  <option value="Uncategorized">Uncategorized</option>
                </select>
              </div>

              <div>
                <label className="text-blue-200 mb-2 block text-sm">
                  Loop Audio
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMusic.loop}
                    onChange={(e) =>
                      setEditingMusic({
                        ...editingMusic,
                        loop: e.target.checked,
                      })
                    }
                    className="form-checkbox bg-blue-900 border-blue-700 text-yellow-500 rounded"
                  />
                  <span className="text-sm text-blue-200">
                    Loop this audio when playing (recommended for background
                    music)
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  className="border-blue-700 text-blue-200 hover:bg-blue-900 hover:text-white"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-yellow-600 text-white hover:bg-yellow-500"
                  onClick={saveEditedMusic}
                >
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
