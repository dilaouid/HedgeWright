import React, { useState } from 'react';
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

export function AssetsPage() {
  const { currentProject } = useProjectStore();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('bubbles');

  // Count different asset types for display in tabs
  const bubbleCount =
    currentProject?.assets?.filter((a) => a.category === 'bubble')?.length || 0;
  const musicCount = currentProject?.music?.length || 0;
  const spriteCount =
    currentProject?.assets?.filter((a) => a.category === 'character')?.length || 0;
  const backgroundCount =
    currentProject?.assets?.filter((a) => a.category === 'background')
      ?.length || 0;
  const evidenceCount = currentProject?.evidence?.length || 0;
  const profileCount = currentProject?.profiles?.length || 0;
  const specialAnimCount =
    currentProject?.assets?.filter((a) => a.category === 'effect')?.length ||
    0;

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
                    {bubbleCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="music"
                  className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  <Music className="w-4 h-4 mr-2" />
                  <span>Music & SFX</span>
                  <span className="ml-2 bg-blue-800 text-xs px-1.5 py-0.5 rounded-md">
                    {musicCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="sprites"
                  className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span>Sprites</span>
                  <span className="ml-2 bg-blue-800 text-xs px-1.5 py-0.5 rounded-md">
                    {spriteCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="backgrounds"
                  className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  <span>Backgrounds</span>
                  <span className="ml-2 bg-blue-800 text-xs px-1.5 py-0.5 rounded-md">
                    {backgroundCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="evidence"
                  className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  <FileBadge className="w-4 h-4 mr-2" />
                  <span>Evidence & Profiles</span>
                  <span className="ml-2 bg-blue-800 text-xs px-1.5 py-0.5 rounded-md">
                    {evidenceCount + profileCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="special"
                  className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Special Animations</span>
                  <span className="ml-2 bg-blue-800 text-xs px-1.5 py-0.5 rounded-md">
                    {specialAnimCount}
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
