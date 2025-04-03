
import { addDays, format, differenceInDays, isSameDay } from 'date-fns';
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
    
    let currentDay = new Date(start);
    while (currentDay <= end) {
      daysOffSet.add(formatDateToString(new Date(currentDay)));
      currentDay.setDate(currentDay.getDate() + 1);
    }
  });
  
  // Return the total unique days
  return daysOffSet.size;
};

// Calculate required vacation days for a period
export const calculateVacationDaysNeeded = (start: Date, end: Date, holidays: Date[]): number => {
  let vacationDaysNeeded = 0;
  let currentDay = new Date(start);
  
  while (currentDay <= end) {
    // Count only weekdays that are not holidays
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

// Verify that a set of periods uses exactly the specified number of vacation days
export const verifyExactVacationDays = (periods: VacationPeriod[], targetDays: number): boolean => {
  const totalVacationDays = periods.reduce((sum, period) => sum + period.vacationDaysNeeded, 0);
  return totalVacationDays === targetDays;
};

// Sum the vacation days needed for all periods
export const sumVacationDaysNeeded = (periods: VacationPeriod[]): number => {
  return periods.reduce((sum, period) => sum + period.vacationDaysNeeded, 0);
};
