import React, { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Menu,
  Save,
  DownloadCloud,
  Upload,
  Play,
  Settings,
  HelpCircle,
  Moon,
  Sun,
} from 'lucide-react';
import { useProjectActions } from '@/application/hooks/project/useProjectActions';
import { HeaderButton } from '../common/HeaderButton';
import { FileSystemWatcherStatus } from '@/presentation/components/common/FileSystemWatcherStatus';

interface HeaderBarProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  projectName?: string;
}

export function HeaderBar({
  toggleSidebar,
  isSidebarCollapsed,
  projectName,
}: HeaderBarProps) {
  const { saveProject, } = useProjectActions();
  const [isDarkMode, setIsDarkMode] = React.useState(
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  // Apply theme on mount and when it changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className={`h-16 ${isDarkMode ? 'bg-blue-950' : 'bg-blue-800'} border-b-4 ${isDarkMode ? 'border-blue-800' : 'border-blue-600'} shadow-lg z-10`}>
      <div className="max-w-screen-2xl mx-auto h-full flex items-center px-4">
        {/* Left section */}
        <div className="flex items-center">
          {projectName && (
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-md ${isDarkMode ? 'hover:bg-blue-800' : 'hover:bg-blue-700'} mr-2 text-white transition-colors`}
              aria-label={
                isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
              }
            >
              <Menu size={20} />
            </button>
          )}

          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold flex items-center px-1 text-white"
          >
            <span className={`${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>Hedge</span>
            <span>Wright</span>
          </Link>
        </div>

        {/* Center section - Project name */}
        <div className="flex-1 flex justify-center">
          {projectName && (
            <div className={`px-6 py-1 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-700'} rounded border-2 ${isDarkMode ? 'border-blue-700' : 'border-blue-500'} text-white font-medium max-w-md truncate shadow-inner`}>
              {projectName}
            </div>
          )}
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-1">
          {projectName ? (
            <>
              <HeaderButton
                icon={<Save />}
                tooltip="Save Case File"
                onClick={saveProject}
                isDarkMode={isDarkMode}
                color="blue"
              />
              <HeaderButton 
                icon={<DownloadCloud />} 
                tooltip="Export Case" 
                isDarkMode={isDarkMode}
                color="green"
              />
              <HeaderButton 
                icon={<Play />} 
                tooltip="Preview Case" 
                isDarkMode={isDarkMode}
                color="red"
              />

              <div className={`h-6 w-px ${isDarkMode ? 'bg-blue-700' : 'bg-blue-600'} mx-2`}></div>
            </>
          ) : (
            <HeaderButton 
              icon={<Upload />} 
              tooltip="Import Case" 
              isDarkMode={isDarkMode} 
              color="green"
            />
          )}

          <HeaderButton
            icon={isDarkMode ? <Sun /> : <Moon />}
            tooltip={isDarkMode ? "Court Lights On" : "Court Lights Off"}
            onClick={toggleTheme}
            isDarkMode={isDarkMode}
            color="yellow"
          />
          <HeaderButton
            icon={<Settings />}
            tooltip="Case Settings"
            to="/settings"
            isDarkMode={isDarkMode}
            color="purple"
          />
          <HeaderButton
            icon={<HelpCircle />} 
            tooltip="Court Guide" 
            isDarkMode={isDarkMode}
            color="blue" 
          />
        </div>
      </div>
      <FileSystemWatcherStatus />
    </header>
  );
}

