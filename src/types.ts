
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

// Optimization Types
export type OptimizationStrategy = 'balanced' | 'miniBreaks' | 'longWeekends' | 'weekLongBreaks' | 'extendedVacations';

export interface OptimizedDay {
    date: string;
    isWeekend: boolean;
    isPTO: boolean;
    isPartOfBreak: boolean;
    isPublicHoliday: boolean;
    publicHolidayName?: string;
    isCompanyDayOff: boolean;
    companyDayName?: string;
}

export interface Break {
    startDate: string;
    endDate: string;
    days: OptimizedDay[];
    totalDays: number;
    ptoDays: number;
    publicHolidays: number;
    weekends: number;
    companyDaysOff: number;
}

export interface OptimizationStats {
    totalPTODays: number;
    totalPublicHolidays: number;
    totalNormalWeekends: number;
    totalExtendedWeekends: number;
    totalCompanyDaysOff: number;
    totalDaysOff: number;
}

export interface OptimizationResult {
    days: OptimizedDay[];
    breaks: Break[];
    stats: OptimizationStats;
}

export interface CompanyDayOff {
    date: string;           // Date in 'yyyy-MM-dd' format
    name: string;          // Description or name of the company day off
    isRecurring?: boolean; // Whether this applies to all matching weekdays in a date range
    startDate?: string;    // If recurring, the start date of the range
    endDate?: string;      // If recurring, the end date of the range
    weekday?: number;      // If recurring, the day of week (0-6, where 0 is Sunday)
}

export interface OptimizationParams {
    numberOfDays: number;
    strategy?: OptimizationStrategy;
    year?: number;
    holidays?: Array<{ date: string, name: string }>;
    companyDaysOff?: Array<CompanyDayOff>;
}

export interface StrategyOption {
    id: OptimizationStrategy;
    label: string;
    description: string;
}

// Application-specific color schemes - these should match COLOR_SCHEMES keys exactly
export type BaseColorScheme = 
  | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  | 'purple' | 'orange' | 'indigo'
  | 'pto' | 'publicHoliday' | 'companyDayOff' | 'weekend' | 'extendedWeekend'
  | 'default' | 'today' | 'past';

// Additional color schemes that map to base color schemes
export type ExtendedColorScheme =
  | 'blue' | 'green' | 'amber' | 'teal' | 'violet' | 'slate';

// Combined color scheme type
export type AppColorScheme = BaseColorScheme | ExtendedColorScheme;

// Possible colors - this is what we use as input to our components
export type PossibleColors = AppColorScheme;

// Type definitions for the structure of color scheme elements
export interface TailwindColorStyles {
  bg: string;    // Background color classes (e.g., "bg-blue-100 dark:bg-blue-900/50")
  text: string;  // Text color classes (e.g., "text-blue-600 dark:text-blue-300")
  ring: string;  // Ring/outline classes (e.g., "ring-blue-400/20 dark:ring-blue-300/20")
}

export interface TooltipStyles {
  icon: string;  // Icon color classes
  bg: string;    // Background color classes
}

export interface CardStyles {
  hover: string; // Hover state classes
  ring?: string; // Optional ring/outline classes
}

// The complete structure of a color scheme definition
export interface ColorSchemeDefinition {
  icon: TailwindColorStyles;
  tooltip: TooltipStyles;
  card?: CardStyles;
  calendar: TailwindColorStyles;
}

// The complete COLOR_SCHEMES object type
export type ColorSchemes = Record<PossibleColors, ColorSchemeDefinition>;
