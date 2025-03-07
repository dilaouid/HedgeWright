import React from 'react';
import { Check, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useTranslation } from 'react-i18next';

export interface AceLanguageSwitcherProps {
  className?: string;
}

/**
 * Composant de sélection de langue utilisant i18n
 * Permet de changer la langue de l'application de manière interactive
 */
const AceLanguageSwitcher: React.FC<AceLanguageSwitcherProps> = ({
  className,
}) => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
  ];

  const handleLanguageChange = (locale: string) => {
    i18n.changeLanguage(locale);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-md bg-[#1F1E36] border border-[#F0B27A] text-white hover:bg-[#2C2B4B] transition-colors",
            className
          )}
          aria-label="Changer de langue"
        >
          <Globe size={16} />
          <span className="ml-1 text-sm font-medium">
            {languages.find(lang => lang.code === currentLocale)?.label || 'Langue'}
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-[#F0B27A] bg-[#1F1E36] p-1 shadow-md animate-in fade-in-80"
          sideOffset={5}
          align="end"
          alignOffset={-3}
        >
          <DropdownMenu.RadioGroup value={currentLocale} onValueChange={handleLanguageChange}>
            {languages.map((language) => (
              <DropdownMenu.RadioItem
                key={language.code}
                value={language.code}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm font-medium outline-none transition-colors focus:bg-[#2C2B4B] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-white",
                  currentLocale === language.code && "bg-[#2C2B4B]"
                )}
              >
                <span>{language.label}</span>
                {currentLocale === language.code && (
                  <Check className="ml-auto h-4 w-4 text-[#F0B27A]" />
                )}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export { AceLanguageSwitcher }; 