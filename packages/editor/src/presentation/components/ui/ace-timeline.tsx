import React from 'react';
import { cn } from '@/lib/utils';
import { AceCard } from './ace-card';
import { useTranslation } from 'react-i18next';

export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  isActive?: boolean;
  type?: 'scene' | 'investigation' | 'dialogue' | 'evidence';
  date?: string;
}

export interface AceTimelineProps {
  items: TimelineItem[];
  onItemClick?: (id: string) => void;
  className?: string;
  emptyMessage?: string;
}

// Styles pour l'animation de fade-in
const fadeInKeyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

/**
 * Composant de timeline verticale avec style Ace Attorney
 * Affiche une liste d'éléments chronologiques avec des indicateurs visuels
 */
const AceTimeline: React.FC<AceTimelineProps> = ({
  items,
  onItemClick,
  className,
  emptyMessage,
}) => {
  const { t } = useTranslation();
  
  // Ajouter les styles d'animation au document
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = fadeInKeyframes;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Couleurs par type d'élément
  const typeColors = {
    scene: {
      dot: "bg-[#D32F2F]",
      card: "red",
    },
    investigation: {
      dot: "bg-[#FF9800]",
      card: "orange",
    },
    dialogue: {
      dot: "bg-[#4CAF50]",
      card: "green",
    },
    evidence: {
      dot: "bg-[#2196F3]",
      card: "blue",
    },
  };
  
  // Icônes par type d'élément
  const typeIcons = {
    scene: "movie",
    investigation: "psychology",
    dialogue: "chat",
    evidence: "search",
  };
  
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center text-white/70 italic">
        {emptyMessage || t('common.noItems')}
      </div>
    );
  }

  return (
    <div className={cn("relative py-4", className)}>
      {/* Ligne verticale */}
      <div className="absolute left-[20px] top-0 bottom-0 w-1 bg-[#F0B27A]"></div>
      
      {/* Points sur la timeline */}
      {items.map((item, index) => {
        const type = item.type || 'scene';
        const colors = typeColors[type];
        const icon = typeIcons[type];
        
        return (
          <div 
            key={item.id}
            className="relative mb-8 transition-all duration-300 transform hover:translate-x-1"
            style={{ 
              animationDelay: `${index * 100}ms`,
              opacity: 0,
              animation: 'fadeIn 0.5s forwards'
            }}
          >
            <div className="flex items-start">
              <button
                onClick={() => onItemClick?.(item.id)}
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-200 transform hover:scale-110 shadow-md",
                  item.isActive 
                    ? `${colors.dot} border-white` 
                    : "bg-[#1F1E36] border-[#F0B27A] opacity-80 hover:opacity-100"
                )}
                aria-label={`Sélectionner ${item.title}`}
              >
                <span className="material-icons text-white text-sm">{icon}</span>
              </button>
              
              <div className="ml-4 flex-1">
                <AceCard 
                  variant={item.isActive ? colors.card as any : "default"}
                  className={cn(
                    "cursor-pointer transition-all duration-200 transform hover:translate-x-1 depth-card",
                    item.isActive && "border-white"
                  )}
                  onClick={() => onItemClick?.(item.id)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={cn(
                        "font-bold",
                        item.isActive ? "text-white" : "text-[#F0B27A]"
                      )}>
                        {item.title}
                      </h3>
                      
                      {item.date && (
                        <span className="text-xs text-white/60 bg-black/30 px-2 py-1 rounded">
                          {item.date}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-white/80 text-sm">{item.description}</p>
                    
                    {/* Badge de type */}
                    <div className="mt-3 flex justify-between items-center">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded uppercase font-bold",
                        `bg-${colors.dot}/20 text-white`
                      )}>
                        {t(`elements.${type}`)}
                      </span>
                      
                      {item.isActive && (
                        <span className="text-xs bg-white/20 text-white px-2 py-1 rounded">
                          {t('common.active')}
                        </span>
                      )}
                    </div>
                  </div>
                </AceCard>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { AceTimeline }; 