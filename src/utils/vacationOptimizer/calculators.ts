
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { SwedishHoliday } from '../swedishHolidays';

// Calculate the efficiency of a vacation plan
export function calculateEfficiency(totalDaysOff: number, vacationDaysUsed: number): string {
  if (vacationDaysUsed <= 0) return "0";
  const efficiency = totalDaysOff / vacationDaysUsed;
  return efficiency.toFixed(2);
}

// Calculate how many vacation days are needed for a period
export function calculateVacationDaysNeeded(
  startDate: Date, 
  endDate: Date, 
  holidays: Date[] | SwedishHoliday[]
): number {
  let vacationDaysNeeded = 0;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    if (isWorkday(currentDate, holidays)) {
      vacationDaysNeeded++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return vacationDaysNeeded;
}

// Check if a date is a workday (not weekend and not holiday)
export function isWorkday(date: Date, holidays: Date[] | SwedishHoliday[]): boolean {
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false; // Weekend
  }
  
  // Check if it's a holiday
  for (const holiday of holidays) {
    const holidayDate = holiday instanceof Date ? holiday : holiday.date;
    if (holidayDate.getFullYear() === date.getFullYear() &&
        holidayDate.getMonth() === date.getMonth() &&
        holidayDate.getDate() === date.getDate()) {
      return false;
    }
  }
  
  return true;
}

// Format a date range as a string
export function formatDateRange(startDate: Date, endDate: Date): string {
  if (startDate.getMonth() === endDate.getMonth()) {
    return `${startDate.getDate()}-${endDate.getDate()} ${getMonthName(startDate.getMonth())}`;
  } else {
    return `${startDate.getDate()} ${getMonthName(startDate.getMonth())} - ${endDate.getDate()} ${getMonthName(endDate.getMonth())}`;
  }
}

// Get month name in Swedish
export function getMonthName(month: number): string {
  const date = new Date();
  date.setMonth(month);
  return format(date, 'MMMM', { locale: sv });
}

// Check if a date is in the past
export function isDateInPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

// Check if a date is a day off (weekend or holiday)
export function isDayOff(date: Date, holidays: Date[] | SwedishHoliday[]): boolean {
  return !isWorkday(date, holidays);
}

