import React from 'react';
import { 
  User, 
  FileText, 
  Image, 
  Music, 
  Award, 
  Plus,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../ui/button';

type IconType = 'user' | 'file' | 'image' | 'music' | 'award' | 'warning';
type SizeType = 'sm' | 'md' | 'lg';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: IconType;
  size?: SizeType;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon, size = 'md', action }: EmptyStateProps) {
  const IconComponent = {
    user: User,
    file: FileText,
    image: Image,
    music: Music,
    award: Award,
    warning: AlertTriangle
  }[icon];

  const sizeClasses = {
    sm: {
      wrapper: 'p-4',
      icon: 'h-12 w-12',
      title: 'text-lg',
      description: 'text-sm'
    },
    md: {
      wrapper: 'p-6',
      icon: 'h-16 w-16',
      title: 'text-xl',
      description: 'text-base'
    },
    lg: {
      wrapper: 'p-8',
      icon: 'h-20 w-20',
      title: 'text-2xl',
      description: 'text-lg'
    }
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center text-center ${sizeClasses.wrapper}`}>
      <div className={`${sizeClasses.icon} text-slate-300 dark:text-slate-700 mb-4`}>
        <IconComponent size="100%" />
      </div>
      <h3 className={`${sizeClasses.title} font-semibold mb-2`}>{title}</h3>
      <p className={`${sizeClasses.description} text-slate-500 dark:text-slate-400 max-w-md mb-4`}>
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} className="gap-1">
          <Plus className="h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
}