
import { addDays, format, differenceInDays } from 'date-fns';
import { formatDateToString, isDayOff } from './helpers';
import { VacationPeriod } from './types';

// Calculate total days off from all selected periods
export const calculateTotalDaysOff = (periods: VacationPeriod[], holidays: Date[]): number => {
  if (!periods || periods.length === 0) return 0;
  
  // Create a set of all days off (to avoid double counting)
  const daysOffSet = new Set<string>();
  
  // Add all days from periods to the set
  periods.forEach(period => {
    const start = new Date(period.start);
    const end = new Date(period.end);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      daysOffSet.add(formatDateToString(d));
    }
  });
  
  // Remove duplicates and count total days
  return daysOffSet.size;
};

// Calculate required vacation days for a period
export const calculateVacationDaysNeeded = (start: Date, end: Date, holidays: Date[]): number => {
  let vacationDaysNeeded = 0;
  let currentDay = new Date(start);
  
  while (currentDay <= end) {
    // Skip weekends and holidays
    if (!isDayOff(currentDay, holidays)) {
      vacationDaysNeeded++;
    }
    
    currentDay = addDays(currentDay, 1);
  }
  
  return vacationDaysNeeded;
};

// Calculate total days in a period
export const calculatePeriodDays = (start: Date, end: Date): number => {
  return differenceInDays(end, start) + 1;
};

// Calculate efficiency (days off / vacation days used)
export const calculateEfficiency = (totalDaysOff: number, vacationDaysUsed: number): string => {
  if (vacationDaysUsed <= 0) return "0.00";
  
  const efficiency = totalDaysOff / vacationDaysUsed;
  return efficiency.toFixed(2);
};
