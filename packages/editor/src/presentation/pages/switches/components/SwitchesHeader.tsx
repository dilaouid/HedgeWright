import React from 'react';
import { motion } from 'framer-motion';
import { Variable } from 'lucide-react';

export function SwitchesHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 rounded-xl shadow-xl border-2 border-indigo-700/70"
    >
      <div className="absolute inset-0 bg-[url('/assets/images/ui/nds-pattern.png')] opacity-5" />

      <div className="relative z-10 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <Variable className="h-8 w-8 text-purple-300 mr-3" />
            <div>
              <h1 className="text-3xl font-ace text-white tracking-wide shadow-text">
                SWITCHES
              </h1>
              <p className="text-purple-200 text-sm mt-1">
                Manage game flags and variable states that control game behavior
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
