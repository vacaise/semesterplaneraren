
import { isSameDay, isWeekend, format, isBefore, startOfDay } from 'date-fns';
import { sv } from 'date-fns/locale';

// Check if a day is a holiday (red day)
export const isHoliday = (date: Date, holidays: Date[]): boolean => {
  return holidays.some(holiday => isSameDay(holiday, date));
};

// Check if a day is a weekend (Saturday or Sunday)
export const isWeekendDay = (date: Date): boolean => {
  return isWeekend(date);
};

// Check if a day is a day off (either weekend or holiday)
export const isDayOff = (date: Date, holidays: Date[]): boolean => {
  return isWeekendDay(date) || isHoliday(date, holidays);
};

// Check if a date is in the past
export const isDateInPast = (date: Date): boolean => {
  const today = startOfDay(new Date());
  const dateToCheck = startOfDay(new Date(date));
  return isBefore(dateToCheck, today);
};

// Format a date to a readable string
export const formatDate = (date: Date): string => {
  return format(date, 'd MMMM yyyy', { locale: sv });
};

// Format a date range to a readable string
export const formatDateRange = (start: Date, end: Date): string => {
  const startFormatted = format(start, 'd MMM', { locale: sv });
  const endFormatted = format(end, 'd MMM', { locale: sv });
  return `${startFormatted} - ${endFormatted}`;
};

// Get the month name in Swedish
export const getMonthName = (monthIndex: number): string => {
  const months = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  return months[monthIndex];
};
