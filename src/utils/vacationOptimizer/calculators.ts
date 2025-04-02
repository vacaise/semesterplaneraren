
import { addDays, format, differenceInDays } from 'date-fns';
import { formatDateToString, isDayOff } from './helpers';
import { VacationPeriod } from './types';

/**
 * Beräkna effektivitet (lediga dagar / använda semesterdagar)
 */
export const calculateEfficiency = (totalDaysOff: number, vacationDaysUsed: number): string => {
  if (vacationDaysUsed <= 0) return "0.00";
  
  const efficiency = totalDaysOff / vacationDaysUsed;
  return efficiency.toFixed(2);
};

/**
 * Beräkna totalt antal dagar i en period
 */
export const calculatePeriodDays = (start: Date, end: Date): number => {
  return differenceInDays(end, start) + 1;
};

/**
 * Beräkna antal semesterdagar som behövs för en period
 */
export const calculateVacationDaysNeeded = (start: Date, end: Date, holidays: Date[]): number => {
  let vacationDaysNeeded = 0;
  let currentDay = new Date(start);
  
  while (currentDay <= end) {
    if (!isDayOff(currentDay, holidays)) {
      vacationDaysNeeded++;
    }
    currentDay = addDays(currentDay, 1);
  }
  
  return vacationDaysNeeded;
};
