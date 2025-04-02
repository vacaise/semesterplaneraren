
import { isSameDay, isWeekend, format, isBefore, startOfDay } from 'date-fns';
import { sv } from 'date-fns/locale';

// Helper function to determine if a day is a day off (weekend, holiday, or company day)
export const isDayOff = (date: Date, holidays: Date[], companyDays: Date[] = []): boolean => {
  // Check if the day is a weekend (Saturday or Sunday)
  if (isWeekend(date)) return true;
  
  // Check if the day is a holiday
  if (holidays.some(holiday => isSameDay(holiday, date))) return true;
  
  // Check if the day is a company day
  if (companyDays.some(companyDay => isSameDay(companyDay, date))) return true;
  
  return false;
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
export const getWorkDays = (startDate: Date, endDate: Date, holidays: Date[], companyDays: Date[] = []): number => {
  let workDays = 0;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Check if it's a weekday (not Saturday or Sunday) and not a holiday and not a company day
    if (!isDayOff(currentDate, holidays, companyDays)) {
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
  const startFormatted = format(start, 'd MMM', { locale: sv });
  const endFormatted = format(end, 'd MMM', { locale: sv });
  return `${startFormatted} - ${endFormatted}`;
};
