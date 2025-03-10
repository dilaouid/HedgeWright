/* eslint-disable react/react-in-jsx-scope */
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Layers,
  MessageSquare,
  Shield,
  GitPullRequest,
  FileBadge,
  Play,
  LayoutDashboard,
  Variable,
  FileJson,
  ImageIcon,
  User,
  Search,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useProjectStore } from '@/application/state/project/projectStore';
import { ModuleCard } from './components/ModuleCard';
import { QuickAccessPanel } from './components/QuickAccessPanel';

export function EditorPage() {
  const navigate = useNavigate();
  const { currentProject } = useProjectStore();

  // Fix for focus/scroll issues - ensure everything is properly mounted
  useEffect(() => {
    // Reset any trapped focus/scroll states
    document.body.style.overflow = 'auto';
    
    // Add the class to make scrolling work properly
    const editorContent = document.getElementById('editor-content');
    if (editorContent) {
      editorContent.classList.add('scrollbar-ace');
    }
    
    return () => {
      // Cleanup on unmount
      document.body.style.overflow = '';
      if (editorContent) {
        editorContent.classList.remove('scrollbar-ace');
      }
    };
  }, []);

  if (!currentProject) {
    // Redirect to home if no project is open
    navigate({ to: '/' });
    return null;
  }

  // Get asset count (missing from the project state)
  const assetCount = 
    (currentProject.assets?.length || 0) + 
    (currentProject.music?.length || 0) + 
    (currentProject.backgrounds?.length || 0);

  // Get character count (missing from the project state)
  const characterCount = 
    (currentProject.characters?.length || 0) + 
    (currentProject.profiles?.length || 0);

  const projectModules = [
    {
      name: 'Timeline',
      icon: <GitPullRequest className="h-10 w-10" />,
      description: 'Organize your level flow and connections',
      path: '/timeline',
      count: currentProject.timeline.nodes.length,
    },
    {
      name: 'Investigations',
      icon: <Search className="h-10 w-10" />,
      description: 'Manage investigation phases',
      path: '/investigations',
      count: currentProject.investigations.length,
    },
    {
      name: 'Scenes',
      icon: <Layers className="h-10 w-10" />,
      description: 'Create and manage interactive scenes',
      path: '/scenes',
      count: currentProject.scenes.length,
    },
    {
      name: 'Evidence',
      icon: <FileBadge className="h-10 w-10" />,
      description: 'Manage evidence and character profiles',
      path: '/evidence',
      count: currentProject.evidence.length + currentProject.profiles.length,
    },
    {
      name: 'Characters',
      icon: <User className="h-10 w-10" />,
      description: 'Manage characters and their states',
      path: '/characters',
      count: characterCount,
    },
    {
      name: 'Dialogue',
      icon: <MessageSquare className="h-10 w-10" />,
      description: 'Write dialogue with rich text effects',
      path: '/dialogue',
      count: currentProject.dialogues.length,
    },
    {
      name: 'Cross-Examinations',
      icon: <Shield className="h-10 w-10" />,
      description: 'Create witness testimonies and contradictions',
      path: '/cross-examination',
      count: currentProject.crossExaminations.length,
    },
    {
      name: 'Assets',
      icon: <ImageIcon className="h-10 w-10" />,
      description: 'Manage images, sprites, and backgrounds',
      path: '/assets',
      count: assetCount, 
    },
    {
      name: 'Variables',
      icon: <Variable className="h-10 w-10" />,
      description: 'Manage game flags and variable states',
      path: '/variables',
      count: currentProject.variables.length,
    },
  ];

  return (
    <div 
      id="editor-content"
      className="p-4 md:p-6 pb-12 editor-stats-container scrollbar-ace"
    >
      <div className="container-ace space-y-6">
        {/* Ace Attorney style header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 rounded-xl shadow-xl border-2 border-blue-700/70"
        >
          {/* Background pattern to mimic Ace Attorney UI */}
          <div className="absolute inset-0 bg-[url('/assets/images/ui/nds-pattern.png')] opacity-5" />
          
          <div className="relative z-10 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-ace text-white tracking-wide shadow-text">
                  {currentProject.name.toUpperCase()}
                </h1>
                <div className="flex items-center text-sm mt-2 text-blue-200 font-medium flex-wrap gap-2">
                  <div className="flex items-center gap-1">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>
                      Last modified: {new Date(currentProject.lastModified).toLocaleString()}
                    </span>
                  </div>
                  <span className="hidden sm:inline-block">•</span>
                  <div className="flex items-center gap-1">
                    <FileJson className="w-4 h-4" />
                    <span>
                      Created: {new Date(currentProject.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-ace-secondary flex items-center justify-center gap-2 px-6"
              >
                <Play className="h-4 w-4" />
                PREVIEW LEVEL
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Quick access panel */}
        <QuickAccessPanel 
          characterCount={characterCount}
          assetCount={assetCount}
          switchCount={currentProject.variables.length}
          investigationCount={currentProject.investigations.length}
          sceneCount={currentProject.scenes.length}
          crossExaminationCount={currentProject.crossExaminations.length}
        />

        {/* Module cards */}
        <div>
          <h2 className="text-xl font-ace text-white mb-4 tracking-wide shadow-text px-1">PROJECT MODULES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectModules.map((module) => (
              <ModuleCard
                key={module.name}
                name={module.name}
                icon={module.icon}
                description={module.description}
                path={module.path}
                count={module.count}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}