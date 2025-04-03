
import { addDays, differenceInDays, format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { SwedishHoliday, isDayOff } from '../swedishHolidays';
import { VacationPeriod, OptimizationMode, OptimizedSchedule, PotentialPeriod } from './types';

// Calculate how many vacation days are needed for a period
export function calculateVacationDaysNeeded(
  startDate: Date,
  endDate: Date,
  holidays: SwedishHoliday[]
): number {
  let vacationDaysNeeded = 0;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    if (!isDayOff(currentDate, holidays)) {
      vacationDaysNeeded++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return vacationDaysNeeded;
}

// Calculate the efficiency of a vacation plan
export function calculateEfficiency(totalDaysOff: number, vacationDaysUsed: number): string {
  if (vacationDaysUsed <= 0) return "0";
  const efficiency = totalDaysOff / vacationDaysUsed;
  return efficiency.toFixed(2);
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
function getMonthName(month: number): string {
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

// Generate a description for a vacation period
export function generatePeriodDescription(startDate: Date, endDate: Date): string {
  const monthStart = startDate.getMonth();
  const monthEnd = endDate.getMonth();
  
  if (monthStart === monthEnd) {
    return `Ledighet i ${getMonthName(monthStart)}`;
  } else {
    return `Ledighet ${getMonthName(monthStart)}-${getMonthName(monthEnd)}`;
  }
}

// Determine the type of period based on its length
export function determinePeriodType(totalDays: number): string {
  if (totalDays <= 4) {
    return "longweekend";
  } else if (totalDays <= 6) {
    return "minibreak";
  } else if (totalDays <= 9) {
    return "week";
  } else {
    return "extended";
  }
}

// Check if a period overlaps with any period in a list
export function overlapsWithAny(
  periodStart: Date,
  periodEnd: Date,
  existingPeriods: { start: Date, end: Date }[]
): boolean {
  return existingPeriods.some(existingPeriod => {
    return (
      (periodStart <= existingPeriod.end && periodEnd >= existingPeriod.start)
    );
  });
}
