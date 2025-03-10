import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

export function InfoCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="card-ace bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-4"
    >
      <div className="flex items-start gap-4">
        <div className="bg-purple-800/50 p-2 rounded-lg">
          <Info className="h-6 w-6 text-purple-200" />
        </div>
        <div>
          <h3 className="text-lg font-ace text-white mb-1">About Switches</h3>
          <p className="text-blue-200 text-sm">
            Switches are boolean flags (ON/OFF) that control game behavior and interactions. 
            Use them to track player progress, unlock scenes, and trigger events. Each switch has a unique 
            numeric ID that you can reference in your game logic.
          </p>
        </div>
      </div>
    </motion.div>
  );
}