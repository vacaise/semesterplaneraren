
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

<<<<<<< HEAD
// Format date as YYYY-MM-DD
export function formatDateIso(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Format date as Month DD, YYYY
export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
=======
export const isProd = () => process.env.NODE_ENV === 'production';

// Utility function to get day type colors
export type DayType = 'pto' | 'publicHoliday' | 'companyDayOff' | 'weekend' | 'extendedWeekend' | 'default';

// Mapping from day types to color schemes
export const dayTypeToColorScheme: Record<DayType, PossibleColors> = {
  pto: 'fuchsia',
  publicHoliday: 'amber',
  companyDayOff: 'violet',
  weekend: 'orange',
  extendedWeekend: 'red',
  default: 'transparent'
};

// Custom utility functions for common Tailwind patterns
export const linkStyles = {
  default: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2',
  nav: 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100',
};

export const containerStyles = {
  default: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  narrow: 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8',
  wide: 'max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8',
};

// Text size utilities with responsive variants
export const textSize = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
};

// Spacing utilities
export const spacing = {
  section: 'my-6 md:my-8',
  container: 'px-4 sm:px-6 lg:px-8',
  stack: "space-y-4 sm:space-y-6",
  inline: "space-x-2 sm:space-x-4"
>>>>>>> 227f356 (Update project configuration and add missing files)
}
