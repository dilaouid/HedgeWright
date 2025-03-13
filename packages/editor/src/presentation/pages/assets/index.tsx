import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Image as ImageIcon,
  Music,
  User,
  FileBadge,
  Sparkles,
  Upload,
  Plus,
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import { useProjectStore } from '@/application/state/project/projectStore';
import { Button } from '@/presentation/components/ui/button';

import { MusicManager } from './components/MusicManager';
import { SpriteManager } from './components/SpriteManager';
import { BubbleSetManager } from './components/BubbleSetManager';
import { BackgroundManager } from './components/BackgroundManager';
import { EvidenceProfileManager } from './components/EvidenceProfileManager';
import { SpecialAnimationManager } from './components/SpecialAnimationManager';
import { ImportAssetModal } from './components/ImportAssetModal';
import { useAssetManager } from '@/application/hooks/assets/useAssetManager';

export function AssetsPage() {
  const { currentProject } = useProjectStore();
  const { getAssetCounts, loadAssets } = useAssetManager();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('bubbles');
  const [counts, setCounts] = useState({
    bubbles: 0,
    audio: 0,
    sprites: 0,
    backgrounds: 0,
    evidence: 0,
    profiles: 0,
    specialAnimations: 0,
  });

  // Force asset reload when component mounts
  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  // Update counts from asset manager
  useEffect(() => {
    const assetCounts = getAssetCounts();
    setCounts({
      bubbles: assetCounts.bubbles || 0,
      audio: assetCounts.audio || 0,
      sprites: assetCounts.characters || 0,
      backgrounds: assetCounts.backgrounds || 0,
      evidence: assetCounts.evidence || 0,
      profiles: assetCounts.profiles || 0,
      specialAnimations: assetCounts.specialAnimations || 0,
    });
  }, [getAssetCounts, currentProject]);

  if (!currentProject) {
    return <div className="p-8 text-center text-white">No project loaded</div>;
  }

  const handleImportClick = (category: string) => {
    setActiveCategory(category);
    setIsImportModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6 editor-content-container scrollbar-ace">
      <div className="container-ace space-y-6 pb-12">
        {/* Ace Attorney style header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 rounded-xl shadow-xl border-2 border-blue-700/70"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[url('/assets/images/ui/nds-pattern.png')] opacity-5" />

          <div className="relative z-10 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-ace text-white tracking-wide shadow-text">
                  ASSET MANAGEMENT
                </h1>
                <p className="text-blue-200 mt-1">
                  Manage all game assets, sprites, music, and evidence
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsImportModalOpen(true)}
                className="btn-ace-primary flex items-center justify-center gap-2 px-6"
              >
                <Upload className="h-4 w-4" />
                IMPORT ASSETS
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main assets management area */}
        <div className="bg-blue-950/70 rounded-xl border-2 border-blue-800/50 p-4 shadow-lg">
          <Tabs
            defaultValue="bubbles"
            className="w-full"
            onValueChange={setActiveCategory}
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-blue-900/50 p-1">
                <TabsTrigger
                  value="bubbles"
                  className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <span>Bubbles</span>
                  <span className="ml-2 bg-blue-800 text-xs px-1.5 py-0.5 rounded-md">
                    {counts.bubbles}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="music"
                  className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  <Music className="w-4 h-4 mr-2" />
                  <span>Music & SFX</span>
                  <span className="ml-2 bg-blue-800 text-xs px-1.5 py-0.5 rounded-md">
                    {counts.audio}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="sprites"
                  className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span>Sprites</span>
                  <span className="ml-2 bg-blue-800 text-xs px-1.5 py-0.5 rounded-md">
                    {counts.sprites}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="backgrounds"
                  className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  <span>Backgrounds</span>
                  <span className="ml-2 bg-blue-800 text-xs px-1.5 py-0.5 rounded-md">
                    {counts.backgrounds}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="evidence"
                  className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  <FileBadge className="w-4 h-4 mr-2" />
                  <span>Evidence & Profiles</span>
                  <span className="ml-2 bg-blue-800 text-xs px-1.5 py-0.5 rounded-md">
                    {counts.evidence + counts.profiles}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="special"
                  className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Special Animations</span>
                  <span className="ml-2 bg-blue-800 text-xs px-1.5 py-0.5 rounded-md">
                    {counts.specialAnimations}
                  </span>
                </TabsTrigger>
              </TabsList>

              <Button
                variant="outline"
                className="bg-blue-800 border-blue-700 text-white hover:bg-blue-700 flex items-center gap-2"
                onClick={() => handleImportClick(activeCategory)}
              >
                <Plus className="h-4 w-4" />
                Add{' '}
                {activeCategory === 'evidence'
                  ? 'Item'
                  : activeCategory === 'bubbles'
                    ? 'Bubble'
                    : activeCategory}
              </Button>
            </div>

            <div className="mt-4">
              <TabsContent value="bubbles" className="mt-0">
                <BubbleSetManager />
              </TabsContent>

              <TabsContent value="music" className="mt-0">
                <MusicManager />
              </TabsContent>

              <TabsContent value="sprites" className="mt-0">
                <SpriteManager />
              </TabsContent>

              <TabsContent value="backgrounds" className="mt-0">
                <BackgroundManager />
              </TabsContent>

              <TabsContent value="evidence" className="mt-0">
                <EvidenceProfileManager />
              </TabsContent>

              <TabsContent value="special" className="mt-0">
                <SpecialAnimationManager />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Import asset modal */}
      <ImportAssetModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        category={activeCategory}
      />
    </div>
  );
}