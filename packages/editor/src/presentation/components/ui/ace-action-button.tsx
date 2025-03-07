import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// Composant pour les scanlines
const Scanlines = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-md opacity-15">
    <div className="absolute inset-0 bg-scanlines"></div>
  </div>
);

export interface AceActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'red' | 'blue' | 'green' | 'purple' | 'orange';
  className?: string;
  disabled?: boolean;
  description?: string;
  isNew?: boolean;
}

/**
 * Bouton d'action avec effet visuel Ace Attorney
 * Utilisé pour les actions principales de l'application
 */
const AceActionButton: React.FC<AceActionButtonProps> = ({
  icon,
  label,
  onClick,
  variant = 'red',
  className,
  disabled = false,
  description,
  isNew = false,
}) => {
  const { t } = useTranslation();
  
  const variantClasses = {
    red: "bg-gradient-to-b from-[#FF5722] to-[#D32F2F]",
    blue: "bg-gradient-to-b from-[#2196F3] to-[#1565C0]",
    green: "bg-gradient-to-b from-[#4CAF50] to-[#2E7D32]",
    purple: "bg-gradient-to-b from-[#9C27B0] to-[#6A1B9A]",
    orange: "bg-gradient-to-b from-[#FF9800] to-[#F57C00]",
  };

  return (
    <div className="relative group">
      {isNew && (
        <div className="absolute -top-2 -right-2 z-20 bg-[#FF5722] text-white text-xs font-bold px-2 py-1 rounded-full border border-white shadow-md">
          {t('common.new')}
        </div>
      )}
      
      <button
        onClick={disabled ? undefined : onClick}
        className={cn(
          "relative w-full h-28 flex flex-col items-center justify-center gap-2 border-2 border-white text-white rounded-md shadow-md overflow-hidden shine-button transition-all duration-200 hover:scale-105 active:scale-95",
          variantClasses[variant],
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        disabled={disabled}
        aria-label={label}
      >
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-3xl mb-2">{icon}</div>
          <span className="font-bold text-sm uppercase tracking-wide text-outline">{label}</span>
          {description && (
            <span className="text-xs mt-1 opacity-90 max-w-[80%] text-center">{description}</span>
          )}
        </div>
        
        <Scanlines />
        
        {/* Effet de brillance sur hover */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        
        {/* Effet de pulsation pour attirer l'attention */}
        {isNew && (
          <div className="absolute inset-0 rounded-md pulse-animation"></div>
        )}
      </button>
    </div>
  );
};

/**
 * Composant pour afficher une grille d'actions
 * Inclut automatiquement les boutons pour Investigations et Scènes
 */
export interface AceActionGridProps {
  onEvidenceClick: () => void;
  onProfilesClick: () => void;
  onDialoguesClick: () => void;
  onCrossExamClick: () => void;
  onInvestigationsClick: () => void;
  onScenesClick: () => void;
  className?: string;
}

export const AceActionGrid: React.FC<AceActionGridProps> = ({
  onEvidenceClick,
  onProfilesClick,
  onDialoguesClick,
  onCrossExamClick,
  onInvestigationsClick,
  onScenesClick,
  className,
}) => {
  const { t } = useTranslation();
  
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-4", className)}>
      <AceActionButton
        icon={<span className="material-icons">search</span>}
        label={t('elements.evidence')}
        onClick={onEvidenceClick}
        variant="red"
      />
      
      <AceActionButton
        icon={<span className="material-icons">person</span>}
        label={t('elements.profiles')}
        onClick={onProfilesClick}
        variant="blue"
      />
      
      <AceActionButton
        icon={<span className="material-icons">chat</span>}
        label={t('elements.dialogues')}
        onClick={onDialoguesClick}
        variant="green"
      />
      
      <AceActionButton
        icon={<span className="material-icons">gavel</span>}
        label={t('elements.crossExam')}
        onClick={onCrossExamClick}
        variant="purple"
      />
      
      <AceActionButton
        icon={<span className="material-icons">psychology</span>}
        label={t('elements.investigations')}
        onClick={onInvestigationsClick}
        variant="orange"
        isNew={true}
      />
      
      <AceActionButton
        icon={<span className="material-icons">movie</span>}
        label={t('elements.scenes')}
        onClick={onScenesClick}
        variant="blue"
        isNew={true}
      />
    </div>
  );
};

export { AceActionButton }; 