
import { isSameDay, isWeekend, format, isBefore, startOfDay } from 'date-fns';

// Helper function to determine if a day is a day off (weekend or holiday)
export const isDayOff = (date: Date, holidays: Date[]) => {
  // Check if the day is a weekend (Saturday or Sunday)
  if (isWeekend(date)) return true;
  
  // Check if the day is a holiday
  return holidays.some(holiday => isSameDay(holiday, date));
};

// Returns the month name in Swedish
export const getMonthName = (monthIndex: number) => {
  const months = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  return months[monthIndex];
};

// Format date to a string for set operations
export const formatDateToString = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

// Check if a date is in the past (before today)
export const isDateInPast = (date: Date) => {
  const today = startOfDay(new Date());
  return isBefore(date, today);
};
