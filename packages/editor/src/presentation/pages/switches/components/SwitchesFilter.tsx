import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, ToggleLeft, ToggleRight } from 'lucide-react';

interface SwitchesFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showOnlyTrue: boolean;
  setShowOnlyTrue: (show: boolean) => void;
  showOnlyFalse: boolean;
  setShowOnlyFalse: (show: boolean) => void;
}

export function SwitchesFilter({
  searchQuery,
  setSearchQuery,
  showOnlyTrue,
  setShowOnlyTrue,
  showOnlyFalse,
  setShowOnlyFalse
}: SwitchesFilterProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="card-ace bg-blue-950 p-4"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
          <input
            type="text"
            placeholder="Search switches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-blue-900/50 border border-blue-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-blue-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-blue-400" />
          <button
            onClick={() => setShowOnlyTrue(!showOnlyTrue)}
            className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${showOnlyTrue ? 'bg-green-700 text-white' : 'bg-blue-900/50 text-blue-300'}`}
          >
            <ToggleRight className="h-4 w-4" />
            ON
          </button>
          
          <button
            onClick={() => setShowOnlyFalse(!showOnlyFalse)}
            className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 ${showOnlyFalse ? 'bg-red-800 text-white' : 'bg-blue-900/50 text-blue-300'}`}
          >
            <ToggleLeft className="h-4 w-4" />
            OFF
          </button>
        </div>
      </div>
    </motion.div>
  );
}