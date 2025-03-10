import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '@tanstack/react-router';

interface ModuleCardProps {
  name: string;
  icon: React.ReactNode;
  description: string;
  path: string;
  count: number;
}

export function ModuleCard({ name, icon, description, path, count }: ModuleCardProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.navigate({ to: path });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="card-ace relative overflow-hidden p-5 bg-gradient-to-br from-blue-900 to-blue-950 cursor-pointer"
      onClick={handleClick}
    >
      {/* Count badge */}
      <div className="absolute top-3 right-3 bg-blue-800 text-blue-100 px-2 py-0.5 text-sm font-semibold rounded-md">
        {count}
      </div>
      
      <div className="flex flex-col">
        <div className="mb-3 text-blue-300">
          {icon}
        </div>
        <h3 className="text-lg font-ace text-white mb-1">{name}</h3>
        <p className="text-sm text-blue-200">{description}</p>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 to-yellow-400/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
    </motion.div>
  );
}