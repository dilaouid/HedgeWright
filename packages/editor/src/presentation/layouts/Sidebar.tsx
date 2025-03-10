/* eslint-disable react/react-in-jsx-scope */
import { useRouter } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Layers,
  MessageSquare,
  FileBadge,
  Shield,
  GitPullRequest,
  Settings,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Users,
  ToggleLeft,
  FolderOpen,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

export function Sidebar({ collapsed, toggleCollapsed }: SidebarProps) {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState('');

  // Update current path when router changes
  useEffect(() => {
    setCurrentPath(router.state.location.pathname);
  }, [router.state.location.pathname]);

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/editor',
    },
    {
      name: 'Timeline',
      icon: <GitPullRequest size={20} />,
      path: '/timeline',
    },
    {
      name: 'Investigations',
      icon: <Search size={20} />,
      path: '/investigations',
    },
    {
      name: 'Scenes',
      icon: <Layers size={20} />,
      path: '/scenes',
    },
    {
      name: 'Dialogue',
      icon: <MessageSquare size={20} />,
      path: '/dialogue',
    },
    {
      name: 'Cross-Examination',
      icon: <Shield size={20} />,
      path: '/cross-examination',
    },
    {
      name: 'Evidence',
      icon: <FileBadge size={20} />,
      path: '/evidence',
    },
    {
      name: 'Characters',
      icon: <Users size={20} />,
      path: '/characters',
    },
    {
      name: 'Assets',
      icon: <FolderOpen size={20} />,
      path: '/assets',
    },
    {
      name: 'Switches',
      icon: <ToggleLeft size={20} />,
      path: '/switches',
    },
    {
      name: 'Settings',
      icon: <Settings size={20} />,
      path: '/settings',
    },
  ];

  // Fixed navigation handler
  const handleNavigation = (path: string) => {
    router.navigate({ to: path });
  };

  return (
    <aside
      className={cn(
        'h-full bg-gradient-to-b from-blue-950 to-indigo-950 transition-all duration-300 flex flex-col',
        'border-r border-blue-800/50 shadow-lg',
        collapsed ? 'w-[68px]' : 'w-[230px]'
      )}
    >
      <div className="p-4 flex items-center justify-center border-b border-blue-800/40">
        {!collapsed && (
          <div className="font-ace text-white text-xl tracking-wide overflow-hidden">
            HEDGEWRIGHT
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-transparent">
        <ul className="space-y-2 px-2">
          {navigationItems.map((item) => {
            const isActive = currentPath === item.path;

            return (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    'w-full flex items-center px-3 py-2.5 rounded-md whitespace-nowrap transition-all',
                    'relative overflow-hidden group cursor-pointer',
                    isActive
                      ? 'bg-blue-800/70 text-white font-medium shadow-md'
                      : 'text-blue-200/80 hover:bg-blue-800/40 hover:text-white'
                  )}
                  title={collapsed ? item.name : undefined}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  type="button"
                >
                  <AnimatePresence>
                    {(isActive || hoveredItem === item.path) && (
                      <motion.div 
                        className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: 0.15 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  <span className={cn(
                    "flex-shrink-0 transition-transform",
                    (isActive || hoveredItem === item.path) ? "text-yellow-400 scale-110" : ""
                  )}>
                    {item.icon}
                  </span>
                  
                  {!collapsed && (
                    <span className={cn(
                      "ml-3 font-medium tracking-wide transition-colors",
                      (isActive || hoveredItem === item.path) ? "text-yellow-400" : ""
                    )}>
                      {item.name}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Toggle collapse button */}
      <div className="p-3 border-t border-blue-800/40">
        <button
          onClick={toggleCollapsed}
          className="w-full flex items-center justify-center p-2 rounded-md
            bg-blue-800/30 hover:bg-blue-700/50 transition-colors 
            text-blue-200 hover:text-white cursor-pointer"
          type="button"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}