import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  MessageSquare, 
  Shield, 
  FileBadge, 
  User, 
  ToggleLeft,
  FolderOpen,
  Search
} from 'lucide-react';
import { useRouter } from '@tanstack/react-router';

interface QuickAccessPanelProps {
  sceneCount: number;
  characterCount: number;
  assetCount: number;
  switchCount: number;
  investigationCount: number;
  crossExaminationCount: number;
}

export function QuickAccessPanel({
  sceneCount,
  characterCount,
  assetCount,
  switchCount,
  investigationCount,
  crossExaminationCount
}: QuickAccessPanelProps) {
  const router = useRouter();

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.navigate({ to: path });
  };

  const quickAccessItems = [
    {
      name: 'Scenes',
      count: sceneCount,
      icon: <Layers className="h-5 w-5" />,
      path: '/scenes',
      color: 'bg-indigo-500'
    },
    {
      name: 'Investigations',
      count: investigationCount,
      icon: <Search className="h-5 w-5" />,
      path: '/investigations',
      color: 'bg-amber-500'
    },
    {
      name: 'Dialogues',
      count: 0, // This should be passed as a prop
      icon: <MessageSquare className="h-5 w-5" />,
      path: '/dialogue',
      color: 'bg-blue-500'
    },
    {
      name: 'Cross-Exams',
      count: crossExaminationCount,
      icon: <Shield className="h-5 w-5" />,
      path: '/cross-examination',
      color: 'bg-rose-500'
    },
    {
      name: 'Evidence',
      count: 0, // This should be passed as a prop
      icon: <FileBadge className="h-5 w-5" />,
      path: '/evidence',
      color: 'bg-orange-500'
    },
    {
      name: 'Characters',
      count: characterCount,
      icon: <User className="h-5 w-5" />,
      path: '/characters',
      color: 'bg-purple-500'
    },
    {
      name: 'Assets',
      count: assetCount,
      icon: <FolderOpen className="h-5 w-5" />,
      path: '/assets',
      color: 'bg-green-500'
    },
    {
      name: 'Switches',
      count: switchCount,
      icon: <ToggleLeft className="h-5 w-5" />,
      path: '/switches',
      color: 'bg-pink-500'
    }
  ];

  return (
    <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-800/50 mb-6">
      <h3 className="text-lg font-ace text-white mb-4 shadow-text">Quick Access</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {quickAccessItems.map((item) => (
          <motion.button
            key={item.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNavigation(item.path)}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-800/40 hover:bg-blue-800/80 transition-all cursor-pointer"
            type="button"
          >
            <div className={`w-9 h-9 ${item.color} rounded-full flex items-center justify-center mb-1.5 shadow-md`}>
              {item.icon}
            </div>
            <span className="text-xs font-medium text-blue-100">{item.name}</span>
            <span className="text-xs font-bold text-blue-300">{item.count}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}