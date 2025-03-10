import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ToggleLeft, ToggleRight } from 'lucide-react';

interface NewSwitchFormProps {
  newSwitchName: string;
  setNewSwitchName: (name: string) => void;
  newSwitchDescription: string;
  setNewSwitchDescription: (description: string) => void;
  newSwitchValue: boolean;
  setNewSwitchValue: (value: boolean) => void;
  onAddSwitch: () => void;
}

export function NewSwitchForm({
  newSwitchName,
  setNewSwitchName,
  newSwitchDescription,
  setNewSwitchDescription,
  newSwitchValue,
  setNewSwitchValue,
  onAddSwitch
}: NewSwitchFormProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card-ace bg-blue-950 p-4"
    >
      <h2 className="text-xl font-ace text-white mb-4 tracking-wide shadow-text">ADD NEW SWITCH</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-blue-300 mb-1">Name</label>
          <input
            type="text"
            value={newSwitchName}
            onChange={(e) => setNewSwitchName(e.target.value)}
            placeholder="Enter switch name"
            className="w-full bg-blue-900/50 border border-blue-800 rounded-lg px-3 py-2 text-white placeholder-blue-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-blue-300 mb-1">Description</label>
          <input
            type="text"
            value={newSwitchDescription}
            onChange={(e) => setNewSwitchDescription(e.target.value)}
            placeholder="Enter description (optional)"
            className="w-full bg-blue-900/50 border border-blue-800 rounded-lg px-3 py-2 text-white placeholder-blue-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-col justify-between">
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-1">Initial Value</label>
            <div className="flex items-center">
              <button
                onClick={() => setNewSwitchValue(false)}
                className={`px-4 py-2 rounded-l-lg flex items-center justify-center gap-1 ${!newSwitchValue ? 'bg-red-800 text-white' : 'bg-blue-900/70 text-blue-300'}`}
              >
                <ToggleLeft className="h-4 w-4" />
                OFF
              </button>
              <button
                onClick={() => setNewSwitchValue(true)}
                className={`px-4 py-2 rounded-r-lg flex items-center justify-center gap-1 ${newSwitchValue ? 'bg-green-700 text-white' : 'bg-blue-900/70 text-blue-300'}`}
              >
                <ToggleRight className="h-4 w-4" />
                ON
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddSwitch}
            className="mt-4 md:mt-0 btn-ace-secondary flex items-center justify-center gap-2"
            disabled={!newSwitchName.trim()}
          >
            <Plus className="h-4 w-4" />
            ADD SWITCH
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}