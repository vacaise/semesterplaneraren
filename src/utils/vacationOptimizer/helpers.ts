
import { format } from 'date-fns';
import { OptimizedDay } from './types';

/**
 * Format a Date object as 'YYYY-MM-DD'
 */
export const formatDate = (date: Date): string => {
  const yr = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const dy = String(date.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${dy}`;
};

/**
 * Checks if a given date is a day off (weekend or holiday).
 */
export const isDayOff = (date: Date, holidays: Date[] = []): boolean => {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  
  if (isWeekend) return true;
  
  // Check if the date is a holiday
  const formattedDate = format(date, 'yyyy-MM-dd');
  return holidays.some(holiday => format(holiday, 'yyyy-MM-dd') === formattedDate);
};

/**
 * Checks if a date is in the past.
 */
export const isDateInPast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};

/**
 * Returns true if a day is naturally off (i.e., weekend, public holiday, or company day off).
 * For use with the new optimizer.
 */
export const isFixedOff = (day: OptimizedDay): boolean =>
  day.isWeekend || day.isPublicHoliday || day.isCompanyDayOff;

/**
 * Add a specified number of days to a Date object.
 */
export const addDays = (date: Date, days: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
