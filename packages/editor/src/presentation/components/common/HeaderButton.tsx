import React from 'react';
import { Link } from '@tanstack/react-router';

interface HeaderButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
  to?: string;
  isDarkMode: boolean;
  color: 'blue' | 'red' | 'green' | 'yellow' | 'purple';
}

export function HeaderButton({
  icon,
  tooltip,
  onClick,
  to,
  isDarkMode,
  color,
}: HeaderButtonProps) {
  // Define color variants based on the color prop and dark mode
  const colorClasses = {
    blue: isDarkMode
      ? 'bg-blue-800 hover:bg-blue-700 text-blue-200 hover:text-white'
      : 'bg-blue-700 hover:bg-blue-600 text-white',
    red: isDarkMode
      ? 'bg-red-900 hover:bg-red-800 text-red-200 hover:text-white'
      : 'bg-red-700 hover:bg-red-600 text-white',
    green: isDarkMode
      ? 'bg-green-900 hover:bg-green-800 text-green-200 hover:text-white'
      : 'bg-green-700 hover:bg-green-600 text-white',
    yellow: isDarkMode
      ? 'bg-amber-800 hover:bg-amber-700 text-amber-200 hover:text-white'
      : 'bg-amber-600 hover:bg-amber-500 text-white',
    purple: isDarkMode
      ? 'bg-purple-900 hover:bg-purple-800 text-purple-200 hover:text-white'
      : 'bg-purple-700 hover:bg-purple-600 text-white',
  };

  const button = (
    <button
      className={`p-2 rounded-md ${colorClasses[color]} transition-colors border-2 ${isDarkMode ? 'border-gray-800' : 'border-gray-600'} shadow-sm`}
      title={tooltip}
      onClick={onClick}
    >
      {icon}
    </button>
  );

  if (to) {
    return <Link to={to}>{button}</Link>;
  }

  return button;
}
