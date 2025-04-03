
import { isSameDay, isWeekend, format, isBefore, startOfDay } from 'date-fns';
import { sv } from 'date-fns/locale';

// Helper function to determine if a day is a day off (weekend or holiday)
export const isDayOff = (date: Date, holidays: Date[]): boolean => {
  // Check if the day is a weekend (Saturday or Sunday)
  if (isWeekend(date)) return true;
  
  // Check if the day is a holiday
  return holidays.some(holiday => 
    isSameDay(new Date(holiday), new Date(date))
  );
};

// Format date to a string for set operations
export const formatDateToString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Check if a date is in the past (before today)
export const isDateInPast = (date: Date): boolean => {
  const today = startOfDay(new Date());
  const dateToCheck = startOfDay(new Date(date));
  return isBefore(dateToCheck, today);
};

// Get the number of work days between two dates
export const getWorkDays = (startDate: Date, endDate: Date, holidays: Date[]): number => {
  let workDays = 0;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Check if it's not a weekend or holiday
    if (!isDayOff(currentDate, holidays)) {
      workDays++;
    }
    
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return workDays;
};

// Returns the month name in Swedish
export const getMonthName = (monthIndex: number): string => {
  const months = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  return months[monthIndex];
};

// Format a date range as a string
export const formatDateRange = (start: Date, end: Date): string => {
  const startFormatted = format(new Date(start), 'd MMM', { locale: sv });
  const endFormatted = format(new Date(end), 'd MMM', { locale: sv });
  return `${startFormatted} - ${endFormatted}`;
};
