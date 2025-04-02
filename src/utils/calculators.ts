
import { addDays, format, differenceInDays, getDay, isWeekend } from 'date-fns';
import { sv } from 'date-fns/locale';

export interface VacationPeriod {
  start: Date;
  end: Date;
  totalDays: number;
  vacationDaysUsed: number;
  description: string;
  type: 'longWeekend' | 'bridge' | 'week' | 'extended' | 'single';
  efficiency?: number;
}

export interface OptimizationResult {
  periods: VacationPeriod[];
  totalDaysOff: number;
  vacationDaysUsed: number;
  mode: string;
  efficiency: number;
}

// Check if date is a holiday
export const isHoliday = (date: Date, holidays: Date[]): boolean => {
  return holidays.some(holiday => 
    holiday.getFullYear() === date.getFullYear() &&
    holiday.getMonth() === date.getMonth() &&
    holiday.getDate() === date.getDate()
  );
};

// Check if a day is a day off (weekend or holiday)
export const isDayOff = (date: Date, holidays: Date[]): boolean => {
  return isWeekend(date) || isHoliday(date, holidays);
};

// Calculate efficiency ratio (days off / vacation days used)
export const calculateEfficiency = (totalDaysOff: number, vacationDaysUsed: number): number => {
  if (vacationDaysUsed === 0) return 0;
  return Number((totalDaysOff / vacationDaysUsed).toFixed(2));
};

// Calculate how many vacation days needed for a period
export const calculateVacationDaysNeeded = (start: Date, end: Date, holidays: Date[]): number => {
  let vacationDaysNeeded = 0;
  let current = new Date(start);
  
  while (current <= end) {
    if (!isDayOff(current, holidays)) {
      vacationDaysNeeded++;
    }
    current = addDays(current, 1);
  }
  
  return vacationDaysNeeded;
};

// Calculate total days in a period
export const calculateTotalDays = (start: Date, end: Date): number => {
  return differenceInDays(end, start) + 1;
};

// Format date range for display
export const formatDateRange = (start: Date, end: Date): string => {
  const startFormatted = format(start, 'd MMM', { locale: sv });
  const endFormatted = format(end, 'd MMM', { locale: sv });
  return `${startFormatted} - ${endFormatted}`;
};

// Format a single date
export const formatDate = (date: Date): string => {
  return format(date, 'd MMM yyyy', { locale: sv });
};

// Check if a date is in the past
export const isDateInPast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Check if two date ranges overlap
export const doPeriodsOverlap = (
  start1: Date, 
  end1: Date, 
  start2: Date, 
  end2: Date
): boolean => {
  return start1 <= end2 && end1 >= start2;
};

// Get next workday
export const getNextWorkday = (date: Date, holidays: Date[]): Date => {
  let nextDay = addDays(date, 1);
  while (isDayOff(nextDay, holidays)) {
    nextDay = addDays(nextDay, 1);
  }
  return nextDay;
};

// Get previous workday
export const getPrevWorkday = (date: Date, holidays: Date[]): Date => {
  let prevDay = addDays(date, -1);
  while (isDayOff(prevDay, holidays)) {
    prevDay = addDays(prevDay, -1);
  }
  return prevDay;
};
