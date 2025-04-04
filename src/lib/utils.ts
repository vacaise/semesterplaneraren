
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PossibleColors } from '@/types';

// Utility for merging tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
}

export const isProd = () => process.env.NODE_ENV === 'production';

// Utility function to get day type colors
export type DayType = 'pto' | 'publicHoliday' | 'companyDayOff' | 'weekend' | 'extendedWeekend' | 'default';

// Mapping from day types to color schemes
export const dayTypeToColorScheme: Record<DayType, PossibleColors> = {
  pto: 'fuchsia' as unknown as PossibleColors,
  publicHoliday: 'amber',
  companyDayOff: 'violet',
  weekend: 'orange' as unknown as PossibleColors,
  extendedWeekend: 'red' as unknown as PossibleColors,
  default: 'transparent' as unknown as PossibleColors
};

// Custom utility functions for common Tailwind patterns
export const linkStyles = {
  default: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2',
  nav: 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100',
  primary: 'text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline underline-offset-2',
  secondary: 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100',
  ghost: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
};

export const containerStyles = {
  default: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  narrow: 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8',
  wide: 'max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8',
};

// Text size utilities with responsive variants
export const textSize = (size: 'tiny' | 'small' | 'base' | 'large' | 'xl' | '2xl'): string => {
  const sizes = {
    tiny: 'text-xs',
    small: 'text-sm',
    base: 'text-base',
    large: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };
  
  return sizes[size] || sizes.base;
};

// Spacing utilities
export const spacing = {
  section: 'my-6 md:my-8',
  container: 'px-4 sm:px-6 lg:px-8',
  stack: "space-y-4 sm:space-y-6",
  inline: "space-x-2 sm:space-x-4"
};
