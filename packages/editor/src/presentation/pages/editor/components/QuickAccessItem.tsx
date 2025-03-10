/* eslint-disable react/react-in-jsx-scope */
import { useNavigate } from "@tanstack/react-router";
import { motion } from 'framer-motion';

interface QuickAccessItemProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  path: string;
}

export function QuickAccessItem({ label, count, icon, path }: QuickAccessItemProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate({ to: path })}
      className="flex flex-col items-center p-3 bg-blue-800/40 rounded-lg border-2 border-blue-700/50
            hover:border-yellow-400/60 cursor-pointer transition-all"
    >
      <div className="h-10 w-10 flex items-center justify-center text-yellow-400">
        {icon}
      </div>
      <span className="text-xs mt-1 text-blue-100">{label}</span>
      <span className="text-xs font-medium text-white bg-blue-700/60 px-2 py-0.5 rounded-full mt-1">
        {count}
      </span>
    </motion.div>
  );
}
