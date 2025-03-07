import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine les classes CSS avec clsx et tailwind-merge
 * Permet de fusionner des classes conditionnelles et de résoudre les conflits
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Génère un identifiant unique
 * Utile pour les clés React ou les identifiants temporaires
 */
export function generateId(prefix: string = ''): string {
  return `${prefix}${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Formate une date selon la locale
 * @param date Date à formater
 * @param locale Locale à utiliser (fr-FR, en-US, etc.)
 * @param options Options de formatage
 */
export function formatDate(
  date: Date, 
  locale: string = 'fr-FR', 
  options: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Tronque un texte à une longueur maximale
 * @param text Texte à tronquer
 * @param maxLength Longueur maximale
 * @param suffix Suffixe à ajouter si le texte est tronqué
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}${suffix}`;
}

/**
 * Convertit une couleur hexadécimale en RGBA
 * @param hex Couleur hexadécimale (#RRGGBB ou #RGB)
 * @param alpha Valeur alpha (0-1)
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  // Supprime le # si présent
  const cleanHex = hex.replace('#', '');
  
  // Convertit le format court (#RGB) en format long (#RRGGBB)
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(char => char + char).join('')
    : cleanHex;
  
  // Convertit en valeurs RGB
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
