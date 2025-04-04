
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

// Optimization Types
export type OptimizationStrategy = 'balanced' | 'miniBreaks' | 'longWeekends' | 'weekLongBreaks' | 'extendedVacations';

export interface CompanyDayOff {
  date: string;
  name: string;
  isRecurring?: boolean;
  startDate?: string;
  endDate?: string;
  weekday?: number;
}

export interface OptimizedDay {
  date: string;
  isWeekend: boolean;
  isPublicHoliday: boolean;
  publicHolidayName?: string;
  isCompanyDayOff: boolean;
  companyDayName?: string;
  isPTO: boolean;
  isPartOfBreak: boolean;
}

export interface OptimizationParams {
  numberOfDays: number;
  strategy: OptimizationStrategy;
  year: number;
  companyDaysOff: Array<CompanyDayOff>;
  holidays: Array<{ date: string; name: string }>;
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
  totalCompanyDaysOff: number;
  totalDaysOff: number;
  totalExtendedWeekends: number;
}

export interface OptimizationResult {
  days: OptimizedDay[];
  breaks: Break[];
  stats: OptimizationStats;
}

export interface DateItem {
  date: string;
  name: string;
}

export interface GroupedDates {
  name: string;
  dates: DateItem[];
}

// Tailwind color style interfaces
export interface TailwindColorStyles {
  primary?: string;
  secondary?: string;
}

export interface TooltipStyles {
  background: string;
  border: string;
  text: string;
}

interface CardStyles {
  hover: string; // Hover state classes
  ring?: string; // Optional ring/outline classes
}

// The complete structure of a color scheme definition
interface ColorSchemeDefinition {
  icon: TailwindColorStyles;
  tooltip: TooltipStyles;
  card: CardStyles;
  calendar: TailwindColorStyles;
}

export type PossibleColors = 'teal' | 'blue' | 'amber' | 'violet';
// The complete COLOR_SCHEMES object type
export type ColorSchemes = Record<PossibleColors, ColorSchemeDefinition>;
