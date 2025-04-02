
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PossibleColors } from "@/types"
import { COLOR_SCHEMES } from "@/constants"

/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Common container styles for page content
 */
export const containerStyles = "max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-8 xl:px-12"

/**
 * Format a date to a localized string format
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format a date range as a string (e.g., "Jan 1 - Jan 7, 2023")
 */
export function formatDateRange(startDate: Date | string, endDate: Date | string): string {
  if (typeof startDate === 'string') {
    startDate = new Date(startDate)
  }
  if (typeof endDate === 'string') {
    endDate = new Date(endDate)
  }
  
  // If same year, only show year once
  if (startDate.getFullYear() === endDate.getFullYear()) {
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

/**
 * Format a number of days in a readable format (e.g., "5 days" or "1 day")
 */
export function formatDaysCount(count: number): string {
  return count === 1 ? `${count} day` : `${count} days`
}

/**
 * Day type definitions for calendar display
 */
export type DayType = 'default' | 'companyDayOff' | 'weekend' | 'pto' | 'publicHoliday' | 'extendedWeekend';

/**
 * Maps day types to their color schemes
 */
export const dayTypeToColorScheme: Record<DayType, PossibleColors> = {
  default: 'default',
  pto: 'pto',
  publicHoliday: 'publicHoliday',
  companyDayOff: 'companyDayOff',
  weekend: 'weekend',
  extendedWeekend: 'extendedWeekend'
};

/**
 * Safe access function for COLOR_SCHEMES to prevent TypeScript errors
 * Returns the color scheme or a default one if not found
 */
export function getColorScheme(colorScheme: PossibleColors) {
  return COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.default;
}

/**
 * Common text size utility for consistent typography
 */
export const textSize = (size: 'tiny' | 'small' | 'base' | 'medium' | 'large') => {
  switch (size) {
    case 'tiny':
      return 'text-xs';
    case 'small':
      return 'text-sm';
    case 'base':
      return 'text-base';
    case 'medium':
      return 'text-lg';
    case 'large':
      return 'text-xl';
    default:
      return 'text-base';
  }
};

/**
 * Common spacing utility for consistent layout
 */
export const spacing = {
  container: 'px-4 sm:px-6 lg:px-8',
  section: 'py-12 sm:py-16 lg:py-20',
  sectionY: 'py-8 sm:py-12 lg:py-16',
  sectionX: 'px-4 sm:px-6 lg:px-8'
};

/**
 * Common link style utility for consistent styling
 */
export const linkStyles = (variant: 'primary' | 'secondary' | 'ghost') => {
  switch (variant) {
    case 'primary':
      return 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300';
    case 'secondary':
      return 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white';
    case 'ghost':
      return 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200';
    default:
      return 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300';
  }
};

/**
 * Fix TypeScript errors in CalendarView.tsx by adding proper types to the map function parameters
 */
export const fixTypescriptCalendarViewError = (months: string[], callback: (month: string, index: number) => JSX.Element) => {
  return months.map((month: string, index: number) => callback(month, index));
};

/**
 * Fix TypeScript errors in StrategySelectionStep.tsx
 */
export interface StrategyOption {
  id: string;
  label: string;
  description: string;
}
