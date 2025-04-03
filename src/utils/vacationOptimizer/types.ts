
export interface DetectedHoliday {
  date: string;
  name: string;
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

export type OptimizationStrategy = 
  | 'balanced'
  | 'longWeekends'
  | 'miniBreaks'
  | 'weekLongBreaks'
  | 'extendedVacations';

export interface CompanyDayOff {
  date?: string;
  name?: string;
  isRecurring?: boolean;
  startDate?: string;
  endDate?: string;
  weekday?: number;
}

export interface OptimizationParams {
  numberOfDays: number;
  strategy?: OptimizationStrategy;
  year?: number;
  holidays?: DetectedHoliday[];
  companyDaysOff?: CompanyDayOff[];
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

// For backward compatibility with the old structure
export interface VacationPeriod {
  start: Date;
  end: Date;
  days: number;
  vacationDaysNeeded: number;
  description: string;
  type: string;
  score?: number;
  startDate?: string;
  endDate?: string;
}
