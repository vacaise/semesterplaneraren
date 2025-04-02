
import { addDays, format, differenceInDays } from 'date-fns';
import { formatDateToString, isDayOff } from './helpers';
import { VacationPeriod } from './types';

// Calculate total days off from all selected periods
export const calculateTotalDaysOff = (periods: VacationPeriod[], holidays: Date[], companyDays: Date[] = []): number => {
  // Simple sum of days per period
  return periods.reduce((total, period) => total + period.days, 0);
};

// Calculate required vacation days for a period
export const calculateVacationDaysNeeded = (start: Date, end: Date, holidays: Date[], companyDays: Date[] = []): number => {
  let vacationDaysNeeded = 0;
  let currentDay = new Date(start);
  
  while (currentDay <= end) {
    // Skip weekends, holidays and company days
    if (!isDayOff(currentDay, holidays, companyDays)) {
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
