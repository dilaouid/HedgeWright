/* eslint-disable react/react-in-jsx-scope */
import { Save, HelpCircle, User, Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProjectStore } from '@/application/state/project/projectStore';

export function Toolbar() {
  const { currentProject } = useProjectStore();
  
  return (
    <div className="h-16 bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-950 border-b border-blue-800/70 shadow-md">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <img 
            src="/assets/images/ui/attorney-badge.png" 
            alt="HedgeWright" 
            className="h-8 w-8"
          />
          <span className="font-ace text-white text-lg tracking-wide hidden md:block">
            HEDGEWRIGHT EDITOR
          </span>
          {currentProject && (
            <>
              <span className="text-blue-400 mx-2 hidden md:block">|</span>
              <span className="text-yellow-400 font-medium truncate max-w-[200px]">
                {currentProject.name}
              </span>
            </>
          )}
        </div>
        
        <div className="flex-1 max-w-lg mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
            <input 
              type="text" 
              placeholder="Search in project..." 
              className="w-full bg-blue-900/40 border border-blue-700/60 text-white rounded-md py-2 pl-10 pr-4 
                placeholder:text-blue-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-white hover:text-yellow-400 hover:bg-blue-800/50 rounded-md transition-colors"
          >
            <Save className="h-5 w-5" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-white hover:text-yellow-400 hover:bg-blue-800/50 rounded-md transition-colors"
          >
            <Bell className="h-5 w-5" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-white hover:text-yellow-400 hover:bg-blue-800/50 rounded-md transition-colors"
          >
            <HelpCircle className="h-5 w-5" />
          </motion.button>
          
          <div className="h-8 border-l border-blue-700 mx-1"></div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-blue-800/50 cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-white text-sm hidden md:block">Developer</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}