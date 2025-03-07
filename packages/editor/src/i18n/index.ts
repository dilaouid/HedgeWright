import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { resources } from './resources';

/**
 * Configuration i18n pour l'application
 * Utilise une détection automatique de la langue et fallback sur le français
 * Structure modulaire permettant d'ajouter facilement de nouvelles langues
 */
i18n
  // Détection automatique de la langue du navigateur
  .use(LanguageDetector)
  // Intégration avec React
  .use(initReactI18next)
  // Configuration initiale
  .init({
    resources,
    fallbackLng: 'fr',
    // Langue à utiliser si la traduction dans la langue détectée n'est pas disponible
    supportedLngs: ['fr', 'en'],
    
    // Permet d'utiliser des clés imbriquées (namespace:key)
    keySeparator: '.',
    
    interpolation: {
      // Pas besoin d'échapper les valeurs pour éviter les attaques XSS
      // React le fait déjà
      escapeValue: false,
    },
    
    // Options de détection
    detection: {
      // Ordre des méthodes de détection
      order: ['localStorage', 'navigator'],
      // Clé utilisée dans localStorage
      lookupLocalStorage: 'i18nextLng',
      // Cache la langue détectée
      caches: ['localStorage'],
    },
    
    // Activer le mode debug en développement uniquement
    debug: process.env.NODE_ENV === 'development',
  });

export default i18n; 